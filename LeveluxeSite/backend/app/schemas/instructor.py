from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class InstructorBase(BaseModel):
    full_name: str
    instrument: str
    qualification: str
    experience_years: int
    bio: str
    languages: str
    specialization: str
    image_url: Optional[str] = None

class InstructorCreate(InstructorBase):
    pass

class InstructorUpdate(BaseModel):
    full_name: Optional[str] = None
    instrument: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    languages: Optional[str] = None
    specialization: Optional[str] = None
    image_url: Optional[str] = None

class InstructorResponse(InstructorBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
