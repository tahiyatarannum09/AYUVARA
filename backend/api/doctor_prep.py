from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.patient import Patient, MoodLog
from models.medication import Medication, MedSchedule, AdherenceLog
from models.appointment import Appointment
import json
from datetime import date, timedelta

router = APIRouter(prefix="/doctor-prep", tags=["doctor-prep"])

@router.get("/{patient_id}")
async def get_doctor_prep(patient_id: int, db: AsyncSession = Depends(get_db)):
    """Generate a comprehensive doctor visit summary."""
    patient = await db.get(Patient, patient_id)
    if not patient:
        return {"error": "Patient not found"}

    meds_result = await db.execute(
        select(Medication).where(Medication.patient_id == patient_id, Medication.is_active == True)
    )
    meds = meds_result.scalars().all()

    mood_result = await db.execute(
        select(MoodLog).where(MoodLog.patient_id == patient_id)
        .order_by(MoodLog.logged_at.desc()).limit(14)
    )
    moods = mood_result.scalars().all()

    appt_result = await db.execute(
        select(Appointment).where(
            Appointment.patient_id == patient_id,
            Appointment.is_completed == False
        ).order_by(Appointment.appt_date).limit(3)
    )
    upcoming_appts = appt_result.scalars().all()

    # Adherence last 7 days
    week_ago = (date.today() - timedelta(days=7)).isoformat()
    adh_result = await db.execute(
        select(AdherenceLog).where(
            AdherenceLog.patient_id == patient_id,
            AdherenceLog.scheduled_date >= week_ago
        )
    )
    adh_logs = adh_result.scalars().all()
    total = len(adh_logs)
    taken = sum(1 for l in adh_logs if l.status == "taken")
    adherence_pct = round((taken / total * 100) if total else 0, 1)

    avg_mood = round(sum(m.mood for m in moods) / len(moods), 1) if moods else None
    avg_pain = round(sum(m.pain_level for m in moods) / len(moods), 1) if moods else None

    return {
        "patient": {
            "name": patient.name, "dob": patient.dob, "blood_type": patient.blood_type,
            "allergies": patient.allergies, "medical_notes": patient.medical_notes,
            "emergency_contact": f"{patient.emergency_contact_name} ({patient.emergency_contact_phone})"
        },
        "medications": [{"name": m.name, "dosage": m.dosage, "form": m.form,
                          "instructions": m.instructions, "with_food": m.with_food} for m in meds],
        "wellness_summary": {
            "avg_mood_7d": avg_mood,
            "avg_pain_7d": avg_pain,
            "adherence_7d_pct": adherence_pct,
            "total_doses": total,
            "doses_taken": taken
        },
        "upcoming_appointments": [{"doctor": a.doctor_name, "specialty": a.specialty,
                                    "date": a.appt_date, "time": a.appt_time,
                                    "clinic": a.clinic} for a in upcoming_appts],
        "recent_mood_notes": [{"date": m.logged_at.date().isoformat(), "mood": m.mood,
                                "energy": m.energy, "pain": m.pain_level, "notes": m.notes}
                              for m in moods[:7]]
    }

