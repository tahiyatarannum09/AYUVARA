from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.patient import CareCircleMember
from pydantic import BaseModel
from typing import Optional
import secrets

router = APIRouter(prefix="/care-circle", tags=["care-circle"])

class MemberAdd(BaseModel):
    patient_id: int
    name: str
    email: str
    role: Optional[str] = "family"

@router.get("/{patient_id}")
async def get_members(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CareCircleMember).where(CareCircleMember.patient_id == patient_id)
    )
    members = result.scalars().all()
    return [{
        "id": m.id, "name": m.name, "email": m.email, "role": m.role,
        "invite_code": m.invite_code, "is_active": m.is_active, "added_at": m.added_at
    } for m in members]

@router.post("/")
async def add_member(data: MemberAdd, db: AsyncSession = Depends(get_db)):
    member = CareCircleMember(
        patient_id=data.patient_id, name=data.name,
        email=data.email, role=data.role,
        invite_code=secrets.token_hex(8)
    )
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return {"id": member.id, "invite_code": member.invite_code, "message": "Member added"}

@router.delete("/{member_id}")
async def remove_member(member_id: int, db: AsyncSession = Depends(get_db)):
    m = await db.get(CareCircleMember, member_id)
    if not m:
        raise HTTPException(404, "Not found")
    m.is_active = False
    await db.commit()
    return {"message": "Member removed"}

