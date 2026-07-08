// frontend/src/pages/Analyze.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyzeProfile } from '../services/api'
import { SearchBar } from '../components/SearchBar'
import { ProfileCard } from '../components/ProfileCard'
import { LanguageChart } from '../components/LanguageChart'
import { ActivityHeatmap } from '../components/ActivityHeatmap'
import { ScoreCards } from '../components/ScoreCards'

export function AnalyzePage() {
  const [username, setUsername] = useState<string>('')
  const [searchedUser, setSearchedUser] = useState<string>('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', searchedUser],
    queryFn: () => analyzeProfile(searchedUser),
    enabled: !!searchedUser,
    staleTime: 1000 * 60 * 30,  // 30 minutes — don't re-fetch constantly
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or 429
      if (error?.status === 404 || error?.status === 429) return false
      return failureCount < 2
    }
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">
          CodePulse
        </h1>
        <p className="text-gray-400 text-center mb-8">
          GitHub Activity Analyzer & Developer Insights
        </p>

        <SearchBar
          value={username}
          onChange={setUsername}
          onSearch={() => setSearchedUser(username)}
          isLoading={isLoading}
        />

        {error && <ErrorDisplay error={error} />}

        {data && (
          <div className="mt-8 space-y-6">
            <ProfileCard profile={data} />
            <ScoreCards
              consistency={data.consistency_score}
              complexity={data.complexity_score}
              collaboration={data.collaboration_score}
              overall={data.overall_score}
            />
            <LanguageChart languages={data.top_languages} />
            <ActivityHeatmap commitDays={data.commit_days_90d} />
          </div>
        )}
      </div>
    </div>
  )
}