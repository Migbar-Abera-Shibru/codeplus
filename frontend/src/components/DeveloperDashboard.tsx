// frontend/src/components/DeveloperDashboard.tsx
import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { ProfileHeader } from './ProfileHeader';
import { ScoreGrid } from './ScoreGrid';
import { LanguageChart } from './LanguageChart';
import { ActivitySummary } from './ActivitySummary';
import { RepositoryList } from './RepositoryList';
import { ShareButton } from './ShareButton';

interface DeveloperDashboardProps {
  data: DeveloperReport;
}

export function DeveloperDashboard({ data }: DeveloperDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProfileHeader data={data} />
      </motion.div>

      {/* Score Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ScoreGrid data={data} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LanguageChart languages={data.top_languages} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ActivitySummary data={data} />
        </motion.div>
      </div>

      {/* Repository List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <RepositoryList repos={data.repo_complexity_breakdown} />
      </motion.div>

      {/* Share Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-center pt-4"
      >
        <ShareButton username={data.username} />
      </motion.div>
    </div>
  );
}