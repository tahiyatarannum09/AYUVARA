from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.database import get_db
from models.notification import NotificationLog

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/{patient_id}")
async def get_notifications(patient_id: int, limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(NotificationLog).where(NotificationLog.patient_id == patient_id)
        .order_by(NotificationLog.sent_at.desc()).limit(limit)
    )
    logs = result.scalars().all()
    return [{
        "id": n.id, "notif_type": n.notif_type, "recipient_email": n.recipient_email,
        "subject": n.subject, "body": n.body, "sent_at": n.sent_at, "status": n.status
    } for n in logs]

