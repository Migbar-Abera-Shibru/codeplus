// frontend/src/components/LanguageChart.tsx
import type { LanguageStats } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

interface LanguageChartProps {
  languages: LanguageStats[];
}

const COLORS = [
  '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe',
  '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140'
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export function LanguageChart({ languages }: LanguageChartProps) {
  if (!languages || languages.length === 0) {
    return (
      <div className="h-full glass-card p-6 flex flex-col items-center justify-center min-h-[320px]">
        <Code2 className="w-12 h-12 text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm">No language data available</p>
        <p className="text-gray-600 text-xs mt-1">Try analyzing a different profile</p>
      </div>
    );
  }

  const data = languages.slice(0, 7).map(lang => ({
    name: lang.language,
    value: lang.percentage || 0.01,
  }));

  const otherPercentage = languages.slice(7).reduce((sum, l) => sum + (l.percentage || 0), 0);
  if (otherPercentage > 0.01) {
    data.push({ name: 'Other', value: otherPercentage });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full glass-card p-6 min-h-[320px]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Language Distribution</h3>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
              labelLine={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(20, 20, 40, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                padding: '12px',
              }}
              labelStyle={{ color: '#fff', fontWeight: '600' }}
              itemStyle={{ color: '#d1d5db' }}
              formatter={(value: any, name: any) => [`${value.toFixed(1)}%`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-gray-400 text-xs">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}