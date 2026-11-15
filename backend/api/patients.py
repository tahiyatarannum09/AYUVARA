from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.patient import Patient, CareCircleMember, MoodLog
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/patients", tags=["patients"])

class PatientCreate(BaseModel):
    name: str
    dob: Optional[str] = ""
    passcode: str
    emergency_contact_name: Optional[str] = ""
    emergency_contact_phone: Optional[str] = ""
    medical_notes: Optional[str] = ""
    blood_type: Optional[str] = ""
    allergies: Optional[str] = ""

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_notes: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None

class MoodLogCreate(BaseModel):
    patient_id: int
    mood: int
    energy: int
    pain_level: int
    notes: Optional[str] = ""

@router.get("/")
async def list_patients(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Patient))
    patients = result.scalars().all()
    return [{"id": p.id, "name": p.name, "dob": p.dob, "blood_type": p.blood_type} for p in patients]

@router.post("/")
async def create_patient(data: PatientCreate, db: AsyncSession = Depends(get_db)):
    patient = Patient(
        name=data.name, dob=data.dob,
        emergency_contact_name=data.emergency_contact_name,
        emergency_contact_phone=data.emergency_contact_phone,
        medical_notes=data.medical_notes,
        blood_type=data.blood_type,
        allergies=data.allergies
    )
    patient.set_passcode(data.passcode)
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return {"id": patient.id, "name": patient.name, "message": "Patient created"}

@router.get("/{patient_id}")
async def get_patient(patient_id: int, db: AsyncSession = Depends(get_db)):
    p = await db.get(Patient, patient_id)
    if not p:
        raise HTTPException(404, "Patient not found")
    return {
        "id": p.id, "name": p.name, "dob": p.dob, "photo_url": p.photo_url,
        "emergency_contact_name": p.emergency_contact_name,
        "emergency_contact_phone": p.emergency_contact_phone,
        "medical_notes": p.medical_notes, "blood_type": p.blood_type,
        "allergies": p.allergies, "created_at": p.created_at
    }

@router.put("/{patient_id}")
async def update_patient(patient_id: int, data: PatientUpdate, db: AsyncSession = Depends(get_db)):
    p = await db.get(Patient, patient_id)
    if not p:
        raise HTTPException(404, "Patient not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(p, field, value)
    await db.commit()
    return {"message": "Updated"}

@router.post("/mood")
async def log_mood(data: MoodLogCreate, db: AsyncSession = Depends(get_db)):
    log = MoodLog(
        patient_id=data.patient_id, mood=data.mood,
        energy=data.energy, pain_level=data.pain_level, notes=data.notes
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return {"id": log.id, "message": "Mood logged"}

@router.get("/{patient_id}/mood")
async def get_mood_logs(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MoodLog).where(MoodLog.patient_id == patient_id).order_by(MoodLog.logged_at.desc()).limit(30)
    )
    logs = result.scalars().all()
    return [{"id": l.id, "mood": l.mood, "energy": l.energy, "pain_level": l.pain_level,
             "notes": l.notes, "logged_at": l.logged_at} for l in logs]

