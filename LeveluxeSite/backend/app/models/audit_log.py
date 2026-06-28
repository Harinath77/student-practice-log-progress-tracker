from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    admin_name = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False, index=True)
    resource = Column(String, nullable=False, index=True)
    old_values = Column(Text, nullable=True) # Text field to store JSON dump of old state
    new_values = Column(Text, nullable=True) # Text field to store JSON dump of new state
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
