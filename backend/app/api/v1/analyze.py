# backend/app/api/v1/analyze.py
from fastapi import APIRouter, HTTPException
from app.services.github_client import GitHubClient, GitHubRateLimitError
from app.services.analyzer import DeveloperAnalyzer
from app.services.cache import CacheService
import logging
import asyncio

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["analyze"])

# backend/app/api/v1/analyze.py - Add debug logging

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
                async with asyncio.timeout(60):
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
                        events = []
                    
                    # ===== DEBUG: Log event information =====
                    logger.info(f"Fetched {len(events)} events for {username}")
                    
                    if events:
                        # Count event types
                        event_types = {}
                        push_events = []
                        for event in events[:30]:  # Check first 30 events
                            event_type = event.get("type", "unknown")
                            event_types[event_type] = event_types.get(event_type, 0) + 1
                            if event_type == "PushEvent":
                                push_events.append(event)
                        
                        logger.info(f"Event types: {event_types}")
                        logger.info(f"PushEvents found: {len(push_events)}")
                        
                        # Log sample PushEvent if available
                        if push_events:
                            sample = push_events[0]
                            payload = sample.get("payload", {})
                            commits = payload.get("commits", [])
                            size = payload.get("size", 0)
                            logger.info(f"Sample PushEvent: {len(commits)} commits, size: {size}, repo: {sample.get('repo', {}).get('name', 'unknown')}")
                        else:
                            # Log sample of other events
                            if events:
                                sample = events[0]
                                logger.info(f"Sample event type: {sample.get('type')}, repo: {sample.get('repo', {}).get('name', 'unknown')}")
                    else:
                        logger.warning(f"No events returned for {username}")
                    # ===== END DEBUG =====

                    # Fetch languages for top repos
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
        report = await analyzer.analyze(user_data, repositories, events, languages_by_repo, github_client=client, username=username)
    except Exception as e:
        logger.error(f"Error analyzing data: {e}")
        raise HTTPException(status_code=500, detail=f"Error analyzing data: {str(e)}")

    # Cache result
    try:
        await cache.store_profile(username, report)
    except Exception as e:
        logger.warning(f"Error caching profile: {e}")

    return report