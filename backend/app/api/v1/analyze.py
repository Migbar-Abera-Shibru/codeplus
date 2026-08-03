# backend/app/api/v1/analyze.py
from fastapi import APIRouter, HTTPException
from app.services.github_client import GitHubClient, GitHubRateLimitError
from app.services.analyzer import DeveloperAnalyzer
from app.services.cache import CacheService
import logging
import asyncio

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["analyze"])

@router.get("/{username}")
async def analyze_profile(
    username: str,
    force_refresh: bool = False
):
    """
    Main analysis endpoint.
    Returns cached data if fresh, otherwise fetches from GitHub.
    """
    logger.info(f"Analyzing profile: {username}, force_refresh: {force_refresh}")
    
    cache = CacheService()

    # Check cache first
    if not force_refresh:
        try:
            cached = await cache.get_profile(username)
            if cached:
                logger.info(f"Cache hit for {username}")
                return cached
        except Exception as e:
            logger.warning(f"Cache error: {e}")

    # Use async context manager for GitHub client with timeout
    try:
        async with GitHubClient() as client:
            try:
                # Add overall timeout for the entire analysis
                async with asyncio.timeout(60):  # 60 second overall timeout
                    # Fetch user data
                    user_data = await client.get_user(username)
                    if not user_data:
                        logger.warning(f"User not found: {username}")
                        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")

                    # Fetch repositories and events in parallel
                    repositories_task = client.get_repositories(username)
                    events_task = client.get_events(username)
                    
                    repositories, events = await asyncio.gather(
                        repositories_task, 
                        events_task,
                        return_exceptions=True
                    )
                    
                    # Handle potential errors
                    if isinstance(repositories, Exception):
                        logger.error(f"Error fetching repositories: {repositories}")
                        raise HTTPException(status_code=500, detail=f"Error fetching repositories: {str(repositories)}")
                    
                    if isinstance(events, Exception):
                        logger.warning(f"Error fetching events: {events}")
                        events = []  # Continue with empty events

                    # Fetch languages for top repos (limited to 5 to save time)
                    languages_by_repo = {}
                    repo_tasks = []
                    for repo in repositories[:5]:
                        if not repo.get("fork"):
                            repo_tasks.append(client.get_languages(username, repo["name"]))
                    
                    if repo_tasks:
                        lang_results = await asyncio.gather(*repo_tasks, return_exceptions=True)
                        for repo, lang_result in zip(repositories[:5], lang_results):
                            if not isinstance(lang_result, Exception) and lang_result:
                                languages_by_repo[repo["name"]] = lang_result

            except asyncio.TimeoutError:
                logger.error(f"Timeout analyzing {username}")
                raise HTTPException(
                    status_code=504,
                    detail="Analysis took too long. Please try again."
                )
                
    except GitHubRateLimitError as e:
        logger.error(f"Rate limit exceeded")
        raise HTTPException(
            status_code=429,
            detail={
                "message": "GitHub API rate limit reached",
                "reset_at": e.reset_at,
                "suggestion": "Please try again in a few minutes"
            }
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching from GitHub: {e}")
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")

    # Analyze
    try:
        analyzer = DeveloperAnalyzer()
        report = analyzer.analyze(user_data, repositories, events, languages_by_repo)
    except Exception as e:
        logger.error(f"Error analyzing data: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing data: {str(e)}")

    # Cache result
    try:
        await cache.store_profile(username, report)
    except Exception as e:
        logger.warning(f"Error caching profile: {e}")

    return report