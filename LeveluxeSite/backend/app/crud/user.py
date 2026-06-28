from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.hash import get_password_hash

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower()).first()

def get_users(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: UserCreate, role: str = "Student") -> User:
    hashed_pwd = get_password_hash(user.password)
    db_user = User(
        full_name=user.full_name,
        email=user.email.lower(),
        phone=user.phone,
        password_hash=hashed_pwd,
        role=role,
        is_active=True,
        is_verified=False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, db_user: User, user_update: UserUpdate) -> User:
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Handle password updates separately (if updated through change-password rather than profile details)
    # If the user schema allows updating password, hash it first.
    if "password" in update_data:
        update_data["password_hash"] = get_password_hash(update_data.pop("password"))

    if "email" in update_data:
        update_data["email"] = update_data["email"].lower()

    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def update_last_login(db: Session, db_user: User) -> User:
    db_user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user_by_id(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
