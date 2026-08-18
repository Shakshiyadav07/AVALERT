from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReliefCreate(BaseModel):
    name: str
    resource_type: str
    quantity: int
    location: str


class ReliefResponse(BaseModel):
    id: int
    name: str
    resource_type: str
    quantity: int
    location: str
    status: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


class ReliefUpdate(BaseModel):
    quantity: int | None = None
    status: str | None = None