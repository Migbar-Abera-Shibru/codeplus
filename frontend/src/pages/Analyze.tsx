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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">
          CodePulse
        </h1>
        <p className="text-gray-400 text-center mb-8">
          GitHub Activity Analyzer & Developer Insights
        </p>

        <SearchBar
          value={username}
          onChange={setUsername}
          onSearch={() => setSearchedUser(username)}
          isLoading={isLoading}
        />

        {error && <ErrorDisplay error={error} />}

        {data && (
          <div className="mt-8 space-y-6">
            <ProfileCard profile={data} />
            <ScoreCards
              consistency={data.scores.consistency_score}
              complexity={data.scores.complexity_score}
              collaboration={data.scores.collaboration_score}
              overall={data.scores.overall_score}
            />
            <LanguageChart languages={data.top_languages} />
            <ActivityHeatmap commitDays={data.activity.commit_days_90d} />
          </div>
        )}
      </div>
    </div>
  );
}