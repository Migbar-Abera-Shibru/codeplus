// frontend/src/components/RepositoryList.tsx
import { motion } from 'framer-motion';
import type { RepositoryComplexity } from '../services/api';
import { Star, GitFork, ExternalLink, Code2, ChevronRight } from 'lucide-react';

interface RepositoryListProps {
  repos: RepositoryComplexity[];
}

export function RepositoryList({ repos }: RepositoryListProps) {
  if (!repos || repos.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No repository data available</p>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'High': 
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium': 
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: 
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Top Projects</h3>
          <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
            {repos.length}
          </span>
        </div>
        <span className="text-xs text-gray-500">By complexity score</span>
      </div>

      <div className="space-y-2">
        {repos.slice(0, 6).map((repo, index) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group block p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors truncate">
                    {repo.name}
                  </span>
                  {repo.language && (
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Star className="w-3.5 h-3.5" /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks}
                  </span>
                  <span className={`font-medium ${getScoreColor(repo.score)}`}>
                    Score: {repo.score}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2.5 py-1 text-xs rounded-full border ${getTierColor(repo.complexity_tier)}`}>
                  {repo.complexity_tier}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {repos.length > 6 && (
        <div className="mt-3 text-center text-xs text-gray-500">
          +{repos.length - 6} more repositories
        </div>
      )}
    </div>
  );
}