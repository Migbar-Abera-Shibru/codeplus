// frontend/src/pages/Analyze.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyzeProfile } from '../services/api';
import type { DeveloperReport } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { ProfileCard } from '../components/ProfileCard';
import { LanguageChart } from '../components/LanguageChart';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { ScoreCards } from '../components/ScoreCard';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Loader2 } from 'lucide-react';

export function AnalyzePage() {
  const [username, setUsername] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', searchedUser],
    queryFn: () => analyzeProfile(searchedUser),
    enabled: !!searchedUser,
    staleTime: 1000 * 60 * 30,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 429) return false;
      return failureCount < 2;
    }
  });

  // Check if data exists
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2">CodePulse</h1>
          <p className="text-gray-400 text-center mb-8">GitHub Activity Analyzer & Developer Insights</p>
          <SearchBar
            value={username}
            onChange={setUsername}
            onSearch={() => setSearchedUser(username)}
            isLoading={isLoading}
          />
          <div className="flex justify-center mt-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">CodePulse</h1>
        <p className="text-gray-400 text-center mb-8">GitHub Activity Analyzer & Developer Insights</p>

        <SearchBar
          value={username}
          onChange={setUsername}
          onSearch={() => setSearchedUser(username)}
          isLoading={isLoading}
        />

        {error && <ErrorDisplay error={error} />}

        {data && (
          <div className="mt-8 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-start gap-6">
                <img
                  src={data.avatar_url}
                  alt={data.display_name}
                  className="w-20 h-20 rounded-full border-2 border-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">{data.display_name}</h2>
                    <span className="text-gray-400">@{data.username}</span>
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
                      {data.developer_type}
                    </span>
                  </div>
                  
                  {data.bio && (
                    <p className="text-gray-300 mt-1">{data.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                    {data.location && (
                      <span className="flex items-center gap-1">📍 {data.location}</span>
                    )}
                    <span>👥 {data.followers} followers</span>
                    <span>📁 {data.public_repos} repos</span>
                    <span>⭐ {data.total_stars} total stars</span>
                    <span>📅 {data.account_age_days} days on GitHub</span>
                  </div>
                </div>
              </div>
              
              {/* Summary Card */}
              <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {data.profile_summary}
                </p>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-green-400">{data.consistency_score}</div>
                <div className="text-gray-400 text-sm">Consistency</div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${data.consistency_score}%` }} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-blue-400">{data.complexity_score}</div>
                <div className="text-gray-400 text-sm">Complexity</div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${Math.min(data.complexity_score, 100)}%` }} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                <div className="text-3xl font-bold text-purple-400">{data.collaboration_score}</div>
                <div className="text-gray-400 text-sm">Collaboration</div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${Math.min(data.collaboration_score, 100)}%` }} />
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center border border-yellow-500/50">
                <div className="text-3xl font-bold text-yellow-400">{data.overall_score}</div>
                <div className="text-gray-400 text-sm">Overall</div>
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-yellow-500" style={{ width: `${data.overall_score}%` }} />
                </div>
              </div>
            </div>

            {/* Language Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
              <div className="flex flex-wrap gap-2">
                {data.top_languages.slice(0, 7).map((lang) => (
                  <div key={lang.language} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                    {lang.language}: {lang.percentage.toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Activity Summary (Last 90 Days)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{data.total_commits_90d}</div>
                  <div className="text-gray-400 text-sm">Total Commits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{data.active_days_90d}</div>
                  <div className="text-gray-400 text-sm">Active Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{data.longest_streak_days}</div>
                  <div className="text-gray-400 text-sm">Longest Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{data.current_streak_days}</div>
                  <div className="text-gray-400 text-sm">Current Streak</div>
                </div>
              </div>
            </div>

            {/* Repository List */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Top Projects by Complexity</h3>
              <div className="space-y-3">
                {data.repo_complexity_breakdown.slice(0, 5).map((repo) => (
                  <div key={repo.name} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div>
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {repo.name}
                      </a>
                      <span className="text-gray-400 text-sm ml-2">{repo.language || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm">⭐ {repo.stars}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        repo.complexity_tier === 'High' ? 'bg-green-600/30 text-green-400' :
                        repo.complexity_tier === 'Medium' ? 'bg-yellow-600/30 text-yellow-400' :
                        'bg-gray-600/30 text-gray-400'
                      }`}>
                        {repo.complexity_tier} ({repo.score})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}