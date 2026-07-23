import secrets 
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.profile import CachedProfile
from app.schemas.report import ShareResponse, ReportResponse

router = APIRouter(prefix="/share", tags=["share"])

@router.post("/username/generate", response_model=ShareResponse)
async def generate_share_link(
    username: str,
    db: AsyncSession = Depends(get_db)
):
    # for generating a permanent sharable url for developer, find or create profile
    result = await db.execute(
        select(CachedProfile).where(CachedProfile.username == username)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        raise HTTPException(
            status_code=404,
            detail=f"No report found for '{username}'. Please analyze this profile first"
        )
    
    if not profile.share_token:
        profile.share_token = secrets.token_urlsafe(8)
        profile.is_public = True
        await db.commit()
        await db.refresh(profile)

    return ShareResponse(
        username=profile.username,
        share_token = profile.share_token,
        share_url = f"https://codepulse.dev/report/{profile.share_token}",
        generated_at = profile.generated_at.isoformat() if profile.generated_at else None

    )
