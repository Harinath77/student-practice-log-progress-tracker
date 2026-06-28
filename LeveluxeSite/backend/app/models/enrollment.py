from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    selected_course = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    preferred_batch = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String, default="Pending", nullable=False) # "Pending", "Approved", "Rejected"
    created_at = Column(DateTime, default=datetime.utcnow)
