import { motion } from 'framer-motion';
import { Activity, BarChart3, Users, PlusCircle } from 'lucide-react';
import type { DeveloperReport } from '../services/api';

export function ScoreGrid({ data }: { data: DeveloperReport }) {
  const scores = [
    ['Consistency', data.consistency_score, 'Commit regularity', Activity, 'violet'],
    ['Complexity', data.complexity_score, 'Project depth', BarChart3, 'blue'],
    ['Collaboration', data.collaboration_score, 'Community engagement', Users, 'pink'],
    ['Overall Score', data.overall_score, 'Combined score', PlusCircle, 'purple'],
  ] as const;
  return <div className="score-grid">{scores.map(([label, value, description, Icon, tone], index) => <motion.article key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} className={`score-card tone-${tone}`}>
    <div className="score-card-icon"><Icon /></div><div className="score-card-copy"><span>{label}</span><strong>{value}</strong><small>{description}</small></div><div className="sparkline" aria-hidden="true"><i /><i /><i /><i /><i /></div>
  </motion.article>)}</div>;
}
