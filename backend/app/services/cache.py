# backend/app/services/cache.py
import json
from datetime import datetime, timedelta, timezone
from typing import Optional
from app.db.session import AsyncSessionLocal
from app.models.profile import CachedProfile
from sqlalchemy import select
import logging
from dataclasses import asdict

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis_client = None
        logger.info("CacheService initialized with PostgreSQL only")
    
    async def get_profile(self, username: str) -> Optional[dict]:
        """Get cached profile data from PostgreSQL."""
        username = username.lower()
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()
            
            if profile and profile.report_data and not profile.is_stale():
                logger.info(f"Cache HIT (PostgreSQL): {username}")
                return profile.report_data
        
        logger.info(f"Cache MISS: {username}")
        return None
    
    async def store_profile(self, username: str, report_data) -> None:
        """Store profile data in PostgreSQL."""
        username = username.lower()
        
        # Convert dataclass to dict if needed
        if hasattr(report_data, '__dataclass_fields__'):
            report_dict = asdict(report_data)
        elif hasattr(report_data, 'get'):
            report_dict = report_data
        else:
            report_dict = report_data
        
        # Make sure we have a dict
        if not isinstance(report_dict, dict):
            report_dict = asdict(report_dict) if hasattr(report_dict, '__dataclass_fields__') else {}
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()
            
            if profile:
                # Update existing
                profile.report_data = report_dict
                profile.updated_at = datetime.now(timezone.utc)
                profile.cache_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
                profile.overall_score = report_dict.get("overall_score")
                if report_dict.get("top_languages"):
                    profile.primary_language = report_dict["top_languages"][0].get("language") if isinstance(report_dict["top_languages"], list) and report_dict["top_languages"] else None
            else:
                # Create new
                profile = CachedProfile(
                    username=username,
                    report_data=report_dict,
                    overall_score=report_dict.get("overall_score"),
                    cache_expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
                )
                db.add(profile)
            
            await db.commit()
            logger.info(f"Profile cached: {username}")
    
    async def invalidate(self, username: str) -> None:
        """Invalidate cache for a specific username."""
        username = username.lower()
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()
            if profile:
                await db.delete(profile)
                await db.commit()
                logger.info(f"Cache invalidated: {username}")