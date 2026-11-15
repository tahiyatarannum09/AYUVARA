from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.database import Base
from datetime import datetime

class NotificationLog(Base):
    __tablename__ = "notification_logs"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    notif_type = Column(String(50))   # reminder|missed|appointment|digest|conflict
    recipient_name = Column(String(120), default="")
    recipient_email = Column(String(255), default="")
    subject = Column(String(255))
    body = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="sent")   # sent|failed|mock

    patient = relationship("Patient", back_populates="notifications")
