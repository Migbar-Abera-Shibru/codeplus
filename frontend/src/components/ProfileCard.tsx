// frontend/src/components/ProfileCard.tsx
import { DeveloperReport } from '../services/api';
import { Calendar, MapPin, Users, GitFork, Star } from 'lucide-react';

interface ProfileCardProps {
  profile: DeveloperReport;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <div className="flex items-start gap-6">
        <img
          src={profile.avatar_url}
          alt={profile.display_name}
          className="w-20 h-20 rounded-full border-2 border-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-white">{profile.display_name}</h2>
            <span className="text-gray-400">@{profile.username}</span>
            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm">
              {profile.developer_type}
            </span>
          </div>
          
          {profile.bio && (
            <p className="text-gray-300 mt-1">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {profile.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {profile.followers} followers
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-4 h-4" /> {profile.public_repos} repos
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4" /> {profile.total_stars} total stars
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {profile.account_age_days} days on GitHub
            </span>
          </div>
        </div>
      </div>
      
      {/* Summary Card */}
      <div className="mt-4 p-4 bg-gray-700/50 rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-300 text-sm leading-relaxed">
          {profile.profile_summary}
        </p>
      </div>
    </div>
  );
}