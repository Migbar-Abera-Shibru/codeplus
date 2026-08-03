from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# convert postgres:// to postgresql+asyncpg:// for asyncpg driver
async_database_url = settings.DATABASE_URL
engine = create_async_engine(
    async_database_url,
    echo=settings.DEBUG,
    pool_size=5,
    max_overflow=10
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

from sqlalchemy.orm import declarative_base
Base = declarative_base()
