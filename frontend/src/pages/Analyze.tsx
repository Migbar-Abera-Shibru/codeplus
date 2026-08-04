// frontend/src/pages/Analyze.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { DeveloperDashboard } from '../components/DeveloperDashboard';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { Code2, Github, TrendingUp, Users, GitBranch } from 'lucide-react';

export function AnalyzePage() {
  const [username, setUsername] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<string>('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', searchedUser],
    queryFn: () => analyzeProfile(searchedUser),
    enabled: !!searchedUser,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error?.status === 404 || error?.status === 429) return false;
      return failureCount < 2;
    },
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-blue-500/5 via-purple-500/5 to-transparent animate-pulse-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-pink-500/5 via-purple-500/5 to-transparent animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-xl border border-white/10">
              <Code2 className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="gradient-text">CodePulse</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transform any GitHub profile into a beautiful, shareable developer intelligence report
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchBar
            value={username}
            onChange={setUsername}
            onSearch={() => setSearchedUser(username)}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 max-w-2xl mx-auto"
            >
              <ErrorDisplay error={error} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <DeveloperDashboard data={data} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 flex justify-center gap-8 text-sm text-gray-500"
        >
          <span className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            Powered by GitHub API
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Real-time analysis
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Public profiles
          </span>
          <span className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Open source
          </span>
        </motion.div>
      </div>
    </div>
  );
}