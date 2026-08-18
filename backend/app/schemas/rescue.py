from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# CREATE RESCUE ASSIGNMENT
# ============================================================

class RescueAssignmentCreate(BaseModel):
    sos_id: int
    team_id: int
    notes: Optional[str] = None


# ============================================================
# RESCUE ASSIGNMENT RESPONSE
# ============================================================

class RescueAssignmentResponse(BaseModel):
    id: int
    sos_id: int
    team_id: int
    status: str
    notes: Optional[str] = None
    assigned_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# UPDATE RESCUE STATUS
# ============================================================

class RescueStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
