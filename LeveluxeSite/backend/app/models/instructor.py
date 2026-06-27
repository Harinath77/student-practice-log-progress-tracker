from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Instructor(Base):
    __tablename__ = "instructors"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    instrument = Column(String, nullable=False, index=True)
    qualification = Column(String, nullable=False)
    experience_years = Column(Integer, nullable=False)
    bio = Column(Text, nullable=False)
    languages = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
