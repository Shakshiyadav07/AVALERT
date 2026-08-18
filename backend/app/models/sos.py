from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Text
)

from sqlalchemy.sql import func

from app.database.database import Base


class SOS(Base):

    __tablename__ = "sos_cases"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    message = Column(
        Text,
        nullable=True
    )

    severity = Column(
        String(20),
        nullable=False,
        default="HIGH"
    )

    status = Column(
        String(30),
        nullable=False,
        default="PENDING"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )