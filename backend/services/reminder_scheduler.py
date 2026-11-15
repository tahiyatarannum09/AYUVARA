import asyncio, json
from datetime import datetime, timedelta, date
from sqlalchemy import select, and_
from models.database import AsyncSessionLocal
from models.medication import Medication, MedSchedule, AdherenceLog
from models.appointment import Appointment
from models.patient import Patient, CareCircleMember
from services.email_service import mock_send_email

async def check_and_create_adherence_slots():
    """Create today's adherence slot entries for all active medications."""
    async with AsyncSessionLocal() as db:
        today = date.today().isoformat()
        meds = (await db.execute(select(Medication).where(Medication.is_active == True))).scalars().all()
        for med in meds:
            schedules = (await db.execute(select(MedSchedule).where(MedSchedule.medication_id == med.id))).scalars().all()
            for sched in schedules:
                times = json.loads(sched.times_of_day or "[]")
                for t in times:
                    exists = (await db.execute(
                        select(AdherenceLog).where(
                            and_(AdherenceLog.medication_id == med.id,
                                 AdherenceLog.scheduled_date == today,
                                 AdherenceLog.scheduled_time == t)
                        )
                    )).scalar_one_or_none()
                    if not exists:
                        db.add(AdherenceLog(
                            medication_id=med.id,
                            patient_id=med.patient_id,
                            scheduled_date=today,
                            scheduled_time=t,
                            status="pending"
                        ))
        await db.commit()


async def check_missed_doses():
    """Mark overdue pending doses as missed and send notifications."""
    async with AsyncSessionLocal() as db:
        now = datetime.now()
        today = now.date().isoformat()
        cutoff = (now - timedelta(hours=1)).strftime("%H:%M")
        pending = (await db.execute(
            select(AdherenceLog).where(
                and_(AdherenceLog.status == "pending",
                     AdherenceLog.scheduled_date == today,
                     AdherenceLog.scheduled_time <= cutoff)
            )
        )).scalars().all()
        for log in pending:
            log.status = "missed"
            med = await db.get(Medication, log.medication_id)
            patient = await db.get(Patient, log.patient_id)
            if med and patient:
                members = (await db.execute(
                    select(CareCircleMember).where(CareCircleMember.patient_id == patient.id,
                                                   CareCircleMember.is_active == True)
                )).scalars().all()
                emails = [m.email for m in members]
                await mock_send_email(
                    db=db, patient_id=patient.id,
                    notif_type="missed",
                    recipients=emails,
                    subject=f"⚠️ Missed Dose: {med.name} for {patient.name}",
                    body=f"{patient.name} missed their {log.scheduled_time} dose of {med.name} ({med.dosage}).\n\nPlease check on them."
                )
        await db.commit()


async def send_upcoming_reminders():
    """Send reminders for doses due in the next 30 minutes."""
    async with AsyncSessionLocal() as db:
        now = datetime.now()
        today = now.date().isoformat()
        soon = (now + timedelta(minutes=30)).strftime("%H:%M")
        current = now.strftime("%H:%M")
        pending = (await db.execute(
            select(AdherenceLog).where(
                and_(AdherenceLog.status == "pending",
                     AdherenceLog.scheduled_date == today,
                     AdherenceLog.scheduled_time >= current,
                     AdherenceLog.scheduled_time <= soon)
            )
        )).scalars().all()
        for log in pending:
            med = await db.get(Medication, log.medication_id)
            patient = await db.get(Patient, log.patient_id)
            if med and patient:
                await mock_send_email(
                    db=db, patient_id=patient.id,
                    notif_type="reminder",
                    recipients=[],
                    subject=f"💊 Upcoming Dose: {med.name} at {log.scheduled_time}",
                    body=f"Reminder: {patient.name} is due to take {med.name} ({med.dosage}) at {log.scheduled_time}.\n{med.instructions}"
                )
        await db.commit()


async def send_appointment_reminders():
    """Send reminders for appointments within the next 24 hours."""
    async with AsyncSessionLocal() as db:
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        today = date.today().isoformat()
        appts = (await db.execute(
            select(Appointment).where(
                and_(Appointment.reminder_sent == False,
                     Appointment.is_completed == False,
                     Appointment.appt_date.in_([today, tomorrow]))
            )
        )).scalars().all()
        for appt in appts:
            patient = await db.get(Patient, appt.patient_id)
            if patient:
                members = (await db.execute(
                    select(CareCircleMember).where(CareCircleMember.patient_id == patient.id,
                                                   CareCircleMember.is_active == True)
                )).scalars().all()
                emails = [m.email for m in members]
                await mock_send_email(
                    db=db, patient_id=patient.id,
                    notif_type="appointment",
                    recipients=emails,
                    subject=f"📅 Appointment Reminder: Dr. {appt.doctor_name} on {appt.appt_date}",
                    body=f"{patient.name} has an appointment with Dr. {appt.doctor_name} ({appt.specialty})\nDate: {appt.appt_date} at {appt.appt_time}\nLocation: {appt.clinic}\n\n{appt.notes}"
                )
                appt.reminder_sent = True
        await db.commit()


async def send_morning_digest():
    """Send a daily morning digest to all care circles at 8am."""
    now = datetime.now()
    if now.hour != 8:
        return
    async with AsyncSessionLocal() as db:
        today = now.date().isoformat()
        patients = (await db.execute(select(Patient))).scalars().all()
        for patient in patients:
            meds = (await db.execute(
                select(Medication).where(and_(Medication.patient_id == patient.id,
                                              Medication.is_active == True))
            )).scalars().all()
            if not meds:
                continue
            members = (await db.execute(
                select(CareCircleMember).where(CareCircleMember.patient_id == patient.id,
                                               CareCircleMember.is_active == True)
            )).scalars().all()
            emails = [m.email for m in members]
            med_list = "\n".join([f"  • {m.name} {m.dosage}" for m in meds])
            await mock_send_email(
                db=db, patient_id=patient.id,
                notif_type="digest",
                recipients=emails,
                subject=f"☀️ Daily Care Digest for {patient.name} — {today}",
                body=f"Good morning! Here is today's care summary for {patient.name}.\n\nMedications today:\n{med_list}\n\nStay healthy!"
            )
        await db.commit()


async def scheduler_loop():
    """Main background scheduler loop."""
    while True:
        try:
            await check_and_create_adherence_slots()
            await check_missed_doses()
            await send_upcoming_reminders()
            await send_appointment_reminders()
            await send_morning_digest()
        except Exception as e:
            print(f"[Scheduler] Error: {e}")
        await asyncio.sleep(600)  # run every 10 minutes

