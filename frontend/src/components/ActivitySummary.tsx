// frontend/src/components/ActivitySummary.tsx
import type { DeveloperReport } from '../services/api';
import { Calendar, Flame, Clock, GitCommit } from 'lucide-react';

interface ActivitySummaryProps {
  data: DeveloperReport;
}

export function ActivitySummary({ data }: ActivitySummaryProps) {
  const stats = [
    {
      label: 'Total Commits',
      value: data.total_commits_90d,
      icon: GitCommit,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Active Days',
      value: data.active_days_90d,
      icon: Calendar,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Longest Streak',
      value: data.longest_streak_days,
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Current Streak',
      value: data.current_streak_days,
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="h-full bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-3 rounded-lg ${stat.bg} border border-white/5`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-gray-400 text-xs">{stat.label}</span>
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Consistency Score</span>
          <span className="text-emerald-400 font-semibold">{data.contribution_consistency}%</span>
        </div>
        <div className="mt-1 w-full bg-white/5 rounded-full h-1">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{ width: `${Math.min(data.contribution_consistency, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}