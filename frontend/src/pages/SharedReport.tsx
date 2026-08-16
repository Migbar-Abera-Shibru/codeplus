import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowLeft, Loader2 } from 'lucide-react';
import { getSharedReport } from '../services/api';
import { DeveloperDashboard } from '../components/DeveloperDashboard';
import { ErrorDisplay } from '../components/ErrorDisplay';

export function SharedReportPage() {
  const { shareToken } = useParams<{ shareToken: string }>();
  const { data, isLoading, error } = useQuery({ queryKey: ['sharedReport', shareToken], queryFn: () => getSharedReport(shareToken!), enabled: Boolean(shareToken) });
  if (isLoading) return <main className="site-shell"><div className="analysis-state"><div className="spinner-orbit"><Loader2 /></div><div><div className="section-kicker">LOADING SHARED REPORT</div><h2>Decrypting the signal</h2><p>Preparing the developer intelligence report.</p></div></div></main>;
  if (error) return <main className="site-shell"><div className="error-wrap"><ErrorDisplay error={error} /></div></main>;
  if (!data) return null;
  return <main className="site-shell"><div className="grid-texture" /><header className="site-nav"><Link className="brand" to="/"><span className="brand-mark"><Activity /></span><span>Code<span>Pulse</span></span></Link><Link className="nav-cta" to="/"><ArrowLeft /> Analyze a profile</Link></header><section className="report-wrap"><div className="section-kicker">SHARED DEVELOPER INTELLIGENCE</div><h1 style={{ fontSize: 'clamp(32px, 5vw, 54px)', letterSpacing: '-.06em', margin: '14px 0 8px' }}>The signal behind <span style={{ color: '#a776ed' }}>@{data.username}</span></h1><p style={{ color: '#858da7', fontSize: 13, marginBottom: 28 }}>Generated {new Date(data.generated_at).toLocaleDateString()}</p><DeveloperDashboard data={data} /></section></main>;
}
