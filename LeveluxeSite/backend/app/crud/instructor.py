from sqlalchemy.orm import Session
from app.models.instructor import Instructor
from app.schemas.instructor import InstructorCreate

def get_instructors(db: Session):
    return db.query(Instructor).all()

def get_instructor(db: Session, instructor_id: int):
    return db.query(Instructor).filter(Instructor.id == instructor_id).first()

def create_instructor(db: Session, instructor: InstructorCreate):
    db_instructor = Instructor(**instructor.model_dump())
    db.add(db_instructor)
    db.commit()
    db.refresh(db_instructor)
    return db_instructor
