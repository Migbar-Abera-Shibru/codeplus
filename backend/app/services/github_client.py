import httpx
import asyncio
from typing import Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class GitHubRateLimitError(Exception):
    def __init__ (self, reset_at: int):
        self.reset_at = reset_at

class GitHubClient:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.GITHUB_API_TOKEN
        self.headers = {
            "Authorization" : f"Bearer {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "X-Github-Api-Version" : "2022-11-28"
        }
    async def _request(self, endpoint: str, params: dict = None) -> dict:
        """
        Single request with rate limit awareness.
        Authenticated requests: 5,000/hour
        Unauthenticated: 60/hour - NEVER go unauthenticated in production 
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}{endpoint}",
                headers=self.headers,
                params=params,
                timeout=10.0
            )

            remaining = int(response.headers.get("X-RateLimit-Remaining", 1))
            reset_at = int(response.headers.get("X-RateLimit-Reset", 0))

            logger.info(f"GitHub API: {endpoint} | Remaining: {remaining}")

            if response.status_code == 403 and remaining == 0:
                raise GitHubRateLimitError(reset_at=reset_at)
            
            if response.status_code == 404:
                return None
            
            response.raise_for_status()
            return response.json()
    async def _paginate(self, endpoint: str, params: dict = None, max_pages: int = 10) -> list:
        """
        Fetch all pages of a paginated github endpoint
        max_pages prevents reunaway api consuption for prolific users
        """
        results = []
        page=1
        params = params or {}

        while page <= max_pages:
            params["page"]= page
            params["per_page"] = 100 # max allowed

            data = await self._request(endpoint, params)

            if not data:
                break
            
            results.extend(data)

            if len(data) < 100: # reached last page
                break

            page += 1
            await asyncio.sleep(0.1)

        return results
    
    async def get_user(self, username: str) -> Optional[dict]:
        return await self._request(f"/users/{username}")
    
    async def get_repositories(self, username: str) -> list:
        return await self._paginate(
            f"/users/{username}/repos",
            params={"sort": "updated", "type": "owner"}
        )
    
    async def get_events(self, username: str) -> list:
        """
        Events api: last 90 days, max 300 events
        """
        return await self._paginate(
            f"users/{username}/events/public",
            max_pages=3 # events api caps at 300 events - 3 pages of 100
        )
    
    async def get_commit_activity(self, owner: str, repo: str) -> Optional[list]:
        return await self._request(f"/repos/{owner}/{repo}/stats/commit_activity")
    
    async def get_languages(self, owner: str, repo: str) -> Optional[dict]:
        return await self._request(f"/repos/{owner}/{repo}/languages")
    
    async def get_contributors(self, owner: str, repo: str) -> Optional[dict]:
        return await self._paginate(f"/repos/{owner}/{repo}/contributors", max_pages=2)

  