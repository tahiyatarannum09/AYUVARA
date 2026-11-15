from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from models.notification import NotificationLog

async def mock_send_email(
    db: AsyncSession,
    patient_id: int,
    notif_type: str,
    recipients: list,
    subject: str,
    body: str
):
    """
    Mock email sender — logs notification to DB instead of sending real email.
    In production, replace with smtplib or aiosmtplib + Gmail App Password.
    """
    for email in (recipients or ["[no-reply-mock]"]):
        log = NotificationLog(
            patient_id=patient_id,
            notif_type=notif_type,
            recipient_email=email,
            subject=subject,
            body=body,
            sent_at=datetime.utcnow(),
            status="mock"
        )
        db.add(log)
    # Print to console for visibility
    print(f"[EMAIL MOCK] {notif_type.upper()} | To: {recipients} | {subject}")

