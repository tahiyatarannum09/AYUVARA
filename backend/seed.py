"""Seed demo data: Dorothy Williams + medications + appointments + care circle."""
import asyncio, json, sys
sys.path.insert(0, ".")

from models.database import init_db, AsyncSessionLocal
from models.patient import Patient, CareCircleMember, MoodLog
from models.medication import Medication, MedSchedule, AdherenceLog
from models.appointment import Appointment
from datetime import date, timedelta, datetime

async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        # Patient
        patient = Patient(
            name="Dorothy Williams",
            dob="1948-03-15",
            emergency_contact_name="James Williams",
            emergency_contact_phone="+1-555-0192",
            medical_notes="Type 2 Diabetes, Hypertension, mild arthritis. Allergic to Penicillin.",
            blood_type="O+",
            allergies="Penicillin, Sulfa drugs"
        )
        patient.set_passcode("1234")
        db.add(patient)
        await db.flush()

        # Care Circle
        members = [
            CareCircleMember(patient_id=patient.id, name="James Williams", email="james@example.com", role="family"),
            CareCircleMember(patient_id=patient.id, name="Sarah Chen (Caretaker)", email="sarah@carehome.com", role="caretaker"),
        ]
        db.add_all(members)

        # Medications
        meds_data = [
            dict(name="Metformin", dosage="500mg", form="tablet", instructions="Take with meals to reduce stomach upset",
                 color_code="#10b981", with_food=True, conflict_group="", times=["08:00","20:00"]),
            dict(name="Lisinopril", dosage="10mg", form="tablet", instructions="Take in the morning. Monitor blood pressure",
                 color_code="#6366f1", with_food=False, conflict_group="", times=["08:00"]),
            dict(name="Aspirin", dosage="81mg", form="tablet", instructions="Low-dose for cardiovascular health",
                 color_code="#f59e0b", with_food=True, conflict_group="antiplatelet", times=["08:00"]),
            dict(name="Atorvastatin", dosage="20mg", form="tablet", instructions="Take at bedtime for best effect",
                 color_code="#ec4899", with_food=False, conflict_group="", times=["21:00"]),
            dict(name="Vitamin D3", dosage="1000 IU", form="capsule", instructions="Take with fatty meal for absorption",
                 color_code="#f97316", with_food=True, conflict_group="", times=["13:00"]),
        ]
        today = date.today().isoformat()
        for m in meds_data:
            times = m.pop("times")
            med = Medication(patient_id=patient.id, start_date=today, **m)
            db.add(med)
            await db.flush()
            db.add(MedSchedule(medication_id=med.id, times_of_day=json.dumps(times)))
            # Seed today's adherence slots
            for t in times:
                db.add(AdherenceLog(
                    medication_id=med.id, patient_id=patient.id,
                    scheduled_date=today, scheduled_time=t, status="pending"
                ))
            # Seed last 7 days adherence (mostly taken)
            for d in range(1, 8):
                past = (date.today() - timedelta(days=d)).isoformat()
                for t in times:
                    status = "taken" if d % 7 != 0 else "missed"
                    db.add(AdherenceLog(
                        medication_id=med.id, patient_id=patient.id,
                        scheduled_date=past, scheduled_time=t, status=status,
                        taken_at=datetime.utcnow() if status == "taken" else None
                    ))

        # Appointments
        appts = [
            Appointment(patient_id=patient.id, doctor_name="Dr. Priya Sharma",
                        specialty="Endocrinology", clinic="City Diabetes Centre",
                        address="123 Main St, Suite 400", notes="3-month diabetes review. Bring glucose log.",
                        appt_date=(date.today() + timedelta(days=3)).isoformat(), appt_time="10:30"),
            Appointment(patient_id=patient.id, doctor_name="Dr. Alan Beck",
                        specialty="Cardiology", clinic="Heart Health Institute",
                        address="456 Oak Ave", notes="Annual heart checkup. ECG required.",
                        appt_date=(date.today() + timedelta(days=14)).isoformat(), appt_time="14:00"),
            Appointment(patient_id=patient.id, doctor_name="Dr. Susan Park",
                        specialty="General Practice", clinic="Greenwood Family Clinic",
                        address="789 Elm Rd", notes="Routine checkup",
                        appt_date=(date.today() - timedelta(days=10)).isoformat(), appt_time="11:00",
                        is_completed=True),
        ]
        db.add_all(appts)

        # Mood Logs (last 7 days)
        import random
        random.seed(42)
        for d in range(7):
            past_dt = datetime.utcnow() - timedelta(days=d)
            db.add(MoodLog(
                patient_id=patient.id,
                mood=random.randint(3, 5),
                energy=random.randint(2, 4),
                pain_level=random.randint(1, 4),
                notes=random.choice(["Feeling good today", "A bit tired", "Joint pain in knees", "Great morning walk", ""]),
                logged_at=past_dt
            ))

        await db.commit()
        print(f"✅ Seed complete! Patient ID: {patient.id} | Passcode: 1234")
        print(f"   → {len(meds_data)} medications, {len(appts)} appointments, 2 care members")

if __name__ == "__main__":
    asyncio.run(seed())

