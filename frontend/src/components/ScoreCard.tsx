// frontend/src/components/ScoreCards.tsx
interface ScoreCardsProps {
  consistency: number;
  complexity: number;
  collaboration: number;
  overall: number;
}

export function ScoreCards({ consistency, complexity, collaboration, overall }: ScoreCardsProps) {
  const scores = [
    { label: 'Consistency', value: consistency, color: 'text-green-400' },
    { label: 'Complexity', value: complexity, color: 'text-blue-400' },
    { label: 'Collaboration', value: collaboration, color: 'text-purple-400' },
    { label: 'Overall', value: overall, color: 'text-yellow-400', highlight: true },
  ];

  const getScoreColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {scores.map(({ label, value, color, highlight }) => (
        <div
          key={label}
          className={`bg-gray-800 rounded-xl p-4 text-center border ${highlight ? 'border-yellow-500/50' : 'border-gray-700'}`}
        >
          <div className={`text-3xl font-bold ${color}`}>{value}</div>
          <div className="text-gray-400 text-sm">{label}</div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${getScoreColor(value)} transition-all duration-500`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}