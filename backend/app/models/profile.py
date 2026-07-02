from sqlalchemy import Column, String, Integer, JSON, DateTime, Float, Boolean
from sqlalchemy.sql import func
from app.db.base import Base

class CachedProfile(Base):
    """
    Cache github pai responses to avoid rate limits.
    This is not a user data, it's a cache of publice github data.
    """
    __tablename__ = "cached_profiles"

    id = Column(Integer, primary_key=True)
    username = Column(String(100), unique=True, nullable=Fale, index=True)

    # Raw github data(cached)
    user_data = Column(JSON)
    repositories_data = Column(JSON)
    events_data = Column(JSON)
    languages_data = Column(JSON)

    # Computed scores(stored after calculation)
    complexity_score = Column(Float)
    consistency_score = Column(Float)
    collaboration_score = Column(Float)
    overall_score = Column(Float)

    # Full computed report
    report_data = Column(JSON)

    # Sharable report
    share_token = Column(String(64), unique=True, index=True)
    is_public = Column(Boolean, default=True)

    # Cache management
    cached_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    cache_expires_at = Column(DateTime(timezone=True))

    def is_stale(self) -> bool:
        from datetime import datetime, timezone
        return datetime.now(timezone.utc) > self.cache_expires_at