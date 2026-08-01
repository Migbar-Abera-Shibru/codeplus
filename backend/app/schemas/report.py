from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class LanguageStats(BaseModel):
    language: str
    percentage: float
    bytes_of_code: int
    repo_count: int

class RepositoryComplexity(BaseModel):
    name: str
    score: float
    stars: int
    forks: int
    language: Optional[str]
    url: str
    complexity_tier: str

class DeveloperProfile(BaseModel):
    username: str
    display_name: str
    avatar_url: str
    bio: Optional[str]
    location: Optional[str]
    public_repos: int
    followers: int
    account_age_days: int

class ActivityStats(BaseModel):
    total_commits: int
    activity_days_90d: int
    commit_days_90d: int
    longest_streak_days: int
    current_streak_days: int

class Scores(BaseModel):
    consistency_score: float
    complexity_score: float
    collaboration_score: float
    overall_score: float

class ReportResponse(BaseModel):
    username: str
    display_name: str
    avatar_url: str
    bio: Optional[str]
    location: Optional[str]
    public_repos: int
    followers: int
    account_age_days: int

    top_languages: List[LanguageStats]
    language_diversity_score: float

    activity: ActivityStats
    contribution_consistency: float

    total_stars: int
    avg_complexity_score: float
    repo_complexity_breakdown: List[RepositoryComplexity]

    total_collaborators: int
    collaboration_score: float
    top_collaborators: List[Dict[str, Any]]

    scores: Scores
    developer_type: str
    profile_summary: str
    generated_at: str

class ShareResponse(BaseModel):
    username: str
    share_token: str
    share_url: str
    generated_at: Optional[str]