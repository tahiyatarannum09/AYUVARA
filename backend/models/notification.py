from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class NotificationLog(Base):
    __tablename__ = "notification_logs"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False, index=True)
    notif_type = Column(String(50), index=True)   # reminder|missed|appointment|digest|conflict|emergency
    recipient_name = Column(String(120), default="")
    recipient_email = Column(String(255), default="", index=True)
    subject = Column(String(255))
    body = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow, index=True)
    status = Column(String(20), default="sent", index=True)   # sent|failed|mock

    patient = relationship("Patient", back_populates="notifications")

    __table_args__ = (
        Index("idx_notif_patient_sent", "patient_id", "sent_at"),
    )
