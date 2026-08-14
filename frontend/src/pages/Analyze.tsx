// frontend/src/pages/Analyze.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeProfile } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { DeveloperDashboard } from '../components/DeveloperDashboard';
import { ErrorDisplay } from '../components/ErrorDisplay';
import { 
  Code2, 
  Github, 
  TrendingUp, 
  Users, 
  GitBranch,
  Sparkles,
  Zap,
  Star,
  Activity
} from 'lucide-react';

export function AnalyzePage() {
  const [username, setUsername] = useState<string>('');
  const [searchedUser, setSearchedUser] = useState<string>('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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

  useEffect(() => {
    if (data) setIsFirstLoad(false);
  }, [data]);

  const stats = [
    { icon: Github, label: 'Powered by GitHub API', color: 'text-gray-400' },
    { icon: TrendingUp, label: 'Real-time analysis', color: 'text-gray-400' },
    { icon: Users, label: 'Public profiles', color: 'text-gray-400' },
    { icon: GitBranch, label: 'Open source', color: 'text-gray-400' },
  ];

  return (
    <div className="min-h-screen bg-[#05050a] overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] -top-48 -left-48 bg-blue-600/20" />
        <div className="orb w-[500px] h-[500px] top-1/2 -right-48 bg-purple-600/20" />
        <div className="orb w-[400px] h-[400px] bottom-0 left-1/2 bg-pink-600/10" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-50 animate-pulse-ring" />
              <div className="relative p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 backdrop-blur-xl">
                <Code2 className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="gradient-text-glow">CodePulse</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Transform any GitHub profile into a stunning, shareable 
            <span className="text-white font-medium"> developer intelligence report</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Discover insights that GitHub never shows</span>
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
        <AnimatePresence mode="wait">
          {data && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-8 md:mt-12"
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
          className="mt-16 md:mt-20 flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-gray-500"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <Icon className={`w-4 h-4 ${stat.color}`} />
                {stat.label}
              </motion.span>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}