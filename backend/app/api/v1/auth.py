from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/github/login")
async def github_login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&scope=read:user,public_repo"
    )
    