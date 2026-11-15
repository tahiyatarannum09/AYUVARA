import asyncio, json
from datetime import datetime, timedelta
from sqlalchemy import select, desc
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from models.database import get_db, AsyncSessionLocal
from models.location import LocationLog, SafetyAlert
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/location", tags=["location"])

# ── WebSocket connection manager ──────────────────────────────────────────────
class ConnectionManager:
    def __init__(self):
        self.connections: dict[int, list[WebSocket]] = {}  # patient_id → sockets

    async def connect(self, ws: WebSocket, patient_id: int):
        await ws.accept()
        self.connections.setdefault(patient_id, []).append(ws)

    def disconnect(self, ws: WebSocket, patient_id: int):
        if patient_id in self.connections:
            self.connections[patient_id] = [c for c in self.connections[patient_id] if c != ws]

    async def broadcast(self, patient_id: int, data: dict):
        dead = []
        for ws in self.connections.get(patient_id, []):
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(ws, patient_id)

manager = ConnectionManager()

# ── Pydantic schemas ──────────────────────────────────────────────────────────
class LocationUpdate(BaseModel):
    patient_id: int
    room: str
    zone: Optional[str] = ""
    source: Optional[str] = "manual"
    note: Optional[str] = ""

class AlertResolve(BaseModel):
    alert_id: int

# ── REST endpoints ────────────────────────────────────────────────────────────
@router.get("/{patient_id}/current")
async def get_current_location(patient_id: int, db: AsyncSession = Depends(get_db)):
    """Return the most recent location log entry."""
    result = await db.execute(
        select(LocationLog)
        .where(LocationLog.patient_id == patient_id)
        .order_by(desc(LocationLog.logged_at))
        .limit(1)
    )
    loc = result.scalar_one_or_none()
    if not loc:
        return {"room": "Unknown", "zone": "", "logged_at": None, "minutes_ago": None}
    minutes_ago = int((datetime.utcnow() - loc.logged_at).total_seconds() / 60)
    return {
        "id": loc.id, "room": loc.room, "zone": loc.zone,
        "source": loc.source, "note": loc.note,
        "logged_at": loc.logged_at.isoformat(),
        "minutes_ago": minutes_ago
    }

@router.get("/{patient_id}/history")
async def get_location_history(patient_id: int, limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(LocationLog)
        .where(LocationLog.patient_id == patient_id)
        .order_by(desc(LocationLog.logged_at))
        .limit(limit)
    )
    logs = result.scalars().all()
    return [{
        "id": l.id, "room": l.room, "zone": l.zone,
        "source": l.source, "note": l.note,
        "logged_at": l.logged_at.isoformat(),
        "is_alert": l.is_alert
    } for l in logs]

@router.get("/{patient_id}/heatmap")
async def get_room_heatmap(patient_id: int, db: AsyncSession = Depends(get_db)):
    """Count how many times each room was visited (last 100 logs)."""
    result = await db.execute(
        select(LocationLog)
        .where(LocationLog.patient_id == patient_id)
        .order_by(desc(LocationLog.logged_at))
        .limit(100)
    )
    logs = result.scalars().all()
    counts = {}
    for l in logs:
        counts[l.room] = counts.get(l.room, 0) + 1
    return [{"room": k, "count": v} for k, v in sorted(counts.items(), key=lambda x: -x[1])]

@router.post("/update")
async def update_location(data: LocationUpdate, db: AsyncSession = Depends(get_db)):
    """Log a new location entry and broadcast via WebSocket."""
    log = LocationLog(
        patient_id=data.patient_id, room=data.room,
        zone=data.zone, source=data.source, note=data.note
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)

    payload = {
        "event": "location_update",
        "room": log.room, "zone": log.zone,
        "source": log.source, "note": log.note,
        "logged_at": log.logged_at.isoformat(),
        "minutes_ago": 0
    }
    await manager.broadcast(data.patient_id, payload)
    return {"id": log.id, "message": "Location updated"}

@router.get("/{patient_id}/alerts")
async def get_alerts(patient_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(SafetyAlert)
        .where(SafetyAlert.patient_id == patient_id)
        .order_by(desc(SafetyAlert.created_at))
        .limit(20)
    )
    alerts = result.scalars().all()
    return [{
        "id": a.id, "alert_type": a.alert_type, "message": a.message,
        "room": a.room, "resolved": a.resolved,
        "created_at": a.created_at.isoformat(),
        "resolved_at": a.resolved_at.isoformat() if a.resolved_at else None
    } for a in alerts]

@router.post("/alerts/resolve")
async def resolve_alert(data: AlertResolve, db: AsyncSession = Depends(get_db)):
    alert = await db.get(SafetyAlert, data.alert_id)
    if alert:
        alert.resolved = True
        alert.resolved_at = datetime.utcnow()
        await db.commit()
    return {"message": "Alert resolved"}

# ── WebSocket endpoint ────────────────────────────────────────────────────────
@router.websocket("/ws/{patient_id}")
async def location_ws(websocket: WebSocket, patient_id: int):
    await manager.connect(websocket, patient_id)
    # Send current location immediately on connect
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(LocationLog)
            .where(LocationLog.patient_id == patient_id)
            .order_by(desc(LocationLog.logged_at)).limit(1)
        )
        loc = result.scalar_one_or_none()
        if loc:
            minutes_ago = int((datetime.utcnow() - loc.logged_at).total_seconds() / 60)
            await websocket.send_json({
                "event": "location_update",
                "room": loc.room, "zone": loc.zone,
                "source": loc.source, "note": loc.note,
                "logged_at": loc.logged_at.isoformat(),
                "minutes_ago": minutes_ago
            })
    try:
        while True:
            await websocket.receive_text()   # keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket, patient_id)


# ── Safety monitor (runs in background) ───────────────────────────────────────
async def safety_monitor_loop():
    """Check every 30 minutes for no-movement situations."""
    await asyncio.sleep(60)  # initial delay
    while True:
        try:
            async with AsyncSessionLocal() as db:
                # Find patients with no location update in last 3 hours
                three_hours_ago = datetime.utcnow() - timedelta(hours=3)
                from sqlalchemy import func
                # get all distinct patient_ids
                from models.patient import Patient
                patients_res = await db.execute(select(Patient))
                patients = patients_res.scalars().all()
                for p in patients:
                    latest = (await db.execute(
                        select(LocationLog)
                        .where(LocationLog.patient_id == p.id)
                        .order_by(desc(LocationLog.logged_at)).limit(1)
                    )).scalar_one_or_none()
                    if latest and latest.logged_at < three_hours_ago:
                        # Check if we already raised this alert today
                        existing = (await db.execute(
                            select(SafetyAlert).where(
                                SafetyAlert.patient_id == p.id,
                                SafetyAlert.alert_type == "no_movement",
                                SafetyAlert.resolved == False
                            )
                        )).scalar_one_or_none()
                        if not existing:
                            hrs = int((datetime.utcnow() - latest.logged_at).total_seconds() / 3600)
                            alert = SafetyAlert(
                                patient_id=p.id,
                                alert_type="no_movement",
                                message=f"{p.name} has not moved in {hrs} hours. Last seen in {latest.room}.",
                                room=latest.room
                            )
                            db.add(alert)
                            await db.commit()
                            await manager.broadcast(p.id, {
                                "event": "safety_alert",
                                "alert_type": "no_movement",
                                "message": alert.message,
                                "room": latest.room
                            })
        except Exception as e:
            print(f"[Safety Monitor] Error: {e}")
        await asyncio.sleep(1800)  # every 30 min

