from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.dependencies.auth import get_current_admin
from app.schemas.user import UserResponse, UserUpdate
from app.crud.user import get_users, get_user_by_id, update_user, delete_user
from app.models.user import User
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.schedule import Schedule
from app.models.enrollment import Enrollment

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])

@router.get("/users", response_model=List[UserResponse])
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = get_users(db, skip=skip, limit=limit)
    return users

@router.put("/users/{id}", response_model=UserResponse)
def modify_user_by_admin(id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = get_user_by_id(db, user_id=id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {id} not found."
        )
    updated = update_user(db, db_user=db_user, user_update=user_update)
    return updated

@router.delete("/users/{id}")
def remove_user_by_admin(id: int, db: Session = Depends(get_db)):
    success = delete_user(db, user_id=id)
    if not success:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {id} not found."
        )
    return {"message": f"Successfully deleted user with ID {id}."}

@router.get("/analytics")
def get_analytics_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_students = db.query(User).filter(User.role == "Student").count()
    total_courses = db.query(Course).count()
    total_instructors = db.query(Instructor).count()
    total_enrollments = db.query(Enrollment).count()
    
    # Fetch 5 recent enrollments
    recent_enrollments = db.query(Enrollment).order_by(Enrollment.id.desc()).limit(5).all()
    recent_list = []
    for en in recent_enrollments:
        recent_list.append({
            "id": en.id,
            "full_name": en.full_name,
            "selected_course": en.selected_course,
            "preferred_batch": en.preferred_batch,
            "created_at": en.created_at
        })

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "total_instructors": total_instructors,
        "total_enrollments": total_enrollments,
        "recent_enrollments": recent_list
    }
