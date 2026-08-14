// frontend/src/components/ActivitySummary.tsx
import type { DeveloperReport } from '../services/api';
import { motion } from 'framer-motion';
import { Calendar, Flame, Clock, GitCommit, TrendingUp, BarChart } from 'lucide-react';

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
      border: 'border-blue-500/20',
    },
    {
      label: 'Active Days',
      value: data.active_days_90d,
      icon: Calendar,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Longest Streak',
      value: data.longest_streak_days,
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
    {
      label: 'Current Streak',
      value: data.current_streak_days,
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full glass-card p-6 min-h-[320px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Activity Summary</h3>
        <span className="text-xs text-gray-500 ml-auto">Last 90 days</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-xl ${stat.bg} border ${stat.border}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-gray-500 text-xs">{stat.label}</span>
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-gray-400">Consistency Score</span>
          </div>
          <span className="text-emerald-400 font-bold">{data.contribution_consistency}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(data.contribution_consistency, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500"
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </motion.div>
  );
}