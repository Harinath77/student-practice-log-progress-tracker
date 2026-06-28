from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.instructor import InstructorResponse, InstructorCreate
from app.crud import instructor as crud_instructor
from app.dependencies.auth import get_current_admin
from app.models.user import User

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

@router.post("", response_model=InstructorResponse, status_code=status.HTTP_201_CREATED)
def create_new_instructor(instructor: InstructorCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return crud_instructor.create_instructor(db, instructor)

@router.put("/{id}", response_model=InstructorResponse)
def update_existing_instructor(id: int, instructor: InstructorCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_instructor = crud_instructor.get_instructor(db, instructor_id=id)
    if db_instructor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instructor with ID {id} not found"
        )
    return crud_instructor.update_instructor(db, db_instructor, instructor)

@router.delete("/{id}")
def remove_instructor(id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    success = crud_instructor.delete_instructor(db, instructor_id=id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instructor with ID {id} not found"
        )
    return {"message": f"Successfully deleted instructor with ID {id}"}
