from dataclasses import dataclass
from typing import Optional
from collections import defaultdict
from datetime import datetime, timezone
import math

@dataclass
class LanguageStats:
    language: str
    bytes_of_code: int
    percentage: float
    repo_count: int

@dataclass
class DeveloperReport:
    username: str
    display_name: str
    avatar_url: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    public_repos: int
    followers: int
    account_age_days: int

    # language analysis
    top_languages: list[LanguageStats]
    language_diversity_score: float

    # activity analysis
    total_commits_90d: int
    active_days_90d: int
    longest_streak_days: int
    current_streak_days: int
    contribution_consistentcy: float # 0-100

    # project analysis
    total_stars: int
    avg_compleity_score: float
    repo_complexity_breakdown: list[dict]

    # collaborations
    total_collaborators: int
    collaboration_score: float
    top_colaborators: list[dict]

    # scores
    complexity_score: float
    consistency_score: float
    overall_score: float

    # developer profile type
    developer_type: str   # full-stack, backend developer, etc.
    profile_summary: str  # human readable summary

    generated_at: str

    
