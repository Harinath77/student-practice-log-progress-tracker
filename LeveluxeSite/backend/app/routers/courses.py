from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.course import Course as CourseSchema
from app.crud import course as crud_course

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("", response_model=List[CourseSchema])
def read_courses(db: Session = Depends(get_db)):
    courses = crud_course.get_courses(db)
    return courses

@router.get("/{id}", response_model=CourseSchema)
def read_course(id: int, db: Session = Depends(get_db)):
    db_course = crud_course.get_course(db, course_id=id)
    if db_course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {id} not found"
        )
    return db_course
