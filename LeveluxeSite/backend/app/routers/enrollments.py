from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.enrollment import Enrollment as EnrollmentSchema, EnrollmentCreate
from app.crud import enrollment as crud_enrollment
from app.dependencies.auth import get_current_user
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

@router.get("/me", response_model=List[EnrollmentSchema])
def read_my_enrollments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_enrollment.get_user_enrollments(db, email=current_user.email)
