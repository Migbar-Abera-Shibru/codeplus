// frontend/src/components/LanguageChart.tsx
import type { LanguageStats } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LanguageChartProps {
  languages: LanguageStats[];
}

const COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#06B6D4', '#6366F1', '#EF4444', '#14B8A6', '#F472B6'
];

export function LanguageChart({ languages }: LanguageChartProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="h-full bg-[#1a1a2e] rounded-xl p-6 border border-white/10 flex items-center justify-center">
        <p className="text-gray-500">No language data available</p>
      </div>
    );
  }

  const data = languages.slice(0, 7).map(lang => ({
    name: lang.language,
    value: lang.percentage || 0.01, // Ensure minimum value for display
    repoCount: lang.repo_count,
  }));

  const otherPercentage = languages.slice(7).reduce((sum, l) => sum + (l.percentage || 0), 0);
  if (otherPercentage > 0.01) {
    data.push({ name: 'Other', value: otherPercentage, repoCount: 0 });
  }

  return (
    <div className="h-full bg-[#1a1a2e] rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name} ${value.toFixed(1)}%`}
              labelLine={{ stroke: '#374151', strokeWidth: 1 }}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#d1d5db' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}