from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.sos import SOS
from app.models.user import User

from app.schemas.sos import (
    SOSCreate,
    SOSResponse,
    SOSStatusUpdate
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/sos",
    tags=["SOS"]
)


@router.post(
    "",
    response_model=SOSResponse
)
def create_sos(
    sos_data: SOSCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    new_sos = SOS(
        user_id=current_user.id,
        latitude=sos_data.latitude,
        longitude=sos_data.longitude,
        message=sos_data.message,
        severity=sos_data.severity,
        status="PENDING"
    )

    db.add(new_sos)
    db.commit()
    db.refresh(new_sos)

    return new_sos


@router.get(
    "",
    response_model=list[SOSResponse]
)
def get_my_sos_cases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return (
        db.query(SOS)
        .filter(SOS.user_id == current_user.id)
        .order_by(SOS.created_at.desc())
        .all()
    )


@router.get(
    "/{sos_id}",
    response_model=SOSResponse
)
def get_sos(
    sos_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    sos = (
        db.query(SOS)
        .filter(
            SOS.id == sos_id,
            SOS.user_id == current_user.id
        )
        .first()
    )

    if not sos:
        raise HTTPException(
            status_code=404,
            detail="SOS case not found"
        )

    return sos
@router.put(
    "/{sos_id}/cancel",
    response_model=SOSResponse
)
def cancel_sos(
    sos_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    sos = (
        db.query(SOS)
        .filter(
            SOS.id == sos_id,
            SOS.user_id == current_user.id
        )
        .first()
    )

    if not sos:
        raise HTTPException(
            status_code=404,
            detail="SOS case not found"
        )

    if sos.status in ["RESOLVED", "CANCELLED"]:
        raise HTTPException(
            status_code=400,
            detail="SOS can no longer be cancelled"
        )

    sos.status = "CANCELLED"

    db.commit()
    db.refresh(sos)

    return sos