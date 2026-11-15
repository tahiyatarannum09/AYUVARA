# Helix ElderCare · 3D Smart Healthcare Management Platform
> **PromptWars × Catalyst (Build with AI — Google for Developers)**  
> **Challenge:** Elderly Care & Medication Management Platform

---

## 🌟 Executive Summary & Problem Statement Alignment

Elderly individuals frequently face complex pharmacotherapy regimens, increasing risks of missed doses, accidental adverse drug-drug interactions, and severe fall incidents. 

**Helix ElderCare** is an interconnected, multi-stakeholder healthcare management platform built around the elderly individual as the center of care. It seamlessly unifies:
1. **The Elderly Person (Dorothy Williams, Age 76):** High-contrast, senior-friendly interfaces with large touch targets, 3D bi-color medication capsules, and one-click ingestion confirmation.
2. **Family Caregivers (Sarah Williams):** Real-time spatial tracking across residence zones, proactive missed dose alerts, and subjective well-being logs.
3. **Attending Clinicians & Nurses (Dr. Robert Chen, Marcus Vance RN):** Longitudinal 3D voxel adherence analytics, automated drug interaction conflict guards, and one-click physician briefing dossier exports.

---

## 🚀 Key Innovations (Beyond Basic Reminders)

### 1. 🏡 3D Isometric Residence & Spatial Localization (`/location`)
- **True 3D Isometric Architectural Floor Plan:** 30° axonometric projection rendering Bedroom, Bathroom, Living Room, Kitchen, Hallway, and Study with extruded 3D walls, realistic textures, and architectural furniture.
- **Dorothy's 3D Presence Hologram:** Floating holographic beacon with levitation physics and concentric pulsing floor radar ripples showing real-time dwell position.
- **Ambient Environmental Telemetry:** Real-time sensor gauges for temperature, indoor air quality (HEPA filter status), circadian lighting lumination, and smart perimeter locks.
- **Perspective Orbit Modes:** Instant toggling between *3D Isometric Architectural View*, *Cinematic Tilt View*, and *2D Technical Blueprint*.

### 2. 👁️ CCTV Computer Vision & Posture Classification (`/cctv`)
- **Autonomous YOLOv8-Pose Engine:** Live 30 FPS inference tracking 17 anatomical keypoints.
- **Real-Time Classification:** Instant detection of sitting, standing, walking, resting, and critical fall events.
- **Historical Telemetry Log:** Audit log documenting posture transitions and confidence metrics.

### 3. 💊 Interactive 3D Medication Capsules & Administration (`/medications`, `/`)
- **Realistic 3D Bi-Color Capsules:** Specular reflection highlights, color-coded dosage groups (Emerald/Gold, Sky/White, Crimson/Porcelain), and subtle hover tilt physics.
- **One-Click Ingestion Verification:** Mark doses as *Ingested* or *Skipped* with immediate compliance calculation.
- **Pharmacological Interaction Guard:** Automated drug-drug conflict engine (flagging anticoagulants, NSAIDs, SSRIs, and antiplatelets).

### 4. 📊 3D Voxel / Column Adherence Analytics (`/adherence`)
- **3D Isometric Adherence Matrix:** Dynamically extruded compliance voxels where column elevation scales with daily adherence percentage (≥85% crowned in emerald).

### 5. 🤖 Autonomous Proactive Background Daemon (`services/reminder_scheduler.py`)
- Automated background tasks executing every 10 minutes:
  - 30-minute advance dosage alerts to patient.
  - Overdue dose detection and caregiver email escalation.
  - 24-hour appointment reminders.
  - Morning wellness & schedule digests.

### 6. 📄 Physician Consultation Summary Dossier (`/doctor-prep`)
- One-click exportable clinical summary aggregating 7-day adherence ratios, average pain scores (NRS-11 scale), active prescriptions, and patient symptom notes.

---

## 🔒 Enterprise-Grade Production Security

Evaluated against strict production security benchmarks:
- **Salted Cryptographic Passcode Hashing:** PBKDF2 / Salted SHA-256 with per-record salts and constant-time comparison (`secrets.compare_digest`) preventing timing attacks.
- **Brute-Force Rate Limiting:** Enforces a maximum of 5 failed passcode attempts per 60-second window before locking the profile with HTTP 429 Too Many Requests.
- **Production HTTP Security Headers Middleware:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: geolocation=(self), microphone=(), camera=()`
- **Strict Pydantic Input Validation:** Type-safe models with length bounds and input sanitization on all endpoints.

---

## 🧪 Comprehensive Automated Test Suite

Run the full platform test suite with zero external dependencies:
```bash
cd backend
python -m unittest tests.test_platform
```

**Test Coverage Highlights:**
- `TestElderCareSecurity.test_salted_passcode_hashing`: Validates cryptographic salt generation and verification.
- `TestElderCareSecurity.test_legacy_passcode_compatibility`: Validates backwards compatibility.
- `TestElderCareSecurity.test_brute_force_lockout_logic`: Verifies rate limiter triggers at 5 consecutive failures.
- `TestDrugSafetyConflictChecker.test_conflict_rules_matrix`: Evaluates pharmacological contraindication rules.
- `TestMedicationAdherence.test_patient_records`: Queries active patient prescriptions and adherence logs.
- `TestMedicationAdherence.test_slot_generation_and_escalation`: Verifies proactive reminder slot generation.
- `TestLocationTelemetry.test_location`: Verifies real-time room tracking and telemetry logging.

---

## 💻 Tech Stack & Architecture

- **Backend:** FastAPI, SQLAlchemy 2.0 (Async), aiosqlite, Pydantic v2, Python 3.13.
- **Frontend:** React 18, Vite 5, Tailwind CSS, Lucide React, Recharts.
- **Vision Pipeline:** Ultralytics YOLOv8-Pose, OpenCV, MJPEG HTTP streaming.
- **Database:** SQLite with asynchronous WAL journaling.

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Startup
```bash
cd backend
pip install fastapi uvicorn sqlalchemy aiosqlite pydantic
python seed.py
python -m uvicorn main:app --host 127.0.0.1 --port 8002
```

### 3. Frontend Startup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

- **Demo Profile:** Dorothy Williams
- **Security PIN:** `1234` (or click the "1-Click Login" button)

---

## 👥 Multi-Stakeholder Roles Supported

| Stakeholder | Role in Ecosystem | Access Level |
|---|---|---|
| **Dorothy Williams** | Central Patient (Age 76) | Full profile owner, one-click dose confirmation, vital logging |
| **Sarah Williams** | Daughter & Primary Caregiver | Spatial location monitoring, missed dose email alerts |
| **Dr. Robert Chen** | Attending Cardiologist | Adherence trends, visit dossier review, regimen modification |
| **Marcus Vance, RN** | Home Healthcare Nurse | Physical posture telemetry, fall risk notifications |

---
*Built for PromptWars × Catalyst 2026. Empowering seniors to live safely, independently, and with dignity.*
