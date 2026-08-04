// frontend/src/components/ProfileHeader.tsx
import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { MapPin, Users, GitFork, Star, Calendar, Award, Code2 } from 'lucide-react';

interface ProfileHeaderProps {
  data: DeveloperReport;
}

export function ProfileHeader({ data }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-3xl" />
      
      <div className="relative glass rounded-2xl p-6 md:p-8 border border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with glow */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 animate-glow" />
            <img
              src={data.avatar_url}
              alt={data.display_name}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500/20 p-1.5 rounded-full border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{data.display_name}</h2>
              <span className="text-gray-400">@{data.username}</span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/20">
                {data.developer_type}
              </span>
            </div>

            {data.bio && (
              <p className="text-gray-300 text-sm md:text-base max-w-2xl">{data.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
              {data.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {data.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" /> {data.followers.toLocaleString()} followers
              </span>
              <span className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4" /> {data.public_repos} repos
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4" /> {data.total_stars.toLocaleString()} stars
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {data.account_age_days} days on GitHub
              </span>
            </div>
          </div>

          {/* Summary Badge */}
          <div className="flex flex-col items-center gap-1 p-4 bg-white/5 rounded-xl border border-white/5 min-w-[100px]">
            <Award className="w-6 h-6 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{data.overall_score}</div>
            <div className="text-xs text-gray-400">Overall Score</div>
          </div>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl border border-white/5"
        >
          <div className="flex items-start gap-3">
            <Code2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-gray-300 text-sm leading-relaxed">{data.profile_summary}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}