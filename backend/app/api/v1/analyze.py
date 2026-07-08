from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.services.github_client import GitHubClient, GitHubRateLimitError
from app.services.analyzer import DeveloperAnalyzer
from app.services.cache import CacheService
from app.schemas.report import ReportResponse

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.get("/username", response_model=ReportResponse)
async def analyze_profile(
    username: str,
    background_tasks: BackgroundTasks,
    force_refresh: bool = False
):
    """
    Main analysis enpoint.
    returns cached data if fresh, otherwise fetches from Github"""

    cache = CacheService()

    if not force_refresh:
        cached = await cache.get_profile(username)
        if cached:
            return cached
        
    client = GitHubClient()

    try: 
        user_data = await client.get_user(username)
        if not user_data:
            raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found ")
        
        repositories = await client.get_repositories(username)
        events = await client.get_events(username)

        languages_by_repo = {}
        for repo in repositories[:10]:
            if not repo.get("fork"):
                langs = await client.get_languages(username, repo["name"])
                languages_by_repo[repo["name"]] = langs

    except GitHubRateLimitError as e: 
        raise HTTPException(
            status_code =429,
            detail={
                "message": "GitHub API rate limit reached",
                "reset_at": e.reset_at,
                "suggestion": "Please try again in a few minutes"
            }
        )
    
    analyzer = DeveloperAnalyzer()
    report = analyzer.analyze(user_data, repositories, events, languages_by_repo)

    await cache.store_profile(username, report)

    return report