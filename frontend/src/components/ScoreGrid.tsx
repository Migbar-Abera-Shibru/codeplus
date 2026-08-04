// frontend/src/components/ScoreGrid.tsx
import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { TrendingUp, Zap, Users, Activity } from 'lucide-react';

interface ScoreGridProps {
  data: DeveloperReport;
}

export function ScoreGrid({ data }: ScoreGridProps) {
  const scores = [
    {
      label: 'Consistency',
      value: data.consistency_score,
      icon: Activity,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Complexity',
      value: data.complexity_score,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
    },
    {
      label: 'Collaboration',
      value: data.collaboration_score,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
    },
    {
      label: 'Overall',
      value: data.overall_score,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {scores.map((score, index) => {
        const Icon = score.icon;
        return (
          <motion.div
            key={score.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative p-4 rounded-xl border ${score.borderColor} ${score.bgColor} backdrop-blur-sm ${
              score.highlight ? 'ring-2 ring-yellow-500/30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${score.bgColor}`}>
                <Icon className={`w-4 h-4 ${score.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${score.textColor}`}>
                {score.value}
              </span>
            </div>
            <div className="text-gray-400 text-sm">{score.label}</div>
            <div className="mt-2 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score.value, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className={`h-full rounded-full bg-gradient-to-r ${score.color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}