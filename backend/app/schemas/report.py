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