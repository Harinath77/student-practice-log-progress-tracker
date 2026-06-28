from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.instructor import InstructorResponse
from app.crud import instructor as crud_instructor

router = APIRouter(prefix="/instructors", tags=["instructors"])

@router.get("", response_model=List[InstructorResponse])
def read_instructors(db: Session = Depends(get_db)):
    instructors = crud_instructor.get_instructors(db)
    return instructors

@router.get("/{id}", response_model=InstructorResponse)
def read_instructor(id: int, db: Session = Depends(get_db)):
    db_instructor = crud_instructor.get_instructor(db, instructor_id=id)
    if db_instructor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instructor with ID {id} not found"
        )
    return db_instructor
