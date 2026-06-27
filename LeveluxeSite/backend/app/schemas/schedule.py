from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ScheduleBase(BaseModel):
    course_name: str
    instructor: str
    day: str
    start_time: str
    end_time: str
    batch: str
    level: str
    room: str
    available_seats: int

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(BaseModel):
    course_name: Optional[str] = None
    instructor: Optional[str] = None
    day: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    batch: Optional[str] = None
    level: Optional[str] = None
    room: Optional[str] = None
    available_seats: Optional[int] = None

class ScheduleResponse(ScheduleBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
