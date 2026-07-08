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
    
    def _analyze_complexity(self, repostiories: list) -> dict:
        breakdown = []

        for repo in repostiories:
            if repo.get("fork"):
                continue

            score = 0.0

            # size score
            size_kb = repo.get("size", 0)
            size_score = min(size_kb / 51200, 1.0)
            score += size_score * 0.15

            # language diversity
            topics = repo.get("topics", [])
            topic_score = min(len(topics) / 5, 1.0)
            score += topic_score * 0.05

            # has README
            score += 0.10 if repo.get("has_wiki") or repo.get("description") else 0

            # has description
            score += 0.05 if repo.get("description") else 0

            # open issues
            issues = repo.get("open_issue_count", 0)
            issue_score = min(issues / 20, 1.0)
            score += issue_score * 0.10

            # forks
            forks = repo.get("forks_count", 0)
            fork_score = min(forks / 50, 1.0)
            score += fork_score * 0.15

            # stars
            stars = repo.get("stargazers_count", 0)
            star_score = min(stars / 100, 1.0)
            score += star_score * 0.15

            # repo age
            created = datetime.strptime(
                repo["created_at"], "%Y-%m-%dT%H:%M:%SZ"
            ).replace(tzinfo=timezone.utc)
            age_days = (datetime.now(timezone.utc) - created).days
            age_score = min(age_days / 730, 1.0)
            score += age_score * 1.0

            # watchers
            watchers = repo.get("watchers_count", 0)
            watcher_score= min(watchers / 50, 1.0)
            score += watcher_score * 0.15

            final_score = round(score + 100, 1)

            breakdown.append({
                "name": repo["name"],
                "score": final_score,
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "language": repo.get("language"),
                "url": repo.get("html_url"),
                "complexity_tier": self.complexity_tier(final_score)
            })
        
        breakdown.sort(key=lambda x: x["score"], reverse=True)
        avg_score = (
            sum(r["score"] for r in breakdown) / len(breakdown)
            if breakdown else 0 
        )

        return {
            "breakdown": breakdown[:20],
            "avg_score": round(avg_score, 1)
        }
    def _complexity_tier(self, score: float) -> str:
        if score >= 70: return "High"
        if score >=40: return "Medium"
        return "Low"
    
    def _analyze_collaboration(self, repositories: list) -> dict:
        total_forks = sum(r.get("forks_count", 0) for r in repositories if not r.get("fork"))
        total_watchers = sum(r.get("watchers_count", 0) for r in repositories if not r.get("fork"))

        estimated_collaborators = total_forks

        return {
            "total_collaborators": estimated_collaborators,
            "total_forks": total_forks,
            "total_watchers": total_watchers,
            "top_collaborators": []
        }
    
    def _calculate_consistency_score(self, activity_stats: dict) -> float:
        active_ratio = min(activity_stats["active_days"] / 90, 1.0)
        streak_ratio = min(activity_stats["longest_streak"] / 30, 1.0)
        commmit_ratio = min(activity_stats["total_commits"] / 200, 1.0)

        score = (active_ratio * 0.50) + (streak_ratio * 0.30) + (commmit_ratio * 0.20)
        return round(score * 100, 1)
    
    def _calculate_complexity_score(self, complexity_stats: dict) -> float:
        return complexity_stats["avg_score"]
    
    def _calculate_collaboration_score(self, collaboration_stats: dict) -> float:
        forks = collaboration_stats["total_forks"]
        score = min(forks / 100, 1.0) * 100
        return round(score, 1)
    
    def _calculate_overall_score(
            self,
            consistency: float,
            collaboration: float,
            complexity: float
    ) -> float:
        return round( 
            (consistency * 0.40) + (complexity * 0.35) + (collaboration * 0.25), 1
        )
    
    def _determine_developer_type(self, language_stats: dict) -> str:
        if not language_stats["top_languages"]:
            return "Developer"
        
        top_langs = [l.language for l in language_stats["top_languages"][:3]]

        web_fronend = {"JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Swelte"}
        web_backend = {"Python", "Ruby", "PHP", "Go", "Java", "C#", "Rust"}
        mobile = {"Swift", "Kotlin", "Dart", "Objective-C"}
        systems = {"C", "C++", "Rust", "Assembly", "Zig"}
        data = {"Python", "R", "Julia", "MATLAB"}

        has_frontend = any( l in web_fronend for l in top_langs)
        has_backend = any( l in web_backend for l in top_langs)
        has_mobile = any(l in mobile for l in top_langs)
        has_systems = any(l in systems for l in top_langs)

        if has_frontend and has_backend:
            return "Full-Stack Developer"
        if has_backend:
            return "Bakcend Developer"
        if has_frontend:
            return "Frontend Developer"
        if has_mobile:
            return "Mobile Application Developer"
        if has_systems:
            return "Systems Developer"
        return "Software Develoepr"
    
    def _generate_summary(
            self,
            user_data: dict,
            language_stats: dict,
            activity_stats: dict,
            consistency_score: float,
            complexity_score: float,
    ) -> str:
        
        name = user_data.get("name") or user_data["login"]
        top_lang = (
            language_stats["top_languages"][0].language
            if language_stats["top_languages"] else "multiple languages"
        )

        consistency_label = (
            "highly_consistent" if consistency_score >= 70
            else "moderately active" if consistency_score >= 40
            else "occasionally active"
        )

        complexity_label = (
            "comples, production-grade" if complexity_score >= 60
            else "medium-complexity" if complexity_score >= 30
            else "exploratory"
        )

        return (
            f"{name} is a {consistency_label} developer who primarly works in"
            f"{top_lang}, with {activity_stats['active_days']} active coding days"
            f"in the last 90 days and a longest streak of "
            f"{activity_stats['longest_streak']} days."
            f"Their projects tend to be {complexity_label} in nature"
        )
    





        


