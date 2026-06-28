from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.enrollment import Enrollment as EnrollmentSchema, EnrollmentCreate, EnrollmentUpdate
from app.crud import enrollment as crud_enrollment
from app.dependencies.auth import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter(prefix="/enrollments", tags=["enrollments"])

@router.post("", response_model=EnrollmentSchema, status_code=status.HTTP_201_CREATED)
def create_new_enrollment(enrollment: EnrollmentCreate, db: Session = Depends(get_db)):
    try:
        new_enroll = crud_enrollment.create_enrollment(db, enrollment)
        return new_enroll
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Enrollment submission failed: {str(e)}"
        )

@router.get("", response_model=List[EnrollmentSchema])
def read_all_enrollments(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return crud_enrollment.get_enrollments(db)

@router.get("/me", response_model=List[EnrollmentSchema])
def read_my_enrollments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_enrollment.get_user_enrollments(db, email=current_user.email)

@router.put("/{id}", response_model=EnrollmentSchema)
def update_enrollment(id: int, enrollment_update: EnrollmentUpdate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_enroll = crud_enrollment.get_enrollment(db, enrollment_id=id)
    if db_enroll is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enrollment with ID {id} not found"
        )
    return crud_enrollment.update_enrollment_status(db, db_enroll, enrollment_update.status)

@router.delete("/{id}")
def remove_enrollment(id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    success = crud_enrollment.delete_enrollment(db, enrollment_id=id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Enrollment with ID {id} not found"
        )
    return {"message": f"Successfully deleted enrollment with ID {id}"}
