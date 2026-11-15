import json
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.medication import Medication, MedSchedule

# Simple conflict groups — medications in the same group shouldn't be taken together
CONFLICT_RULES = {
    "anticoagulant": ["nsaid", "antiplatelet", "anticoagulant"],
    "nsaid":         ["anticoagulant", "corticosteroid"],
    "maoi":          ["ssri", "snri", "maoi", "stimulant"],
    "ssri":          ["maoi", "snri"],
    "snri":          ["maoi", "ssri"],
    "corticosteroid":["nsaid"],
}

async def check_conflicts(patient_id: int, db: AsyncSession) -> list[dict]:
    """Return list of potential conflict pairs for a patient's active medications."""
    meds = (await db.execute(
        select(Medication).where(
            Medication.patient_id == patient_id,
            Medication.is_active == True,
            Medication.conflict_group != ""
        )
    )).scalars().all()

    conflicts = []
    for i, med_a in enumerate(meds):
        group_a = med_a.conflict_group.lower()
        risky_groups = CONFLICT_RULES.get(group_a, [])
        for med_b in meds[i+1:]:
            group_b = med_b.conflict_group.lower()
            if group_b in risky_groups or group_a in CONFLICT_RULES.get(group_b, []):
                conflicts.append({
                    "med_a": med_a.name,
                    "med_b": med_b.name,
                    "group_a": group_a,
                    "group_b": group_b,
                    "warning": f"Potential interaction between {med_a.name} ({group_a}) and {med_b.name} ({group_b}). Consult your doctor."
                })
    return conflicts

