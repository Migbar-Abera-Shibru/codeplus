// frontend/src/pages/SharedReport.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedReport } from '../services/api';
import type { DeveloperReport } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { LanguageChart } from '../components/LanguageChart';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Loader2 } from 'lucide-react';

export function SharedReportPage() {
  const { shareToken } = useParams<{ shareToken: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['sharedReport', shareToken],
    queryFn: () => getSharedReport(shareToken!),
    enabled: !!shareToken,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="w-full max-w-md">
          <ErrorDisplay error={error} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">CodePulse Report</h1>
          <span className="text-gray-400 text-sm">
            Generated: {new Date(data.generated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="space-y-6">
          {/* Profile Card - uses data directly */}
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
                    <span>📍 {data.location}</span>
                  )}
                  <span>👥 {data.followers} followers</span>
                  <span>📁 {data.public_repos} repos</span>
                  <span>⭐ {data.total_stars} total stars</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
              <p className="text-gray-300 text-sm leading-relaxed">{data.profile_summary}</p>
            </div>
          </div>

          {/* Score Cards - uses data directly (no nested scores object) */}
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

          {/* Language and Activity Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguageChart languages={data.top_languages} />
            
            {/* Activity Summary */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Summary (Last 90 Days)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{data.total_commits_90d}</div>
                  <div className="text-gray-400 text-sm">Total Commits</div>
                </div>
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{data.active_days_90d}</div>
                  <div className="text-gray-400 text-sm">Active Days</div>
                </div>
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{data.longest_streak_days}</div>
                  <div className="text-gray-400 text-sm">Longest Streak</div>
                </div>
                <div className="text-center p-3 bg-gray-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{data.current_streak_days}</div>
                  <div className="text-gray-400 text-sm">Current Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Repositories List */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Top Projects</h3>
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
      </div>
    </div>
  );
}