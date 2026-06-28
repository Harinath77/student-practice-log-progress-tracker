from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.database import get_db
from app.dependencies.auth import get_current_admin
from app.schemas.user import UserResponse, UserUpdate
from app.schemas.course import Course as CourseResponse, CourseCreate
from app.schemas.instructor import InstructorResponse, InstructorCreate
from app.schemas.schedule import ScheduleResponse, ScheduleCreate
from app.schemas.enrollment import Enrollment as EnrollmentSchema, EnrollmentUpdate
from app.schemas.audit_log import AuditLogResponse

from app.crud import user as crud_user
from app.crud import course as crud_course
from app.crud import instructor as crud_instructor
from app.crud import schedule as crud_schedule
from app.crud import enrollment as crud_enrollment
from app.crud import audit_log as crud_audit_log

from app.models.user import User
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.schedule import Schedule
from app.models.enrollment import Enrollment
from app.utils.audit import log_admin_action

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(get_current_admin)])

class PasswordResetInput(BaseModel):
    new_password: str

# --- Analytics Overview ---
@router.get("/analytics")
def get_analytics_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    total_students = db.query(User).filter(User.role.ilike("Student")).count()
    total_courses = db.query(Course).count()
    total_instructors = db.query(Instructor).count()
    total_enrollments = db.query(Enrollment).count()
    pending_enrollments = db.query(Enrollment).filter(Enrollment.status.ilike("Pending")).count()
    
    # Today's active classes list
    # For simulation, retrieve today's day and match schedules
    import datetime
    today_day = datetime.datetime.now().strftime("%A")
    today_classes = db.query(Schedule).filter(Schedule.day.ilike(today_day)).all()
    today_classes_list = []
    for cls in today_classes:
        today_classes_list.append({
            "id": cls.id,
            "course_name": cls.course_name,
            "instructor": cls.instructor,
            "room": cls.room,
            "start_time": cls.start_time,
            "end_time": cls.end_time,
            "batch": cls.batch
        })

    # Recent activities
    recent_enrollments = db.query(Enrollment).order_by(Enrollment.id.desc()).limit(5).all()
    recent_list = []
    for en in recent_enrollments:
        recent_list.append({
            "id": en.id,
            "full_name": en.full_name,
            "selected_course": en.selected_course,
            "preferred_batch": en.preferred_batch,
            "created_at": en.created_at,
            "status": en.status
        })

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "total_instructors": total_instructors,
        "total_enrollments": total_enrollments,
        "pending_enrollments": pending_enrollments,
        "today_classes": today_classes_list,
        "recent_enrollments": recent_list
    }

# --- User Management ---
@router.get("/users", response_model=List[UserResponse])
def read_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_user.get_users(db, skip=skip, limit=limit)

@router.put("/users/{id}", response_model=UserResponse)
def modify_user(id: int, user_update: UserUpdate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_user = crud_user.get_user_by_id(db, user_id=id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found.")
    
    old_val = {"role": db_user.role, "is_active": db_user.is_active}
    updated = crud_user.update_user(db, db_user=db_user, user_update=user_update)
    new_val = {"role": updated.role, "is_active": updated.is_active}
    
    log_admin_action(
        db=db, admin=current_admin, action="Updated User privileges",
        resource=f"User Email: {db_user.email}", old_values=old_val, new_values=new_val, request=request
    )
    return updated

@router.delete("/users/{id}")
def remove_user(id: int, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_user = crud_user.get_user_by_id(db, user_id=id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found.")
        
    crud_user.delete_user(db, user_id=id)
    log_admin_action(
        db=db, admin=current_admin, action="Deleted User account",
        resource=f"User Email: {db_user.email}", old_values={"full_name": db_user.full_name}, new_values=None, request=request
    )
    return {"message": "User successfully deleted."}

@router.post("/users/{id}/reset-password")
def reset_user_password(id: int, pw_in: PasswordResetInput, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_user = crud_user.get_user_by_id(db, user_id=id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found.")
        
    db_user.password_hash = crud_user.get_password_hash(pw_in.new_password)
    db.commit()
    
    log_admin_action(
        db=db, admin=current_admin, action="Reset User Password",
        resource=f"User Email: {db_user.email}", old_values=None, new_values=None, request=request
    )
    return {"message": "User password reset successfully."}

@router.get("/users/{id}/history", response_model=List[EnrollmentSchema])
def read_user_history(id: int, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_id(db, user_id=id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User account not found.")
    return crud_enrollment.get_user_enrollments(db, email=db_user.email)

# --- Course Management ---
@router.post("/courses", response_model=CourseResponse, status_code=201)
def add_course(course_in: CourseCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    new_course = crud_course.create_course(db, course_in)
    log_admin_action(
        db=db, admin=current_admin, action="Created Course",
        resource=f"Course: {new_course.title}", old_values=None, new_values=course_in.model_dump(), request=request
    )
    return new_course

@router.put("/courses/{id}", response_model=CourseResponse)
def modify_course(id: int, course_in: CourseCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_course = crud_course.get_course(db, course_id=id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found.")
        
    old_data = {
        "title": db_course.title, "instrument": db_course.instrument, 
        "level": db_course.level, "fees": db_course.fees, "duration": db_course.duration
    }
    updated = crud_course.update_course(db, db_course=db_course, course_update=course_in)
    
    log_admin_action(
        db=db, admin=current_admin, action="Updated Course",
        resource=f"Course ID: {id}", old_values=old_data, new_values=course_in.model_dump(), request=request
    )
    return updated

@router.delete("/courses/{id}")
def remove_course(id: int, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_course = crud_course.get_course(db, course_id=id)
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found.")
        
    crud_course.delete_course(db, course_id=id)
    log_admin_action(
        db=db, admin=current_admin, action="Deleted Course",
        resource=f"Course Title: {db_course.title}", old_values={"title": db_course.title}, new_values=None, request=request
    )
    return {"message": "Course successfully deleted."}

# --- Instructor Management ---
@router.post("/instructors", response_model=InstructorResponse, status_code=201)
def add_instructor(instructor_in: InstructorCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    new_inst = crud_instructor.create_instructor(db, instructor_in)
    log_admin_action(
        db=db, admin=current_admin, action="Created Instructor",
        resource=f"Instructor: {new_inst.full_name}", old_values=None, new_values=instructor_in.model_dump(), request=request
    )
    return new_inst

@router.put("/instructors/{id}", response_model=InstructorResponse)
def modify_instructor(id: int, instructor_in: InstructorCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_inst = crud_instructor.get_instructor(db, instructor_id=id)
    if not db_inst:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")
        
    old_data = {"full_name": db_inst.full_name, "instrument": db_inst.instrument, "specialization": db_inst.specialization}
    updated = crud_instructor.update_instructor(db, db_instructor=db_inst, instructor_update=instructor_in)
    
    log_admin_action(
        db=db, admin=current_admin, action="Edited Instructor",
        resource=f"Instructor ID: {id}", old_values=old_data, new_values=instructor_in.model_dump(), request=request
    )
    return updated

@router.delete("/instructors/{id}")
def remove_instructor(id: int, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_inst = crud_instructor.get_instructor(db, instructor_id=id)
    if not db_inst:
        raise HTTPException(status_code=404, detail="Instructor profile not found.")
        
    crud_instructor.delete_instructor(db, instructor_id=id)
    log_admin_action(
        db=db, admin=current_admin, action="Deleted Instructor",
        resource=f"Instructor Name: {db_inst.full_name}", old_values={"full_name": db_inst.full_name}, new_values=None, request=request
    )
    return {"message": "Instructor profile deleted."}

# --- Schedule Management ---
@router.post("/schedule", response_model=ScheduleResponse, status_code=201)
def add_schedule(schedule_in: ScheduleCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    new_slot = crud_schedule.create_schedule(db, schedule_in)
    log_admin_action(
        db=db, admin=current_admin, action="Created Schedule",
        resource=f"Schedule Slot: {new_slot.course_name} ({new_slot.day})", old_values=None, new_values=schedule_in.model_dump(), request=request
    )
    return new_slot

@router.put("/schedule/{id}", response_model=ScheduleResponse)
def modify_schedule(id: int, schedule_in: ScheduleCreate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_slot = crud_schedule.get_schedule(db, schedule_id=id)
    if not db_slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found.")
        
    old_data = {"course_name": db_slot.course_name, "day": db_slot.day, "start_time": db_slot.start_time, "room": db_slot.room}
    updated = crud_schedule.update_schedule(db, db_schedule=db_slot, schedule_update=schedule_in)
    
    log_admin_action(
        db=db, admin=current_admin, action="Updated Schedule",
        resource=f"Schedule ID: {id}", old_values=old_data, new_values=schedule_in.model_dump(), request=request
    )
    return updated

@router.delete("/schedule/{id}")
def remove_schedule(id: int, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_slot = crud_schedule.get_schedule(db, schedule_id=id)
    if not db_slot:
        raise HTTPException(status_code=404, detail="Schedule slot not found.")
        
    crud_schedule.delete_schedule(db, schedule_id=id)
    log_admin_action(
        db=db, admin=current_admin, action="Deleted Schedule",
        resource=f"Schedule ID {id}: {db_slot.course_name}", old_values={"course_name": db_slot.course_name}, new_values=None, request=request
    )
    return {"message": "Schedule slot deleted."}

# --- Enrollment Management ---
@router.get("/enrollments", response_model=List[EnrollmentSchema])
def read_all_enrollments(db: Session = Depends(get_db)):
    return crud_enrollment.get_enrollments(db)

@router.put("/enrollments/{id}", response_model=EnrollmentSchema)
def modify_enrollment_status(id: int, enrollment_update: EnrollmentUpdate, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_enroll = crud_enrollment.get_enrollment(db, enrollment_id=id)
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found.")
        
    old_status = db_enroll.status
    updated = crud_enrollment.update_enrollment_status(db, db_enroll, enrollment_update.status)
    
    log_admin_action(
        db=db, admin=current_admin, action=f"Approved Enrollment" if enrollment_update.status.lower() == "approved" else f"Rejected Enrollment",
        resource=f"Student Email: {db_enroll.email} ({db_enroll.selected_course})", old_values={"status": old_status}, new_values={"status": enrollment_update.status}, request=request
    )
    return updated

@router.delete("/enrollments/{id}")
def cancel_enrollment(id: int, request: Request, db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    db_enroll = crud_enrollment.get_enrollment(db, enrollment_id=id)
    if not db_enroll:
        raise HTTPException(status_code=404, detail="Enrollment not found.")
        
    crud_enrollment.delete_enrollment(db, enrollment_id=id)
    log_admin_action(
        db=db, admin=current_admin, action="Cancelled Enrollment",
        resource=f"Student Email: {db_enroll.email} ({db_enroll.selected_course})", old_values={"status": db_enroll.status}, new_values=None, request=request
    )
    return {"message": "Enrollment deleted successfully."}

# --- Audit Logs ---
@router.get("/audit-logs", response_model=List[AuditLogResponse])
def read_audit_logs(
    skip: int = 0,
    limit: int = 200,
    action: Optional[str] = None,
    resource: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud_audit_log.get_audit_logs(db, skip=skip, limit=limit, action=action, resource=resource)
