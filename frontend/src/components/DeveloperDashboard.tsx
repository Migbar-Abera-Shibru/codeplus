import { motion } from 'framer-motion';
import { Activity, GitFork, Github, Star, Users } from 'lucide-react';
import type { DeveloperReport } from '../services/api';
import { ProfileHeader } from './ProfileHeader';
import { ScoreGrid } from './ScoreGrid';
import { LanguageChart } from './LanguageChart';
import { ActivitySummary } from './ActivitySummary';
import { RepositoryList } from './RepositoryList';
import { ShareButton } from './ShareButton';

export function DeveloperDashboard({ data }: { data: DeveloperReport }) {
 const kpis=[['Commits / 90d',data.total_commits_90d,Activity],['Active days',data.active_days_90d,Activity],['Stars collected',data.total_stars,Star],['Collaborators',data.total_collaborators,Users]] as const;
 return <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col gap-6">
  <ProfileHeader data={data}/><ScoreGrid data={data}/>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{kpis.map(([label,value,Icon])=><div key={label} className="surface rounded-2xl p-4"><div className="flex items-center justify-between"><span className="font-mono-label text-[10px] text-zinc-500">{label}</span><Icon className="size-4 text-zinc-600"/></div><p className="mt-3 text-2xl font-semibold text-zinc-100">{Number(value).toLocaleString()}</p></div>)}</div>
  <div className="grid gap-6 lg:grid-cols-2"><LanguageChart languages={data.top_languages}/><ActivitySummary data={data}/></div>
  <RepositoryList repos={data.repo_complexity_breakdown}/>
  <div className="surface flex flex-col gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono-label text-[10px] text-fuchsia-300">Make it portable</p><h3 className="mt-2 text-xl font-semibold text-zinc-100">Share your developer signal.</h3><p className="mt-1 text-sm text-zinc-500">Create a permanent link to this report.</p></div><ShareButton username={data.username}/></div>
 </motion.div>;
}
