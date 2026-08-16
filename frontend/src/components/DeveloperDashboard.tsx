import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { ProfileHeader } from './ProfileHeader';
import { ScoreGrid } from './ScoreGrid';
import { LanguageChart } from './LanguageChart';
import { ActivitySummary } from './ActivitySummary';
import { RepositoryList } from './RepositoryList';
import { ShareButton } from './ShareButton';

export function DeveloperDashboard({ data }: { data: DeveloperReport }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="report-dashboard">
      <ProfileHeader data={data} />
      <ScoreGrid data={data} />
      <div className="report-analytics">
        <LanguageChart languages={data.top_languages} />
        <ActivitySummary data={data} />
      </div>
      <div className="report-lower">
        <RepositoryList repos={data.repo_complexity_breakdown} />
        <section className="share-card">
          <div className="share-orbit" aria-hidden="true"><span>◈</span></div>
          <p className="report-kicker">PUBLIC REPORT</p>
          <h2>Share your developer report with the world</h2>
          <p>Generate a permanent, shareable link for your profile intelligence.</p>
          <ShareButton username={data.username} />
        </section>
      </div>
    </motion.div>
  );
}
