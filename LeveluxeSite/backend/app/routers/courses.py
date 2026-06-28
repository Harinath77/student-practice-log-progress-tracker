from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.course import Course as CourseSchema, CourseCreate
from app.crud import course as crud_course
from app.dependencies.auth import get_current_admin
from app.models.user import User

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

@router.post("", response_model=CourseSchema, status_code=status.HTTP_201_CREATED)
def create_new_course(course: CourseCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    return crud_course.create_course(db, course)

@router.put("/{id}", response_model=CourseSchema)
def update_existing_course(id: int, course: CourseCreate, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_course = crud_course.get_course(db, course_id=id)
    if db_course is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {id} not found"
        )
    return crud_course.update_course(db, db_course, course)

@router.delete("/{id}")
def remove_course(id: int, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    success = crud_course.delete_course(db, course_id=id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with ID {id} not found"
        )
    return {"message": f"Successfully deleted course with ID {id}"}
