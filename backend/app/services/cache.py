import json
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
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
        try:
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        except Exception as e:
            logger.error(f"Redis not available: {e}. Using PostgreSQL only.")
            self.redis_client = None

    async def get_profile(self, username: str) -> Optional[dict]:
        # get cached profile data from redis or PostgreSQL
        # Redis try
        if self.redis_client:
            try:
                cached = await self.redis_client.get(f"profile:{username.lower()}")
                if cached:
                    logger.info(f"Cache HIT(Redis): {username}")
                    return json.loads(cached)
            except Exception as e:
                logger.warning(f"Redis error: {e}")

        # fallback to postgreSQL 
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username.lower())
            )
            profile = result.scalar_one_or_none()

            if profile and not profile.is_stale:
                logger.info(f"Cache HIT(PostgreSQL): {username}")
                # cache the result in Redis for future requests
                if self.redis_client and profile.report_data:
                    await self.redis_client.setex(
                        f"profile:{username.lower()}",
                        3600, # cache for 1 hour
                        json.dumps(profile.report_data)
                )
                return profile.report_data

            logger.info(f"Cache MISS: {username}")
            return None
    async def store_profile(self, username: str, report_data: dict) -> None:
        # store profile data in postgreSQL and redis
        username = username.lower()

        # store in postgreSQL
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()

            if profile:
                # update existing profile
                profile.report_data = report_data
                profile.updated_at = datetime.now(timezone.utc)
                profile.cache_expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
                #update extracted fields for fast queries
                profile.overall_score = report_data.get("overall_score")
                if report_data.get("top_languages"):
                    profile.primary_language = report_data["top_toplanguages"][0].get("language")

            else:
                # create new
                profile = CachedProfile(
                    username=username,
                    report_data=report_data,
                    overall_score=report_data.get("overall_score"),
                    cache_expires_at=datetime.now(timezone.utc) + timedelta(hours=24),
                    primary_language=report_data["top_languages"][0].get("language") if report_data.get("top_languages") else None
    
                )
                db.add(profile)

                await db.commit()
        # store in redis 
        if self.redis_client:
            try:
                await self.redis_client.setex(
                    f"profile:{username}",
                    3600,
                    json.dumps(report_data)
                )
                logger.info(f"Profile cached: {username}")
            except Exception as e:
                logger.warning(f"Redis store error: {e}")

    async def invalidate(self, username: str) -> None:
        #invalidate cache for a username 
        username = username.lower()

        # invalidate in redis
        if self.redis_client:
            await self.redis_client.delete(f"profile:{username}")

        # invalidate in postgreSQL
        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CachedProfile).where(CachedProfile.username == username)
            )
            profile = result.scalar_one_or_none()

            if profile:
                await db.delete(profile)
                await db.commit()

        logger.info(f"Cache invalidated: {username}")






        