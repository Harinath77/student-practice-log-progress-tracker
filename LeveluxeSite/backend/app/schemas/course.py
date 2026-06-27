from pydantic import BaseModel, ConfigDict
from typing import Optional

class CourseBase(BaseModel):
    title: str
    instrument: str
    level: str
    duration: str
    fees: float
    description: str
    image_url: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
