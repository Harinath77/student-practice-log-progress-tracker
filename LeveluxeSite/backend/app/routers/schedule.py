from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.schemas.schedule import ScheduleResponse
from app.crud import schedule as crud_schedule

router = APIRouter(prefix="/schedule", tags=["schedule"])

@router.get("", response_model=List[ScheduleResponse])
def read_schedules(db: Session = Depends(get_db)):
    schedules = crud_schedule.get_schedules(db)
    return schedules

@router.get("/today", response_model=List[ScheduleResponse])
def read_today_schedules(db: Session = Depends(get_db)):
    day_name = datetime.now().strftime("%A")
    schedules = crud_schedule.get_today_schedules(db, day_name=day_name)
    return schedules

@router.get("/{id}", response_model=ScheduleResponse)
def read_schedule(id: int, db: Session = Depends(get_db)):
    db_schedule = crud_schedule.get_schedule(db, schedule_id=id)
    if db_schedule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Schedule entry with ID {id} not found"
        )
    return db_schedule
