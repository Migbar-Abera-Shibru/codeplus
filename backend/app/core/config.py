from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CodePlus"
    DEBUG: bool = False
    SECRET_KEY = str

    # Database
    DATABASE_URL: str

    # Github OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_API_TOKEN: str  # personal token for higher rate limits

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Cache TTL (seconds)
    PROFILE_CACHE_TTL: int = 3600  # 1 hour
    REPO_CACHE_TTL: int = 7200  # 2 hours

    class Config:
        env_file = ".env"


settings = Settings()
