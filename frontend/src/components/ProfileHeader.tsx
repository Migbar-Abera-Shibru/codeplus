import { motion } from 'framer-motion';
import { MapPin, Users, GitFork, Star, Calendar, Github } from 'lucide-react';
import type { DeveloperReport } from '../services/api';

export function ProfileHeader({ data }: { data: DeveloperReport }) {
  const facts = [
    data.location && { icon: MapPin, value: data.location },
    { icon: Users, value: `${data.followers.toLocaleString()} Followers` },
    { icon: GitFork, value: `${data.public_repos} Repositories` },
    { icon: Star, value: `${data.total_stars.toLocaleString()} Total Stars` },
    { icon: Calendar, value: `${data.account_age_days}d GitHub Age` },
  ].filter(Boolean) as { icon: typeof MapPin; value: string }[];
  return <section className="profile-panel">
    <div className="profile-main">
      <div className="avatar-ring"><img src={data.avatar_url} alt={`${data.display_name} avatar`} /></div>
      <div className="profile-copy">
        <div className="profile-title"><h1>{data.display_name}</h1><span className="verified">✓</span></div>
        <p className="profile-handle">@{data.username} <b>•</b> {data.developer_type}</p>
        {data.bio && <p className="profile-bio">{data.bio}</p>}
        <div className="profile-facts">{facts.map(({ icon: Icon, value }) => <span key={value}><Icon />{value}</span>)}</div>
      </div>
    </div>
    <div className="score-spotlight">
      <div className="score-ring"><strong>{data.overall_score}</strong><span>Overall Score</span></div>
      <div><h3>Developer Intelligence Score</h3><p>{data.profile_summary}</p></div>
    </div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-summary"><Github /><span>{data.profile_summary}</span></motion.div>
  </section>;
}
