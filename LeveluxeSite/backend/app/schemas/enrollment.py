from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class EnrollmentBase(BaseModel):
    full_name: str
    email: str
    phone: str
    age: int
    selected_course: str
    experience_level: str
    preferred_batch: str
    message: Optional[str] = None
    status: Optional[str] = "Pending"

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentUpdate(BaseModel):
    status: str # "Approved" or "Rejected"

class Enrollment(EnrollmentBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
