# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App
    APP_NAME: str = "CodePulse"
    DEBUG: bool = False
    SECRET_KEY: str = "dev-secret-key-change-in-production"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://dev:devpassword@localhost:5432/codepulse"

    # GitHub OAuth (optional for dev)
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    GITHUB_API_TOKEN: Optional[str] = None

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Cache TTL (seconds)
    PROFILE_CACHE_TTL: int = 3600
    REPO_CACHE_TTL: int = 7200
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3000"
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()