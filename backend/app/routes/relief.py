from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User
from app.models.relief import ReliefResource

from app.schemas.relief import (
    ReliefCreate,
    ReliefResponse,
    ReliefUpdate
)

from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/api/relief",
    tags=["Relief"]
)


@router.get(
    "",
    response_model=list[ReliefResponse]
)
def get_relief_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    return (
        db.query(ReliefResource)
        .order_by(ReliefResource.created_at.desc())
        .all()
    )


@router.post(
    "",
    response_model=ReliefResponse
)
def create_relief_resource(
    resource_data: ReliefCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in ["admin", "rescue_team"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to manage relief resources"
        )

    if resource_data.quantity < 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity cannot be negative"
        )

    resource = ReliefResource(
        name=resource_data.name,
        resource_type=resource_data.resource_type,
        quantity=resource_data.quantity,
        location=resource_data.location,
        status="AVAILABLE"
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


@router.put(
    "/{resource_id}",
    response_model=ReliefResponse
)
def update_relief_resource(
    resource_id: int,
    update_data: ReliefUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in ["admin", "rescue_team"]:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to manage relief resources"
        )

    resource = (
        db.query(ReliefResource)
        .filter(
            ReliefResource.id == resource_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Relief resource not found"
        )

    if update_data.quantity is not None:

        if update_data.quantity < 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity cannot be negative"
            )

        resource.quantity = update_data.quantity

    if update_data.status is not None:

        allowed_statuses = {
            "AVAILABLE",
            "LOW",
            "OUT_OF_STOCK"
        }

        if update_data.status not in allowed_statuses:
            raise HTTPException(
                status_code=400,
                detail="Invalid resource status"
            )

        resource.status = update_data.status

    db.commit()
    db.refresh(resource)

    return resource


@router.delete(
    "/{resource_id}"
)
def delete_relief_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    resource = (
        db.query(ReliefResource)
        .filter(
            ReliefResource.id == resource_id
        )
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Relief resource not found"
        )

    db.delete(resource)
    db.commit()

    return {
        "message": "Relief resource deleted successfully"
    }