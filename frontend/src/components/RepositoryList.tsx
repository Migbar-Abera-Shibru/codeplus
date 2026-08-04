// frontend/src/components/RepositoryList.tsx
import { motion } from 'framer-motion';
import type { RepositoryComplexity } from '../services/api';
import { Star, GitFork, ExternalLink, Code2 } from 'lucide-react';

interface RepositoryListProps {
  repos: RepositoryComplexity[];
}

export function RepositoryList({ repos }: RepositoryListProps) {
  if (!repos || repos.length === 0) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'High': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Top Projects</h3>
      <div className="space-y-3">
        {repos.slice(0, 5).map((repo, index) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="block p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <Code2 className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-white group-hover:text-blue-400 transition-colors">
                    {repo.name}
                  </span>
                  {repo.language && (
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {repo.language}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Star className="w-4 h-4" /> {repo.stars}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <GitFork className="w-4 h-4" /> {repo.forks}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getTierColor(repo.complexity_tier)}`}>
                  {repo.complexity_tier} ({repo.score})
                </span>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}