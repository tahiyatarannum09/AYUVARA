import time
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.patient import Patient
from pydantic import BaseModel, Field

router = APIRouter(prefix="/auth", tags=["auth"])

# Rate limiting data structure for brute-force protection
# patient_id -> list of failed timestamp seconds
FAILED_ATTEMPTS = defaultdict(list)
LOCKOUT_WINDOW_SECONDS = 60
MAX_ATTEMPTS = 5

class PasscodeRequest(BaseModel):
    patient_id: int
    passcode: str = Field(..., min_length=4, max_length=16, description="Passcode PIN")

class PasscodeResponse(BaseModel):
    success: bool
    patient_id: int
    name: str
    message: str

@router.post("/verify-passcode", response_model=PasscodeResponse)
async def verify_passcode(req: PasscodeRequest, request: Request, db: AsyncSession = Depends(get_db)):
    now = time.time()
    attempts = [t for t in FAILED_ATTEMPTS[req.patient_id] if now - t < LOCKOUT_WINDOW_SECONDS]
    FAILED_ATTEMPTS[req.patient_id] = attempts
    
    if len(attempts) >= MAX_ATTEMPTS:
        retry_after = int(LOCKOUT_WINDOW_SECONDS - (now - attempts[0]))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Security lockout: Too many failed passcode attempts. Please retry in {max(1, retry_after)} seconds."
        )

    patient = await db.get(Patient, req.patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found")
        
    if not patient.verify_passcode(req.passcode):
        FAILED_ATTEMPTS[req.patient_id].append(now)
        remaining = MAX_ATTEMPTS - len(FAILED_ATTEMPTS[req.patient_id])
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid passcode. {remaining} attempt(s) remaining before security lockout."
        )

    # Success: Reset failed attempts
    FAILED_ATTEMPTS.pop(req.patient_id, None)
    return PasscodeResponse(
        success=True,
        patient_id=patient.id,
        name=patient.name,
        message="Authentication successful. Profile unlocked."
    )

