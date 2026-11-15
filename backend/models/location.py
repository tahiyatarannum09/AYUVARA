from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Index
from models.database import Base
from datetime import datetime

class LocationLog(Base):
    __tablename__ = "location_logs"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    room = Column(String(60), nullable=False, index=True)         # e.g. "Living Room"
    zone = Column(String(30), default="")                        # e.g. "sofa", "bed"
    source = Column(String(20), default="manual")                # manual | sensor | auto
    note = Column(Text, default="")
    logged_at = Column(DateTime, default=datetime.utcnow, index=True)
    is_alert = Column(Boolean, default=False, index=True)        # True if safety concern

    __table_args__ = (
        Index("idx_location_patient_logged", "patient_id", "logged_at"),
    )

class SafetyAlert(Base):
    __tablename__ = "safety_alerts"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    alert_type = Column(String(50), index=True)   # no_movement | unusual_time | fall_risk
    message = Column(Text)
    room = Column(String(60), default="")
    resolved = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    resolved_at = Column(DateTime, nullable=True)
