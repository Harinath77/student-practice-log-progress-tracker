from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate

def get_schedules(db: Session):
    return db.query(Schedule).all()

def get_schedule(db: Session, schedule_id: int):
    return db.query(Schedule).filter(Schedule.id == schedule_id).first()

def get_today_schedules(db: Session, day_name: str):
    return db.query(Schedule).filter(func.lower(Schedule.day) == day_name.lower()).all()

def create_schedule(db: Session, schedule: ScheduleCreate):
    db_schedule = Schedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def update_schedule(db: Session, db_schedule: Schedule, schedule_update: ScheduleCreate):
    update_data = schedule_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def delete_schedule(db: Session, schedule_id: int) -> bool:
    db_schedule = get_schedule(db, schedule_id)
    if db_schedule:
        db.delete(db_schedule)
        db.commit()
        return True
    return False
