from dataclasses import dataclass  # the analysis layer that transforms raw GitHub data into meaningful insights. 
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

class DeveloperAnalyzer: 
    def analyze( 
            self,
            user_data: dict,
            repositories: list,
            events: list,
            languages_by_repo: dict
    ) -> DeveloperReport:
        """
        Main entry point. Orchestrates all analysis.
        """
        language_stats = self._analyze_languages(languages_by_repo)
        activity_stats = self._analyze_activity(events)
        complexity_stats = self._analyze_complexity(repositories)
        collaboration_stats = self._analyze_collaboration(repositories)

        consistency_score = self._calculate_consistency_score(activity_stats)
        complexity_score = self._calculate_complexity_score(complexity_stats)
        collaboration_score = self._calculate_collaboration_score(collaboration_stats)
        overall_score = self._calculate_overall_score(
            consistency_score, complexity_score, collaboration_score
        )

        developer_type = self._determine_developer_type(language_stats)
        profile_summary = self._generate_summary(
            user_data, language_stats, activity_stats, complexity_score, consistency_score
        )

        account_created = datetime.strptime(
            user_data["created_at"], "%Y-%m-%dT%H:%M:%SZ"
        ).replace(tzinfo=timezone.utc)
        account_age_days = (datetime.now(timezone.utc) - account_created).days

        return DeveloperReport(
            username=user_data["login"],
            display_name=user_data.get("name") or user_data["login"],
            avatar_url=user_data["avatar_url"],
            bio=user_data.get("bio"),
            location=user_data.get("location"),
            public_repos=user_data["public_repos"],
            followers=user_data["followers"],
            account_age_days=account_age_days,
            top_languages=language_stats["top_languages"],
            language_diversity_score=language_stats["diversity_score"],
            total_commits_90d=activity_stats["total_commits"],
            active_days_90d=activity_stats["active_days"],
            longest_streak_days=activity_stats["longest_streak"],
            current_streak_days=activity_stats["current_streak"],
            contribution_consistency=consistency_score,
            total_stars=sum(r.get("stargazers_count", 0) for r in repositories),
            avg_complexity_score=complexity_stats["avg_score"],
            repo_complexity_breakdown=complexity_stats["breakdown"],
            total_collaborators=collaboration_stats["total_collaborators"],
            collaboration_score=collaboration_score,
            top_collaborators=collaboration_stats["top_collaborators"],
            complexity_score=complexity_score,
            consistency_score=consistency_score,
            overall_score=overall_score,
            developer_type=developer_type,
            profile_summary=profile_summary,
            generated_at=datetime.now(timezone.utc).isoformat()
        )
    
    def _analyze_languages(self, languages_by_repo: dict) -> dict:
        total_bytes = defaultdict(int)
        repo_counts = defaultdict(int)

        for repo_name, lang_data in languages_by_repo.items():
            if not lan_data:
                continue
            for language, byte_count in lang_data.items():
                total_bytes[language] += byte_count
                repo_counts[language] += 1

        grand_total = sum(total_bytes.values()) or 1

        top_languages = sorted([
            LanguageStats(
                language=lang,
                bytes_of_code=byte_count,
                percentage=round((byte_count / grand_total) * 100, 1),
                repo_count=repo_counts[lang]
            )
            for lang, bytes_count in total_bytes.items()
        ], key=lambda x: x.bytes_of_code, reverse=True)[:10]

        # shannon entropy for diversity score
        diversity_score = 0.0
        if len(top_languages) > 1:
            proportions = [l.percentage / 100 for l in top_languages]
            entropy = -sum(p * math.log2(p) for p in proportions if p>0)
            max_entropy = math.log2(len(proportions))
            diversity_score = round((entropy / max_entropy) * 100, 1) if max_entropy > 0 else 0

        return {
            "top_languages": top_languages,
            "diversity_score": diversity_score
        }

    def _analyze_activity(self, events: list) -> dict:
        commit_days = set()
        total_commits = 0 

        for event in events: 
            if event.get("type") != "PushEvent":
                continue

            created_at = datetime.strptime(
                event["created_at"], "%Y-%m-%dT%H:%M:%SZ"
            ).replace(tzinfo=timezone.utc)

            day_str = created_at.strftime("%Y-%m-%d")
            commit_days.add(day_str)

            payload = event.get("payload", {})
            total_commits += len(payload.get("commits", []))

        # calculating streaks 
        sorted_days = sorted(commit_days)
        longest_streak = self._calculate_longest_streak(sorted_days)
        current_streak = self._calculate_current_streak(sorted_days)

        return {
            "total_commits": total_commits,
            "active_days": len(commit_days),
            "longest_streak": longest_streak,
            "current_streak": current_streak
        }
    
    def _calculate_longest_streak(self, sorted_days: list) -> int:
        if not sorted_days:
            return 0
        
        max_streak = current = 1
        for i in range(1, len(sorted_days)):
            prev = datetime.strptime(sorted_days[i-1], "%Y-%m-%d")
            curr = datetime.strptime(sorted_days[i], "%Y-%m-%d")
            if (curr-prev).days == 1:
                current += 1
                max_streak = max(max_streak, current)
            else:
                current = 1

        return max_streak
    
    def _calculate_current_streak(self, sorted_days: list) -> int:
        if not sorted_days:
            return 0 
        
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        from datetime import timedelta
        yesterday = (datetime.now(timezone.utc).replace(hour=0) - timedelta(days=1)).strftime("%Y-%m-%d")

        if sorted_days[-1] not in [today, yesterday]:
            return 0 
        
        streak = 1
        for i in range(len(sorted_days) - 1, 0, -1):
            prev = datetime.strptime(sorted_days[i-1], "%Y-%m-%d")
            curr = datetime.strptime(sorted_days[i], "%Y-%m-%d")
            if (curr-prev).days == 1:
                streak += 1
            else:
                break
        return streak





        


