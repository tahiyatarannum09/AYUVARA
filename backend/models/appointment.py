from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    doctor_name = Column(String(120), nullable=False, index=True)
    specialty = Column(String(80), default="")
    clinic = Column(String(150), default="")
    address = Column(Text, default="")
    appt_date = Column(String(20), nullable=False, index=True)  # YYYY-MM-DD
    appt_time = Column(String(10), default="")       # HH:MM
    notes = Column(Text, default="")
    reminder_sent = Column(Boolean, default=False, index=True)
    is_completed = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="appointments")

    __table_args__ = (
        Index("idx_patient_appt_date", "patient_id", "appt_date", "is_completed"),
    )
