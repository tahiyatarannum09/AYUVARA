import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.medication import Medication, MedSchedule, AdherenceLog
from services.conflict_checker import check_conflicts
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date

router = APIRouter(prefix="/medications", tags=["medications"])

class MedCreate(BaseModel):
    patient_id: int
    name: str
    dosage: Optional[str] = ""
    form: Optional[str] = "tablet"
    instructions: Optional[str] = ""
    color_code: Optional[str] = "#6366f1"
    with_food: Optional[bool] = False
    conflict_group: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = None
    times_of_day: Optional[List[str]] = []

class MedUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    form: Optional[str] = None
    instructions: Optional[str] = None
    color_code: Optional[str] = None
    with_food: Optional[bool] = None
    conflict_group: Optional[str] = None
    is_active: Optional[bool] = None
    times_of_day: Optional[List[str]] = None

class MarkDose(BaseModel):
    log_id: int
    status: str  # taken|missed|skipped

@router.get("/{patient_id}")
async def get_medications(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Medication).where(Medication.patient_id == patient_id)
    )
    meds = result.scalars().all()
    out = []
    for m in meds:
        scheds = (await db.execute(select(MedSchedule).where(MedSchedule.medication_id == m.id))).scalars().all()
        times = []
        for s in scheds:
            times.extend(json.loads(s.times_of_day or "[]"))
        out.append({
            "id": m.id, "name": m.name, "dosage": m.dosage, "form": m.form,
            "instructions": m.instructions, "color_code": m.color_code,
            "with_food": m.with_food, "conflict_group": m.conflict_group,
            "is_active": m.is_active, "start_date": m.start_date,
            "end_date": m.end_date, "times_of_day": times
        })
    return out

@router.post("/")
async def add_medication(data: MedCreate, db: AsyncSession = Depends(get_db)):
    med = Medication(
        patient_id=data.patient_id, name=data.name, dosage=data.dosage,
        form=data.form, instructions=data.instructions, color_code=data.color_code,
        with_food=data.with_food, conflict_group=data.conflict_group,
        start_date=data.start_date or date.today().isoformat(), end_date=data.end_date
    )
    db.add(med)
    await db.flush()
    if data.times_of_day:
        sched = MedSchedule(medication_id=med.id, times_of_day=json.dumps(data.times_of_day))
        db.add(sched)
    await db.commit()
    return {"id": med.id, "message": "Medication added"}

@router.put("/{med_id}")
async def update_medication(med_id: int, data: MedUpdate, db: AsyncSession = Depends(get_db)):
    med = await db.get(Medication, med_id)
    if not med:
        raise HTTPException(404, "Medication not found")
    update_data = data.model_dump(exclude_none=True)
    times = update_data.pop("times_of_day", None)
    for field, value in update_data.items():
        setattr(med, field, value)
    if times is not None:
        scheds = (await db.execute(select(MedSchedule).where(MedSchedule.medication_id == med_id))).scalars().all()
        for s in scheds:
            await db.delete(s)
        if times:
            db.add(MedSchedule(medication_id=med_id, times_of_day=json.dumps(times)))
    await db.commit()
    return {"message": "Updated"}

@router.delete("/{med_id}")
async def delete_medication(med_id: int, db: AsyncSession = Depends(get_db)):
    med = await db.get(Medication, med_id)
    if not med:
        raise HTTPException(404, "Not found")
    await db.delete(med)
    await db.commit()
    return {"message": "Deleted"}

@router.get("/{patient_id}/conflicts")
async def get_conflicts(patient_id: int, db: AsyncSession = Depends(get_db)):
    return await check_conflicts(patient_id, db)

@router.get("/{patient_id}/adherence/today")
async def today_adherence(patient_id: int, db: AsyncSession = Depends(get_db)):
    today = date.today().isoformat()
    result = await db.execute(
        select(AdherenceLog, Medication).join(Medication, AdherenceLog.medication_id == Medication.id).where(
            AdherenceLog.patient_id == patient_id, AdherenceLog.scheduled_date == today
        )
    )
    rows = result.all()
    return [{
        "log_id": row.AdherenceLog.id, "medication_id": row.Medication.id,
        "medication_name": row.Medication.name, "dosage": row.Medication.dosage,
        "color_code": row.Medication.color_code, "form": row.Medication.form,
        "scheduled_time": row.AdherenceLog.scheduled_time,
        "status": row.AdherenceLog.status,
        "taken_at": row.AdherenceLog.taken_at,
        "with_food": row.Medication.with_food
    } for row in rows]

@router.post("/adherence/mark")
async def mark_dose(data: MarkDose, db: AsyncSession = Depends(get_db)):
    log = await db.get(AdherenceLog, data.log_id)
    if not log:
        raise HTTPException(404, "Log not found")
    log.status = data.status
    if data.status == "taken":
        log.taken_at = datetime.utcnow()
    await db.commit()
    return {"message": f"Marked as {data.status}"}

@router.get("/{patient_id}/adherence/heatmap")
async def adherence_heatmap(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AdherenceLog).where(AdherenceLog.patient_id == patient_id).order_by(AdherenceLog.scheduled_date.desc()).limit(500)
    )
    logs = result.scalars().all()
    # Group by date
    by_date = {}
    for log in logs:
        d = log.scheduled_date
        if d not in by_date:
            by_date[d] = {"total": 0, "taken": 0, "missed": 0, "skipped": 0, "pending": 0}
        by_date[d]["total"] += 1
        by_date[d][log.status] = by_date[d].get(log.status, 0) + 1
    return [{"date": k, **v} for k, v in sorted(by_date.items())]

