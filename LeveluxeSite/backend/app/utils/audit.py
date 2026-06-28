from fastapi import Request
from sqlalchemy.orm import Session
from typing import Optional, Any
import json

from app.models.user import User
from app.crud.audit_log import create_audit_log

def log_admin_action(
    db: Session,
    admin: User,
    action: str,
    resource: str,
    old_values: Optional[Any] = None,
    new_values: Optional[Any] = None,
    request: Optional[Request] = None
):
    ip_address = None
    user_agent = None
    
    if request:
        # Check for proxies (e.g. Render/Cloudflare headers)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else None
            
        user_agent = request.headers.get("User-Agent")

    # Serialize states safely
    old_values_json = None
    new_values_json = None
    
    if old_values is not None:
        try:
            if isinstance(old_values, dict):
                old_values_json = json.dumps(old_values, default=str)
            elif hasattr(old_values, "__dict__"):
                # Handle model fields
                data = {key: val for key, val in old_values.__dict__.items() if not key.startswith("_")}
                old_values_json = json.dumps(data, default=str)
            else:
                old_values_json = str(old_values)
        except Exception:
            old_values_json = str(old_values)

    if new_values is not None:
        try:
            if isinstance(new_values, dict):
                new_values_json = json.dumps(new_values, default=str)
            elif hasattr(new_values, "__dict__"):
                data = {key: val for key, val in new_values.__dict__.items() if not key.startswith("_")}
                new_values_json = json.dumps(data, default=str)
            else:
                new_values_json = str(new_values)
        except Exception:
            new_values_json = str(new_values)

    create_audit_log(
        db=db,
        admin_name=admin.full_name or admin.email,
        action=action,
        resource=resource,
        old_values=old_values_json,
        new_values=new_values_json,
        ip_address=ip_address,
        user_agent=user_agent
    )
