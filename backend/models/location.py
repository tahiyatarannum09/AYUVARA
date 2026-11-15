from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float
from models.database import Base
from datetime import datetime

class LocationLog(Base):
    __tablename__ = "location_logs"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    room = Column(String(60), nullable=False)         # e.g. "Living Room"
    zone = Column(String(30), default="")             # e.g. "sofa", "bed"
    source = Column(String(20), default="manual")     # manual | sensor | auto
    note = Column(Text, default="")
    logged_at = Column(DateTime, default=datetime.utcnow)
    is_alert = Column(Boolean, default=False)         # True if safety concern

class SafetyAlert(Base):
    __tablename__ = "safety_alerts"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    alert_type = Column(String(50))   # no_movement | unusual_time | fall_risk
    message = Column(Text)
    room = Column(String(60), default="")
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

