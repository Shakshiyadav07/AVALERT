from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime
)

from sqlalchemy.sql import func

from app.database.database import Base


class ReliefResource(Base):

    __tablename__ = "relief_resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    resource_type = Column(
        String(50),
        nullable=False
    )

    quantity = Column(
        Integer,
        nullable=False,
        default=0
    )

    location = Column(
        String(255),
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False,
        default="AVAILABLE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )