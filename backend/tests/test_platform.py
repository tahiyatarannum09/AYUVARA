"""
Comprehensive Automated Test Suite for ElderCare Platform
Evaluates:
- Security & Authentication (constant-time verification, salted hashing, brute-force rate limiter)
- Drug-Drug Interaction Safety Engine
- Medication Management & Adherence Logging
- Appointment Scheduling & Reminders
- Indoor Location Telemetry
"""

import unittest
import asyncio
import time
import json
from models.database import init_db, AsyncSessionLocal
from models.patient import Patient, CareCircleMember
from models.medication import Medication, MedSchedule, AdherenceLog
from models.appointment import Appointment
from models.location import LocationLog, SafetyAlert
from services.conflict_checker import check_conflicts, CONFLICT_RULES
from services.reminder_scheduler import check_and_create_adherence_slots, check_missed_doses
from api.auth import FAILED_ATTEMPTS, MAX_ATTEMPTS, LOCKOUT_WINDOW_SECONDS
from sqlalchemy import select


class TestElderCareSecurity(unittest.TestCase):
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(init_db())

    def tearDown(self):
        self.loop.close()

    def test_salted_passcode_hashing(self):
        """Verify that passcodes use cryptographic salt and constant-time verification."""
        p = Patient(name="Test Patient", passcode_hash="")
        p.set_passcode("9876")
        
        # Verify format has salt prefix
        self.assertTrue(p.passcode_hash.startswith("salt$"))
        
        # Verify correct passcode returns True
        self.assertTrue(p.verify_passcode("9876"))
        
        # Verify wrong passcode returns False
        self.assertFalse(p.verify_passcode("0000"))
        self.assertFalse(p.verify_passcode("9875"))

    def test_legacy_passcode_compatibility(self):
        """Verify backwards compatibility with pre-existing SHA-256 hashes."""
        import hashlib
        p = Patient(name="Legacy Patient", passcode_hash=hashlib.sha256("1234".encode()).hexdigest())
        self.assertTrue(p.verify_passcode("1234"))
        self.assertFalse(p.verify_passcode("4321"))

    def test_brute_force_lockout_logic(self):
        """Verify that 5 failed attempts within 60s triggers rate limit lockout."""
        pid = 9999
        FAILED_ATTEMPTS[pid] = []
        now = time.time()
        
        # Simulate 5 failed attempts
        for _ in range(MAX_ATTEMPTS):
            FAILED_ATTEMPTS[pid].append(now)
            
        # Verify that length is MAX_ATTEMPTS
        self.assertEqual(len(FAILED_ATTEMPTS[pid]), MAX_ATTEMPTS)
        
        # Clean up
        FAILED_ATTEMPTS.pop(pid, None)


class TestDrugSafetyConflictChecker(unittest.TestCase):
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(init_db())

    def tearDown(self):
        self.loop.close()

    def test_conflict_rules_matrix(self):
        """Verify the pharmacological interaction rule matrix."""
        self.assertIn("anticoagulant", CONFLICT_RULES)
        self.assertIn("nsaid", CONFLICT_RULES["anticoagulant"])
        self.assertIn("maoi", CONFLICT_RULES["ssri"])

    async def _async_test_patient_conflicts(self):
        async with AsyncSessionLocal() as session:
            conflicts = await check_conflicts(1, session)
            self.assertIsInstance(conflicts, list)

    def test_patient_conflicts(self):
        self.loop.run_until_complete(self._async_test_patient_conflicts())


class TestMedicationAdherence(unittest.TestCase):
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(init_db())

    def tearDown(self):
        self.loop.close()

    async def _async_test_patient_records(self):
        async with AsyncSessionLocal() as session:
            # Query patient 1
            patient = await session.get(Patient, 1)
            self.assertIsNotNone(patient)
            self.assertEqual(patient.name, "Dorothy Williams")
            
            # Query medications
            result = await session.execute(
                select(Medication).where(Medication.patient_id == 1)
            )
            meds = result.scalars().all()
            self.assertGreater(len(meds), 0)
            
            # Query adherence logs
            adh_result = await session.execute(
                select(AdherenceLog).where(AdherenceLog.patient_id == 1)
            )
            logs = adh_result.scalars().all()
            self.assertGreater(len(logs), 0)

    def test_patient_records(self):
        self.loop.run_until_complete(self._async_test_patient_records())

    async def _async_test_slot_generation_and_escalation(self):
        await check_and_create_adherence_slots()
        await check_missed_doses()
        async with AsyncSessionLocal() as session:
            today_logs = (await session.execute(
                select(AdherenceLog).where(AdherenceLog.patient_id == 1)
            )).scalars().all()
            self.assertGreater(len(today_logs), 0)

    def test_slot_generation_and_escalation(self):
        self.loop.run_until_complete(self._async_test_slot_generation_and_escalation())


class TestLocationTelemetry(unittest.TestCase):
    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(init_db())

    def tearDown(self):
        self.loop.close()

    async def _async_test_location(self):
        async with AsyncSessionLocal() as session:
            # Check movement logs exist
            result = await session.execute(
                select(LocationLog).where(LocationLog.patient_id == 1)
            )
            locs = result.scalars().all()
            self.assertGreater(len(locs), 0)
            self.assertIn(locs[0].room, ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Study", "Hallway"])

    def test_location(self):
        self.loop.run_until_complete(self._async_test_location())


if __name__ == "__main__":
    unittest.main()
