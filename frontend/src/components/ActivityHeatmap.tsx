// frontend/src/components/ActivityHeatmap.tsx
interface ActivityHeatmapProps {
  commitDays: string[];
}

export function ActivityHeatmap({ commitDays }: ActivityHeatmapProps) {
  if (!commitDays || commitDays.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center text-gray-400">
        No activity data available
      </div>
    );
  }

  // Convert to a Set for O(1) lookup
  const commitDaySet = new Set(commitDays);

  // Generate last 90 days
  const days: { date: string; count: number }[] = [];
  const today = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = commitDaySet.has(dateStr) ? 1 : 0;
    days.push({ date: dateStr, count });
  }

  // Group by weeks for grid layout
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-700';
    return 'bg-green-500';
  };

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Mon', 'Wed', 'Fri'];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-2">Activity Heatmap (Last 90 Days)</h3>
      <p className="text-gray-400 text-sm mb-4">
        {commitDaySet.size} active days · Longest streak: {calculateLongestStreak(commitDays)} days
      </p>
      
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="flex">
            {/* Day labels */}
            <div className="w-8 flex flex-col text-xs text-gray-500 pr-2" style={{ paddingTop: '20px' }}>
              {dayLabels.map(label => (
                <div key={label} style={{ height: '16px', lineHeight: '16px' }}>{label}</div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="flex-1">
              {/* Month labels */}
              <div className="flex text-xs text-gray-500" style={{ height: '20px' }}>
                {weeks.map((week, idx) => {
                  if (idx % 4 === 0 && week[0]) {
                    const month = new Date(week[0].date).getMonth();
                    return <div key={idx} className="flex-1">{monthLabels[month]}</div>;
                  }
                  return <div key={idx} className="flex-1" />;
                })}
              </div>
              
              {/* Grid */}
              <div className="flex gap-0.5">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex-1 flex flex-col gap-0.5">
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`w-full aspect-square rounded-sm ${getColor(day.count)}`}
                        title={`${day.date}: ${day.count} commit${day.count !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-sm bg-gray-700" />
          <div className="w-3 h-3 rounded-sm bg-green-500/40" />
          <div className="w-3 h-3 rounded-sm bg-green-500/70" />
          <div className="w-3 h-3 rounded-sm bg-green-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function calculateLongestStreak(days: string[]): number {
  if (days.length === 0) return 0;
  
  const sorted = [...days].sort();
  let longest = 1;
  let current = 1;
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  
  return longest;
}