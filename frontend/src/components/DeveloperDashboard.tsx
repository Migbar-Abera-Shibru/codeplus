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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DeveloperDashboard({ data }: DeveloperDashboardProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 md:space-y-8"
    >
      {/* Profile Header */}
      <motion.div variants={itemVariants}>
        <ProfileHeader data={data} />
      </motion.div>

      {/* Score Grid */}
      <motion.div variants={itemVariants}>
        <ScoreGrid data={data} />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <LanguageChart languages={data.top_languages} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ActivitySummary data={data} />
        </motion.div>
      </div>

      {/* Repository List */}
      <motion.div variants={itemVariants}>
        <RepositoryList repos={data.repo_complexity_breakdown} />
      </motion.div>

      {/* Share Section */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl border border-white/5"
      >
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-400">
            Share your developer report with the world
          </p>
          <p className="text-xs text-gray-500">
            Generate a permanent, shareable link
          </p>
        </div>
        <ShareButton username={data.username} />
      </motion.div>
    </motion.div>
  );
}