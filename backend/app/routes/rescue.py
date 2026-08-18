from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.sos import SOS
from app.models.user import User
from app.models.rescue import RescueAssignment

from app.schemas.sos import RescueSOSResponse

from app.schemas.rescue import (
    RescueAssignmentCreate,
    RescueAssignmentResponse,
    RescueStatusUpdate,
)

from app.auth.auth_handler import get_current_user


router = APIRouter(
    prefix="/api/rescue",
    tags=["Rescue"]
)


# ============================================================
# GET ACTIVE SOS CASES
# ============================================================

@router.get(
    "/sos",
    response_model=list[RescueSOSResponse]
)
def get_pending_sos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in [
        "rescue_team",
        "admin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Rescue team access required"
        )

    results = (
        db.query(SOS, User)
        .join(
            User,
            SOS.user_id == User.id
        )
        .filter(
            SOS.status.in_([
                "PENDING",
                "ASSIGNED",
                "IN_PROGRESS"
            ])
        )
        .order_by(
            SOS.created_at.desc()
        )
        .all()
    )

    return [
        RescueSOSResponse(
            id=sos.id,
            user_id=sos.user_id,
            citizen_name=user.name,
            citizen_phone=user.phone,
            latitude=sos.latitude,
            longitude=sos.longitude,
            message=sos.message,
            severity=sos.severity,
            status=sos.status,
            created_at=sos.created_at
        )
        for sos, user in results
    ]


# ============================================================
# CREATE RESCUE ASSIGNMENT
# ============================================================

@router.post(
    "/assign",
    response_model=RescueAssignmentResponse
)
def assign_rescue_team(
    assignment_data: RescueAssignmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in [
        "rescue_team",
        "admin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Rescue team access required"
        )

    # Check SOS exists
    sos = (
        db.query(SOS)
        .filter(
            SOS.id == assignment_data.sos_id
        )
        .first()
    )

    if not sos:
        raise HTTPException(
            status_code=404,
            detail="SOS case not found"
        )

    # Check rescue team exists
    team = (
        db.query(User)
        .filter(
            User.id == assignment_data.team_id,
            User.role == "rescue_team"
        )
        .first()
    )

    if not team:
        raise HTTPException(
            status_code=404,
            detail="Rescue team member not found"
        )

    # Prevent duplicate assignment
    existing_assignment = (
        db.query(RescueAssignment)
        .filter(
            RescueAssignment.sos_id == assignment_data.sos_id
        )
        .first()
    )

    if existing_assignment:
        raise HTTPException(
            status_code=400,
            detail="SOS is already assigned"
        )

    # Prevent assigning cancelled/resolved SOS
    if sos.status in [
        "CANCELLED",
        "RESOLVED"
    ]:
        raise HTTPException(
            status_code=400,
            detail="SOS cannot be assigned"
        )

    assignment = RescueAssignment(
        sos_id=assignment_data.sos_id,
        team_id=assignment_data.team_id,
        status="ASSIGNED",
        notes=assignment_data.notes
    )

    sos.status = "ASSIGNED"

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


# ============================================================
# GET ALL RESCUE ASSIGNMENTS
# ============================================================

@router.get(
    "/assignments",
    response_model=list[RescueAssignmentResponse]
)
def get_assignments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in [
        "rescue_team",
        "admin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Rescue team access required"
        )

    return (
        db.query(RescueAssignment)
        .order_by(
            RescueAssignment.assigned_at.desc()
        )
        .all()
    )


# ============================================================
# UPDATE RESCUE STATUS
# ============================================================

@router.put(
    "/assign/{assignment_id}/status",
    response_model=RescueAssignmentResponse
)
def update_rescue_status(
    assignment_id: int,
    status_data: RescueStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if current_user.role not in [
        "rescue_team",
        "admin"
    ]:
        raise HTTPException(
            status_code=403,
            detail="Rescue team access required"
        )

    assignment = (
        db.query(RescueAssignment)
        .filter(
            RescueAssignment.id == assignment_id
        )
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Rescue assignment not found"
        )

    allowed_statuses = {
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED"
    }

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid rescue status"
        )

    assignment.status = status_data.status

    if status_data.notes is not None:
        assignment.notes = status_data.notes

    # Update corresponding SOS
    sos = (
        db.query(SOS)
        .filter(
            SOS.id == assignment.sos_id
        )
        .first()
    )

    if sos:
        if status_data.status == "ASSIGNED":
            sos.status = "ASSIGNED"

        elif status_data.status == "IN_PROGRESS":
            sos.status = "IN_PROGRESS"

        elif status_data.status == "RESOLVED":
            sos.status = "RESOLVED"

            assignment.completed_at = datetime.now(
                timezone.utc
            )

    db.commit()
    db.refresh(assignment)

    return assignment