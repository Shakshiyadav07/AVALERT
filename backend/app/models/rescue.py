from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.sql import func

from app.database.database import Base


class RescueAssignment(Base):

    __tablename__ = "rescue_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sos_id = Column(
        Integer,
        ForeignKey("sos_cases.id"),
        nullable=False,
        unique=True,
        index=True
    )

    team_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    status = Column(
        String(30),
        nullable=False,
        default="ASSIGNED"
    )

    notes = Column(
        Text,
        nullable=True
    )

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    completed_at = Column(
        DateTime(timezone=True),
        nullable=True
    )