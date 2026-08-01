// frontend/src/pages/SharedReport.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSharedReport, DeveloperReport } from '../services/api';
import { ProfileCard } from '../components/ProfileCard';
import { ScoreCards } from '../components/ScoreCards';
import { LanguageChart } from '../components/LanguageChart';
import { ActivityHeatmap } from '../components/ActivityHeatmap';
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
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-400">Report Not Found</h2>
          <p className="text-gray-400 mt-2">This report may have been removed or is not public.</p>
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
          <ProfileCard profile={data} />
          
          <ScoreCards
            consistency={data.scores.consistency_score}
            complexity={data.scores.complexity_score}
            collaboration={data.scores.collaboration_score}
            overall={data.scores.overall_score}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LanguageChart languages={data.top_languages} />
            <ActivityHeatmap commitDays={data.activity.commit_days_90d} />
          </div>
        </div>
      </div>
    </div>
  );
}