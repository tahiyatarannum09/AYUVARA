from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.appointment import Appointment
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/appointments", tags=["appointments"])

class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_name: str
    specialty: Optional[str] = ""
    clinic: Optional[str] = ""
    address: Optional[str] = ""
    appt_date: str
    appt_time: Optional[str] = ""
    notes: Optional[str] = ""

class AppointmentUpdate(BaseModel):
    doctor_name: Optional[str] = None
    specialty: Optional[str] = None
    clinic: Optional[str] = None
    address: Optional[str] = None
    appt_date: Optional[str] = None
    appt_time: Optional[str] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None

@router.get("/{patient_id}")
async def get_appointments(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Appointment).where(Appointment.patient_id == patient_id).order_by(Appointment.appt_date)
    )
    appts = result.scalars().all()
    return [{
        "id": a.id, "doctor_name": a.doctor_name, "specialty": a.specialty,
        "clinic": a.clinic, "address": a.address, "appt_date": a.appt_date,
        "appt_time": a.appt_time, "notes": a.notes, "reminder_sent": a.reminder_sent,
        "is_completed": a.is_completed
    } for a in appts]

@router.post("/")
async def add_appointment(data: AppointmentCreate, db: AsyncSession = Depends(get_db)):
    appt = Appointment(**data.model_dump())
    db.add(appt)
    await db.commit()
    await db.refresh(appt)
    return {"id": appt.id, "message": "Appointment added"}

@router.put("/{appt_id}")
async def update_appointment(appt_id: int, data: AppointmentUpdate, db: AsyncSession = Depends(get_db)):
    appt = await db.get(Appointment, appt_id)
    if not appt:
        raise HTTPException(404, "Not found")
    for field, value in data.model_dump(exclude_none=True).items():
        setattr(appt, field, value)
    await db.commit()
    return {"message": "Updated"}

@router.delete("/{appt_id}")
async def delete_appointment(appt_id: int, db: AsyncSession = Depends(get_db)):
    appt = await db.get(Appointment, appt_id)
    if not appt:
        raise HTTPException(404, "Not found")
    await db.delete(appt)
    await db.commit()
    return {"message": "Deleted"}

