# backend/app/services/github_client.py
import httpx
import asyncio
from typing import Optional, Dict, Any, List
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class GitHubRateLimitError(Exception):
    def __init__(self, reset_at: int):
        self.reset_at = reset_at

class GitHubClient:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.GITHUB_API_TOKEN
        self.headers = {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
        self._client = None

    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create an async client with proper timeouts."""
        if self._client is None:
            # Use longer timeouts for GitHub API
            timeout = httpx.Timeout(
                connect=10.0,    # Connection timeout
                read=30.0,       # Read timeout (for slow responses)
                write=10.0,      # Write timeout
                pool=10.0        # Pool timeout
            )
            
            self._client = httpx.AsyncClient(
                timeout=timeout,
                follow_redirects=True,
                limits=httpx.Limits(
                    max_keepalive_connections=5, 
                    max_connections=10
                )
            )
        return self._client

    async def _request(self, endpoint: str, params: dict = None, retries: int = 2) -> Optional[Dict[str, Any]]:
        """Make a single request to GitHub API with retry logic."""
        url = f"{self.BASE_URL}{endpoint}"
        logger.info(f"Making request to: {url}")
        
        last_error = None
        
        for attempt in range(retries + 1):
            try:
                client = await self._get_client()
                
                response = await client.get(
                    url,
                    headers=self.headers,
                    params=params,
                )

                logger.info(f"Response status: {response.status_code} for {endpoint} (attempt {attempt + 1})")

                # Check rate limit headers
                remaining = int(response.headers.get("X-RateLimit-Remaining", 1))
                reset_at = int(response.headers.get("X-RateLimit-Reset", 0))
                logger.info(f"Rate limit remaining: {remaining} for {endpoint}")

                if response.status_code == 403 and remaining == 0:
                    raise GitHubRateLimitError(reset_at=reset_at)

                if response.status_code == 404:
                    return None

                response.raise_for_status()
                return response.json()

            except httpx.TimeoutException as e:
                last_error = e
                logger.warning(f"Timeout on attempt {attempt + 1}: {e}")
                if attempt < retries:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.info(f"Retrying in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise Exception(f"GitHub API request timed out after {retries + 1} attempts: {str(e)}")
                    
            except httpx.ConnectError as e:
                last_error = e
                logger.warning(f"Connection error on attempt {attempt + 1}: {e}")
                if attempt < retries:
                    wait_time = 2 ** attempt
                    logger.info(f"Retrying in {wait_time} seconds...")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise Exception(f"Failed to connect to GitHub API: {str(e)}")
                    
            except Exception as e:
                # Don't retry on other errors
                logger.error(f"Unexpected error: {e}")
                raise

        # If we get here, all retries failed
        if last_error:
            raise Exception(f"GitHub API request failed: {str(last_error)}")
        return None

    async def _paginate(self, endpoint: str, params: dict = None, max_pages: int = 5) -> List[Dict[str, Any]]:
        """Fetch all pages of a paginated GitHub endpoint."""
        results = []
        page = 1
        params = params or {}

        while page <= max_pages:
            try:
                params["page"] = page
                params["per_page"] = 100

                data = await self._request(endpoint, params, retries=1)

                if not data:
                    break

                results.extend(data)

                if len(data) < 100:
                    break

                page += 1
                await asyncio.sleep(0.2)  # Be nice to GitHub API
                
            except Exception as e:
                logger.error(f"Error fetching page {page}: {e}")
                # If we already have some results, return them
                if results:
                    logger.info(f"Returning {len(results)} results from previous pages")
                    break
                # Otherwise re-raise
                raise

        return results

    async def get_user(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user profile data."""
        return await self._request(f"/users/{username}", retries=2)

    async def get_repositories(self, username: str) -> List[Dict[str, Any]]:
        """Get all repositories for a user."""
        return await self._paginate(
            f"/users/{username}/repos",
            params={"sort": "updated", "type": "owner"},
            max_pages=5
        )

    async def get_events(self, username: str) -> List[Dict[str, Any]]:
        """Get public events for a user."""
        try:
            return await self._paginate(
                f"/users/{username}/events/public",
                max_pages=3
            )
        except Exception as e:
            logger.warning(f"Could not fetch events: {e}")
            return []  # Return empty list on error - not critical

    async def get_languages(self, owner: str, repo: str) -> Optional[Dict[str, int]]:
        """Get language breakdown for a repository."""
        try:
            return await self._request(f"/repos/{owner}/{repo}/languages", retries=1)
        except Exception as e:
            logger.warning(f"Could not fetch languages for {repo}: {e}")
            return {}  # Return empty dict on error

    async def close(self):
        """Close the HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()