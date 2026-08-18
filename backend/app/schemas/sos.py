from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# CREATE SOS
# ============================================================

class SOSCreate(BaseModel):
    latitude: float
    longitude: float
    message: str | None = None
    severity: str = "HIGH"


# ============================================================
# SOS RESPONSE
# ============================================================

class SOSResponse(BaseModel):
    id: int
    user_id: int

    latitude: float
    longitude: float

    message: str | None

    severity: str
    status: str

    created_at: datetime
    updated_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# UPDATE SOS STATUS
# ============================================================

class SOSStatusUpdate(BaseModel):
    status: str


# ============================================================
# RESCUE SOS RESPONSE
# ============================================================

class RescueSOSResponse(BaseModel):
    id: int
    user_id: int

    citizen_name: str
    citizen_phone: str

    latitude: float
    longitude: float

    message: str | None

    severity: str
    status: str

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )