from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate

def get_enrollments(db: Session):
    return db.query(Enrollment).all()

def create_enrollment(db: Session, enrollment: EnrollmentCreate):
    db_enrollment = Enrollment(**enrollment.model_dump())
    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment
def get_enrollment(db: Session, enrollment_id: int):
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()

def get_user_enrollments(db: Session, email: str):
    return db.query(Enrollment).filter(func.lower(Enrollment.email) == email.lower()).all()

def update_enrollment_status(db: Session, db_enrollment: Enrollment, status: str):
    db_enrollment.status = status
    db.commit()
    db.refresh(db_enrollment)
    return db_enrollment

def delete_enrollment(db: Session, enrollment_id: int) -> bool:
    db_enroll = get_enrollment(db, enrollment_id)
    if db_enroll:
        db.delete(db_enroll)
        db.commit()
        return True
    return False
