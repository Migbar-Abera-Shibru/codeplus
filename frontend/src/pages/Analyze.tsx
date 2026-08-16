import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ArrowRight, BarChart3, Code2, GitBranch, Github, Network, Search, Sparkles, Users, Zap } from 'lucide-react';
import { analyzeProfile } from '../services/api';
import { SearchBar } from '../components/SearchBar';
import { DeveloperDashboard } from '../components/DeveloperDashboard';
import { ErrorDisplay } from '../components/ErrorDisplay';

const examples = ['torvalds', 'gaearon', 'addyosmani'];

function ReportPreview() {
  return (
    <div className="preview-shell" aria-label="Sample CodePulse report preview">
      <div className="preview-topline"><span className="eyebrow-dot" /> SAMPLE REPORT <span className="preview-live">LIVE SIGNAL</span></div>
      <div className="preview-profile">
        <div className="preview-avatar">G</div>
        <div><p className="preview-name">@gaearon <span className="verified">✓</span></p><p className="preview-role">React &amp; open-source systems</p><p className="preview-meta">San Francisco · 12 languages · 178 repos</p></div>
        <div className="preview-score"><strong>87</strong><span>INTELLIGENCE<br />SCORE</span></div>
      </div>
      <div className="preview-kpis">{[['REPOSITORIES','178'],['FOLLOWERS','93.4k'],['CONTRIBUTIONS','5,482'],['STARS','12.7k']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <div className="preview-panels">
        <div className="mini-panel"><div className="mini-heading"><span>LANGUAGE EVOLUTION</span><small>LAST 2 YEARS</small></div><div className="mini-chart"><i /><i /><i /><i /><i /><i /></div><div className="chart-legend"><span>TypeScript</span><span>JavaScript</span><span>Other</span></div></div>
        <div className="mini-panel pulse-panel"><div className="mini-heading"><span>CONTRIBUTION PULSE</span><small>LAST 90 DAYS</small></div><div className="heatmap">{Array.from({ length: 56 }, (_, index) => <b key={index} className={`heat-${index % 5}`} />)}</div><div className="pulse-number"><strong>362</strong><span>commits tracked</span></div></div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Search, number: '01', title: 'Enter a username', copy: 'Give CodePulse a public GitHub profile to analyze.' },
    { icon: Activity, number: '02', title: 'We analyze the signal', copy: 'We process repositories, commits, languages, and collaboration patterns.' },
    { icon: Network, number: '03', title: 'Discover your insights', copy: 'Get a clear developer intelligence report built from your real activity.' },
  ];
  return <section className="how-section"><div className="section-kicker">HOW IT WORKS</div><h2>From username to <span>developer intelligence.</span></h2><div className="steps-grid">{steps.map(({ icon: Icon, number, title, copy }) => <article className="step-card" key={number}><div className="step-icon"><Icon /></div><div><span className="step-number">{number}</span><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>;
}

export function AnalyzePage() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState('');
  const { data, isLoading, error } = useQuery({ queryKey: ['profile', searchedUser], queryFn: () => analyzeProfile(searchedUser), enabled: Boolean(searchedUser), staleTime: 300000, retry: 1 });
  useEffect(() => { if (data) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [data]);

  return <main className="site-shell">
    <div className="atmosphere atmosphere-one" /><div className="atmosphere atmosphere-two" /><div className="grid-texture" />
    <header className="site-nav"><a className="brand" href="/"><span className="brand-mark"><Activity /></span><span>Code<span>Pulse</span></span></a><nav><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#insights">Insights</a><a href="#about">About</a></nav><a className="nav-cta" href="#analyze">Analyze Profile <ArrowRight /></a></header>
    <section className="hero" id="analyze"><div className="hero-copy"><div className="eyebrow"><Sparkles /> DEVELOPER INTELLIGENCE</div><h1>Your GitHub profile<br />has a story.<br /><span>We turn it into data.</span></h1><p className="hero-lede">Analyze any public GitHub profile and discover the patterns behind their code — from language evolution and consistency to project complexity and collaboration.</p><SearchBar value={username} onChange={setUsername} onSearch={() => setSearchedUser(username.trim())} isLoading={isLoading} /><p className="search-note">Public GitHub profiles only <b>•</b> No login required</p><div className="examples"><span>Try these examples</span>{examples.map(example => <button type="button" key={example} onClick={() => { setUsername(example); setSearchedUser(example); }}>{example}</button>)}<button type="button" onClick={() => document.querySelector<HTMLInputElement>('input')?.focus()}>your username</button></div></div><div className="hero-visual"><ReportPreview /></div></section>
    <section className="trust-strip" id="features">{[[Github,'Powered by GitHub API'],[Zap,'Real-time analysis'],[Users,'Public profiles'],[GitBranch,'Shareable reports'],[Code2,'Open source']].map(([Icon, label]) => <div key={label as string}><Icon /><span>{label as string}</span></div>)}</section>
    <AnimatePresence>{error && <motion.div className="error-wrap" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}><ErrorDisplay error={error} /></motion.div>}</AnimatePresence>
    {isLoading && <section className="analysis-state"><div className="spinner-orbit"><Activity /></div><div><div className="section-kicker">ANALYZING GITHUB PROFILE</div><h2>@{searchedUser}</h2><p>Reading the signal across repositories, languages, and contribution patterns.</p></div></section>}
    {data && <section className="report-wrap"><DeveloperDashboard data={data} /></section>}
    {!data && !isLoading && <HowItWorks />}
    <section className="insight-band" id="insights"><div><div className="section-kicker">THE SIGNAL BEHIND THE CODE</div><h2>GitHub gives you activity.<br /><span>CodePulse gives you context.</span></h2></div><div className="insight-list"><div><BarChart3 /><strong>Language evolution</strong><small>See how your technical vocabulary changes over time.</small></div><div><Network /><strong>Collaboration signal</strong><small>Understand how you build with the people around you.</small></div></div></section>
    <footer id="about"><span className="brand"><span className="brand-mark"><Activity /></span>Code<span>Pulse</span></span><span>Developer intelligence for the open web.</span></footer>
  </main>;
}

export default AnalyzePage;
