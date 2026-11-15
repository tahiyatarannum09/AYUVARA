"""
AYUVARA Healthcare Ecosystem - API Module Package
==================================================
Provides RESTful endpoints for:
- Secure Passcode Authentication & Session Validation
- Multi-Stakeholder Patient Health Record Overview
- Prescription Scheduling & Pharmacological Conflict Prevention
- Medication Adherence Tracking (Taken, Skipped, Overdue)
- Proactive Email Notification & Escalation Logging
- Care Circle & Caregiver Network Administration
- Comprehensive Physician Consultation & Adherence Reports
- Real-Time Spatial Location & Sensor Monitoring
"""

from . import auth, patients, medications, appointments, care_circle, notifications, doctor_prep, location

__all__ = [
    "auth",
    "patients",
    "medications",
    "appointments",
    "care_circle",
    "notifications",
    "doctor_prep",
    "location",
]
