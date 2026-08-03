// frontend/src/services/api.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('codepulse_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// INTERFACES / TYPES - All exported
// ============================================

export interface LanguageStats {
  language: string;
  percentage: number;
  bytes_of_code: number;
  repo_count: number;
}

export interface RepositoryComplexity {
  name: string;
  score: number;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  complexity_tier: string;
}

export interface ActivityStats {
  total_commits_90d: number;
  active_days_90d: number;
  commit_days_90d: string[];
  longest_streak_days: number;
  current_streak_days: number;
}

export interface DeveloperReport {
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  account_age_days: number;
  top_languages: LanguageStats[];
  language_diversity_score: number;
  activity: ActivityStats;
  contribution_consistency: number;
  total_stars: number;
  avg_complexity_score: number;
  repo_complexity_breakdown: RepositoryComplexity[];
  total_collaborators: number;
  collaboration_score: number;
  top_collaborators: Record<string, any>[];
  scores: {
    consistency_score: number;
    complexity_score: number;
    collaboration_score: number;
    overall_score: number;
  };
  developer_type: string;
  profile_summary: string;
  generated_at: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export async function analyzeProfile(username: string, forceRefresh = false): Promise<DeveloperReport> {
  const response = await apiClient.get(`/analyze/${encodeURIComponent(username)}`, {
    params: { force_refresh: forceRefresh }
  });
  return response.data;
}

export async function generateShareLink(username: string): Promise<{ share_token: string; share_url: string }> {
  const response = await apiClient.post(`/share/${encodeURIComponent(username)}/generate`);
  return response.data;
}

export async function getSharedReport(token: string): Promise<DeveloperReport> {
  const response = await apiClient.get(`/share/${token}`);
  return response.data;
}

export async function githubLogin(): Promise<void> {
  window.location.href = `${API_BASE}/auth/github/login`;
}

export async function handleAuthCallback(token: string): Promise<void> {
  localStorage.setItem('codepulse_token', token);
}