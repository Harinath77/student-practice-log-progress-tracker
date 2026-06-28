from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.enrollment import Enrollment as EnrollmentSchema, EnrollmentCreate
from app.crud import enrollment as crud_enrollment

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
