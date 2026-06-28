from pydantic import BaseModel
from typing import Optional

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    role: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    role: Optional[str] = None

class TokenRefreshRequest(BaseModel):
    refresh_token: str
