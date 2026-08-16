import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Code2 } from 'lucide-react';
import type { LanguageStats } from '../services/api';
const COLORS = ['#3262dd', '#f4b82e', '#f05b2f', '#8a64d8', '#3ca7a9', '#697382'];
export function LanguageChart({ languages }: { languages: LanguageStats[] }) {
  const data = languages.slice(0, 6).map((item) => ({ name: item.language, value: item.percentage }));
  if (!data.length) return <section className="report-card empty-card"><Code2 /><p>No language data available</p></section>;
  return <section className="report-card language-panel"><div className="panel-heading"><div><p className="report-kicker">CODE DNA</p><h2>Language Distribution</h2></div></div><div className="language-content"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" innerRadius="56%" outerRadius="82%" paddingAngle={1}><>{data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</></Pie><Tooltip contentStyle={{ background: '#0b1020', border: '1px solid #263158', borderRadius: 8 }} formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Share']} /></PieChart></ResponsiveContainer><span>Top<br />Languages</span></div><ul className="language-list">{data.map((item, index) => <li key={item.name}><i style={{ background: COLORS[index % COLORS.length] }} /> <span>{item.name}</span><b>{item.value.toFixed(1)}%</b></li>)}</ul></div></section>;
}
