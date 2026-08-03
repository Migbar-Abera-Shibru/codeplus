// frontend/src/components/LanguageChart.tsx
import type { LanguageStats } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface LanguageChartProps {
  languages: LanguageStats[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

export function LanguageChart({ languages }: LanguageChartProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center text-gray-400">
        No language data available
      </div>
    );
  }

  const data = languages.slice(0, 7).map(lang => ({
    name: lang.language,
    value: lang.percentage,
    repoCount: lang.repo_count,
  }));

  const otherPercentage = languages.slice(7).reduce((sum, l) => sum + l.percentage, 0);
  if (otherPercentage > 0) {
    data.push({ name: 'Other', value: otherPercentage, repoCount: 0 });
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Language Distribution</h3>
      <div className="h-64">
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
              labelLine={{ stroke: '#666' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
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