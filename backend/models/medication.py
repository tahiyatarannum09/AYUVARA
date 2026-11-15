from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class Medication(Base):
    __tablename__ = "medications"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    name = Column(String(150), nullable=False)
    dosage = Column(String(80), default="")
    form = Column(String(50), default="tablet")  # tablet|capsule|liquid|injection|patch
    instructions = Column(Text, default="")
    color_code = Column(String(10), default="#6366f1")
    with_food = Column(Boolean, default=False)
    conflict_group = Column(String(50), default="")
    is_active = Column(Boolean, default=True)
    start_date = Column(String(20))
    end_date = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="medications")
    schedules = relationship("MedSchedule", back_populates="medication", cascade="all, delete")
    adherence_logs = relationship("AdherenceLog", back_populates="medication", cascade="all, delete")


class MedSchedule(Base):
    __tablename__ = "med_schedules"
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    times_of_day = Column(Text)   # JSON: ["08:00","13:00","20:00"]
    days_of_week = Column(Text, default='["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]')

    medication = relationship("Medication", back_populates="schedules")


class AdherenceLog(Base):
    __tablename__ = "adherence_logs"
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    patient_id = Column(Integer, nullable=False, index=True)
    scheduled_date = Column(String(20))   # YYYY-MM-DD
    scheduled_time = Column(String(10))   # HH:MM
    taken_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="pending")  # pending|taken|missed|skipped

    medication = relationship("Medication", back_populates="adherence_logs")

