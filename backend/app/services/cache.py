# backend/app/services/cache.py
import json
from datetime import datetime, timedelta, timezone
from typing import Optional, Any
import redis.asyncio as redis
from app.core.config import settings
from app.db.session import AsyncSessionLocal
from app.models.profile import CachedProfile
from sqlalchemy import select
import logging

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.redis_client = None
        self._init_redis()
    
    def _init_redis(self):
        """Initialize Redis connection for hot cache."""
        try:
            self.redis_client = redis.from_url(
                settings.REDIS_URL, 
                decode_responses=True,
                socket_connect_timeout=2  # Short timeout so it doesn't hang
            )
            # Test connection
            import asyncio
            asyncio.create_task(self._test_redis())
        except Exception as e:
            logger.warning(f"Redis not available: {e}. Using PostgreSQL only.")
            self.redis_client = None
    
    async def _test_redis(self):
        """Test Redis connection."""
        try:
            if self.redis_client:
                await self.redis_client.ping()
                logger.info("Redis connection established")
        except Exception as e:
            logger.warning(f"Redis ping failed: {e}")
            self.redis_client = None
    
    async def get_profile(self, username: str) -> Optional[dict]:
        """Get cached profile data from Redis (fast) or PostgreSQL."""
        # Try Redis first (L1 cache)
        if self.redis_client:
            try:
                cached = await self.redis_client.get(f"profile:{username.lower()}")
                if cached:
                    logger.info(f"Cache HIT (Redis): {username}")
                    return json.loads(cached)
            except Exception as e:
                logger.warning(f"Redis error: {e}")
                # Continue to PostgreSQL fallback
        
        # Fallback to PostgreSQL (L2 cache)
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username.lower())
            )
            profile = result.scalar_one_or_none()
            
            if profile and profile.report_data and not profile.is_stale():
                logger.info(f"Cache HIT (PostgreSQL): {username}")
                # Populate Redis for next time
                if self.redis_client and profile.report_data:
                    try:
                        await self.redis_client.setex(
                            f"profile:{username.lower()}",
                            3600,  # 1 hour TTL in Redis
                            json.dumps(profile.report_data)
                        )
                    except Exception as e:
                        logger.warning(f"Redis store error: {e}")
                return profile.report_data
        
        logger.info(f"Cache MISS: {username}")
        return None
    
    async def store_profile(self, username: str, report_data: dict) -> None:
        """Store profile data in PostgreSQL and Redis."""
        username = username.lower()
        
        # Store in PostgreSQL
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()
            
            if profile:
                # Update existing
                profile.report_data = report_data
                profile.updated_at = datetime.now(timezone.utc)
                profile.cache_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
                # Update extracted fields for fast queries
                profile.overall_score = report_data.get("overall_score")
                if report_data.get("top_languages"):
                    profile.primary_language = report_data["top_languages"][0].get("language")
            else:
                # Create new
                profile = CachedProfile(
                    username=username,
                    report_data=report_data,
                    overall_score=report_data.get("overall_score"),
                    cache_expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
                )
                db.add(profile)
            
            await db.commit()
        
        # Store in Redis (L1 cache) - best effort
        if self.redis_client:
            try:
                await self.redis_client.setex(
                    f"profile:{username}",
                    3600,  # 1 hour
                    json.dumps(report_data)
                )
                logger.info(f"Profile cached in Redis: {username}")
            except Exception as e:
                logger.warning(f"Redis store error: {e}")
    
    async def invalidate(self, username: str) -> None:
        """Invalidate cache for a specific username."""
        username = username.lower()
        
        if self.redis_client:
            try:
                await self.redis_client.delete(f"profile:{username}")
            except Exception as e:
                logger.warning(f"Redis delete error: {e}")
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()
            if profile:
                await db.delete(profile)
                await db.commit()
        
        logger.info(f"Cache invalidated: {username}")