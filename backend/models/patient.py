import hashlib, secrets
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    dob = Column(String(20))
    photo_url = Column(String(255), default="")
    passcode_hash = Column(String(128), nullable=False)
    emergency_contact_name = Column(String(120), default="")
    emergency_contact_phone = Column(String(30), default="")
    medical_notes = Column(Text, default="")
    blood_type = Column(String(10), default="")
    allergies = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    medications = relationship("Medication", back_populates="patient", cascade="all, delete")
    appointments = relationship("Appointment", back_populates="patient", cascade="all, delete")
    notifications = relationship("NotificationLog", back_populates="patient", cascade="all, delete")

    def set_passcode(self, passcode: str):
        salt = secrets.token_hex(8)
        hashed = hashlib.sha256((salt + passcode).encode()).hexdigest()
        self.passcode_hash = f"salt${salt}${hashed}"

    def verify_passcode(self, passcode: str) -> bool:
        if not self.passcode_hash:
            return False
        # Salted format
        if self.passcode_hash.startswith("salt$"):
            try:
                _, salt, expected_hash = self.passcode_hash.split("$")
                calc_hash = hashlib.sha256((salt + passcode).encode()).hexdigest()
                return secrets.compare_digest(calc_hash, expected_hash)
            except Exception:
                return False
        # Legacy plain SHA-256 format with constant-time comparison
        calc_hash = hashlib.sha256(passcode.encode()).hexdigest()
        return secrets.compare_digest(calc_hash, self.passcode_hash)


class CareCircleMember(Base):
    """Linked to patient via patient_id (plain int — no FK to keep SQLite simple)."""
    __tablename__ = "care_circle_members"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(30), default="family")  # family | caretaker | doctor
    invite_code = Column(String(32), default=lambda: secrets.token_hex(8))
    is_active = Column(Boolean, default=True)
    added_at = Column(DateTime, default=datetime.utcnow)


class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    mood = Column(Integer)      # 1-5
    energy = Column(Integer)    # 1-5
    pain_level = Column(Integer)  # 0-10
    notes = Column(Text, default="")
    logged_at = Column(DateTime, default=datetime.utcnow)
