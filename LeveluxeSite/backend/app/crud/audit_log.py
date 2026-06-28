from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from app.models.audit_log import AuditLog

def create_audit_log(
    db: Session,
    admin_name: str,
    action: str,
    resource: str,
    old_values: Optional[str] = None,
    new_values: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None
) -> AuditLog:
    db_log = AuditLog(
        admin_name=admin_name,
        action=action,
        resource=resource,
        old_values=old_values,
        new_values=new_values,
        ip_address=ip_address,
        user_agent=user_agent
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_audit_logs(
    db: Session,
    skip: int = 0,
    limit: int = 200,
    action: Optional[str] = None,
    resource: Optional[str] = None
) -> List[AuditLog]:
    query = db.query(AuditLog)
    
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if resource:
        query = query.filter(AuditLog.resource.ilike(f"%{resource}%"))
        
    return query.order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
