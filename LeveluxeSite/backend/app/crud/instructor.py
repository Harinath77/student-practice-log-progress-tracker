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

def update_instructor(db: Session, db_instructor: Instructor, instructor_update: InstructorCreate):
    update_data = instructor_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_instructor, key, value)
    db.commit()
    db.refresh(db_instructor)
    return db_instructor

def delete_instructor(db: Session, instructor_id: int) -> bool:
    db_instructor = get_instructor(db, instructor_id)
    if db_instructor:
        db.delete(db_instructor)
        db.commit()
        return True
    return False
