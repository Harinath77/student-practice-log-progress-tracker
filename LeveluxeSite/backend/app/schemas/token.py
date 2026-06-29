from pydantic import BaseModel
from typing import Optional

class UserInToken(BaseModel):
    id: int
    name: str
    email: str
    role: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    role: str
    user: UserInToken

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    role: Optional[str] = None

class TokenRefreshRequest(BaseModel):
    refresh_token: str
