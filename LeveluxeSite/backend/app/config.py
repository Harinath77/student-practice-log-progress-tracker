from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Leveluxe Modern Music Academy API"
    ENV: str = "development"
    PORT: int = 8000
    DATABASE_URL: str = "placeholder"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"
    SECRET_KEY: str = "secret-leveluxe-music-academy-super-key-change-in-prod-xyz"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
