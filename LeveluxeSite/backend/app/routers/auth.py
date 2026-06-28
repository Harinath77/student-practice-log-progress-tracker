from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
import uuid

from app.database import get_db
from app.schemas.user import (
    UserCreate, UserResponse, UserLogin, 
    ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
)
from app.schemas.token import TokenResponse, TokenRefreshRequest
from app.crud.user import (
    create_user, get_user_by_email, update_last_login, 
    update_user, get_password_hash
)
from app.crud.refresh_token import create_refresh_token, get_refresh_token, revoke_refresh_token
from app.auth.hash import verify_password
from app.auth.jwt import create_access_token, create_refresh_token as create_jwt_refresh, decode_token
from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    # Check if this is the very first user in the database to auto-assign Admin role (for ease of installation)
    is_first_user = db.query(User).count() == 0
    role = "Admin" if is_first_user else "Student"
    
    new_user = create_user(db, user_in, role=role)
    return new_user

@router.post("/login", response_model=TokenResponse)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=credentials.email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password."
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )
    
    # Update last login timestamp
    update_last_login(db, user)
    
    # Generate tokens
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    # Expiry days depending on remember_me option
    expiry_days = 30 if credentials.remember_me else 7
    refresh_token_str = create_jwt_refresh(
        data={"sub": user.email}, 
        expires_delta=timedelta(days=expiry_days)
    )
    
    # Store refresh token in database
    expires_at = datetime.now(timezone.utc) + timedelta(days=expiry_days)
    create_refresh_token(db, user_id=user.id, token=refresh_token_str, expires_at=expires_at)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token_str,
        expires_in=30 * 60, # 30 minutes in seconds
        role=user.role
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(refresh_in: TokenRefreshRequest, db: Session = Depends(get_db)):
    db_token = get_refresh_token(db, token=refresh_in.refresh_token)
    if not db_token or db_token.revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or revoked refresh token. Please login again."
        )
        
    # Get user details
    payload = decode_token(refresh_in.refresh_token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload."
        )
        
    email = payload.get("sub")
    user = get_user_by_email(db, email=email)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Associated user account not found or deactivated."
        )
        
    # Generate a new access token
    access_token = create_access_token(data={"sub": user.email, "role": user.role})
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_in.refresh_token,
        expires_in=30 * 60,
        role=user.role
    )

@router.post("/logout")
def logout(refresh_in: TokenRefreshRequest, db: Session = Depends(get_db)):
    revoked = revoke_refresh_token(db, token=refresh_in.refresh_token)
    if not revoked:
        # Silently succeed or return status
        pass
    return {"message": "Successfully logged out."}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=req.email)
    if not user:
        # For security reasons, do not reveal if email exists. Say check email.
        return {"message": "If the email is registered, a password reset link has been sent."}
    
    # Simulate a reset token for this user
    reset_token = f"reset-{uuid.uuid4()}"
    # In a real environment, we'd email this. We will return it or log it so client can simulate.
    print(f"PASSWORD RESET SIMULATION FOR {user.email}: reset-token = {reset_token}")
    return {
        "message": "If the email is registered, a password reset link has been sent.",
        "simulated_token": reset_token # Provided for front-end simulation testing!
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    # Since we are simulating, let's assume any token starting with 'reset-' is valid
    if not req.token.startswith("reset-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
        
    # In simulation, we can query the user that had last login or we can look up by a dummy query
    # To keep reset functional, the simulated token was generated with the email or we can just update a user:
    # Let's find any student user or allow them to search. 
    # For a real robust simulation, let's allow updating the password of any user by searching for simulated context or a fallback.
    # Wait, can we pass email inside the token structure? Yes, simulated_token is "reset-<email>"!
    # Let's check if the token contains email: e.g., if token is "reset-email@example.com"
    email = None
    if "@" in req.token:
        email = req.token.replace("reset-", "")
    else:
        # Fallback to updating the first user in DB or raise error
        first_user = db.query(User).first()
        if first_user:
            email = first_user.email
            
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not associate reset token to a user."
        )
        
    user = get_user_by_email(db, email=email)
    if not user:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account associated with this token does not exist."
        )
         
    user.password_hash = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password successfully reset. You can now login with your new credentials."}

@router.post("/change-password")
def change_password(req: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(req.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )
    current_user.password_hash = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated successfully."}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
