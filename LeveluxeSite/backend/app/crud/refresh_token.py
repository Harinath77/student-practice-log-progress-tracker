from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from app.models.refresh_token import RefreshToken

def create_refresh_token(db: Session, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
    # Revoke any old active tokens first to keep sessions secure (1 active refresh session per user or multiple)
    # For now, let's allow multiple devices, but cleanup expired tokens.
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id, 
        RefreshToken.expires_at < datetime.utcnow()
    ).delete()
    
    db_token = RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
        revoked=False
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_refresh_token(db: Session, token: str) -> Optional[RefreshToken]:
    return db.query(RefreshToken).filter(RefreshToken.token == token).first()

def revoke_refresh_token(db: Session, token: str) -> bool:
    db_token = get_refresh_token(db, token)
    if db_token and not db_token.revoked:
        db_token.revoked = True
        db.commit()
        return True
    return False

def revoke_all_user_tokens(db: Session, user_id: int) -> int:
    result = db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id, 
        RefreshToken.revoked == False
    ).update({"revoked": True})
    db.commit()
    return result
