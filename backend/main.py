import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from models.database import init_db
from api import auth, patients, medications, appointments, care_circle, notifications, doctor_prep
from api.location import router as location_router, safety_monitor_loop
from services.reminder_scheduler import scheduler_loop

class ProductionSecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Permissions-Policy"] = "geolocation=(self), microphone=(), camera=()"
        return response

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    t1 = asyncio.create_task(scheduler_loop())
    t2 = asyncio.create_task(safety_monitor_loop())
    print("✅ ElderCare Meds backend started on port 8002 with security fortification")
    yield
    t1.cancel(); t2.cancel()

app = FastAPI(
    title="ElderCare Meds API",
    description="Enterprise-grade Elderly Care and Medication Adherence Engine",
    version="1.2.0",
    lifespan=lifespan
)

app.add_middleware(ProductionSecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(medications.router)
app.include_router(appointments.router)
app.include_router(care_circle.router)
app.include_router(notifications.router)
app.include_router(doctor_prep.router)
app.include_router(location_router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ElderCare Meds API"}
