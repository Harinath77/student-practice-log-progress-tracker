from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String, nullable=False)
    instructor = Column(String, nullable=False, index=True)
    day = Column(String, nullable=False, index=True)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    batch = Column(String, nullable=False, index=True)
    level = Column(String, nullable=False, index=True)
    room = Column(String, nullable=False)
    available_seats = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
