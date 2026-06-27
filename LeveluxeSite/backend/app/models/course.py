from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    instrument = Column(String, nullable=False, index=True)
    level = Column(String, nullable=False, index=True)
    duration = Column(String, nullable=False)
    fees = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
