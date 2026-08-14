// frontend/src/components/ProfileHeader.tsx
import { motion } from 'framer-motion';
import type { DeveloperReport } from '../services/api';
import { 
  MapPin, 
  Users, 
  GitFork, 
  Star, 
  Calendar, 
  Award, 
  Code2,
  Github
} from 'lucide-react';

interface ProfileHeaderProps {
  data: DeveloperReport;
}

export function ProfileHeader({ data }: ProfileHeaderProps) {
  const statItems = [
    { icon: Users, label: 'Followers', value: data.followers.toLocaleString() },
    { icon: GitFork, label: 'Repositories', value: data.public_repos },
    { icon: Star, label: 'Total Stars', value: data.total_stars.toLocaleString() },
    { icon: Calendar, label: 'GitHub Age', value: `${data.account_age_days}d` },
  ];

  return (
    <div className="relative">
      {/* Gradient border glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20" />
      
      <div className="relative glass-card p-6 md:p-8 overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/5 to-purple-500/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with ring */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse-ring" />
            <div className="relative">
              <img
                src={data.avatar_url}
                alt={data.display_name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white/10 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500/20 p-1.5 rounded-full border border-green-400/30 backdrop-blur-sm">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {data.display_name}
              </h2>
              <span className="text-gray-500">@{data.username}</span>
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                {data.developer_type}
              </span>
            </div>

            {data.bio && (
              <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
                {data.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-4">
              {data.location && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" /> {data.location}
                </span>
              )}
              {statItems.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <span key={index} className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Icon className="w-4 h-4" /> {stat.value} {stat.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex flex-col items-center gap-1 p-4 bg-white/5 rounded-xl border border-white/5 min-w-[100px] backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-30" />
              <Award className="relative w-7 h-7 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-white">{data.overall_score}</div>
            <div className="text-xs text-gray-500">Overall Score</div>
            <div className="w-full mt-1 bg-white/5 rounded-full h-1">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                style={{ width: `${Math.min(data.overall_score, 100)}%` }}
              />
            </div>
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
            <p className="text-gray-300 text-sm leading-relaxed">
              {data.profile_summary}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}