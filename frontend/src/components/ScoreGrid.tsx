// frontend/src/components/ScoreGrid.tsx
import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { TrendingUp, Zap, Users, Activity, BarChart3 } from 'lucide-react';

interface ScoreGridProps {
  data: DeveloperReport;
}

export function ScoreGrid({ data }: ScoreGridProps) {
  const scores = [
    {
      label: 'Consistency',
      value: data.consistency_score,
      icon: Activity,
      gradient: 'from-emerald-400 to-green-500',
      bgGradient: 'from-emerald-500/20 to-green-500/10',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      description: 'Commit regularity',
    },
    {
      label: 'Complexity',
      value: data.complexity_score,
      icon: BarChart3,
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-500/20 to-cyan-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      description: 'Project depth',
    },
    {
      label: 'Collaboration',
      value: data.collaboration_score,
      icon: Users,
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-500/20 to-pink-500/10',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      description: 'Community engagement',
    },
    {
      label: 'Overall',
      value: data.overall_score,
      icon: Zap,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/10',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      description: 'Combined score',
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {scores.map((score, index) => {
        const Icon = score.icon;
        return (
          <motion.div
            key={score.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`relative group overflow-hidden rounded-xl border ${score.borderColor} ${
              score.highlight 
                ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/5 ring-1 ring-yellow-500/20' 
                : `bg-gradient-to-br ${score.bgGradient}`
            } backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
          >
            {/* Animated gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-r ${score.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-white/5 border ${score.borderColor}`}>
                  <Icon className={`w-5 h-5 ${score.textColor}`} />
                </div>
                <span className={`text-3xl md:text-4xl font-bold ${score.textColor}`}>
                  {score.value}
                </span>
              </div>
              
              <div>
                <div className="text-white font-medium text-sm">{score.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{score.description}</div>
              </div>
              
              <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(score.value, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${score.gradient}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}