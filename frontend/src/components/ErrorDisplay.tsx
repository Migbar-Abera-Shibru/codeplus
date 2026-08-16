import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';

interface ErrorDisplayProps { error: any; }
export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const status = error?.status || error?.response?.status;
  const isMissing = status === 404;
  const isLimited = status === 429;
  const Icon = isMissing ? AlertCircle : isLimited ? AlertTriangle : status === 504 ? Clock : AlertCircle;
  const title = isMissing ? 'We could not find that profile.' : isLimited ? 'GitHub is rate limiting requests.' : 'We could not analyze this profile.';
  const detail = isMissing ? 'Check the username and try again.' : isLimited ? 'Wait a moment before running another analysis.' : 'The signal was interrupted. Please try again.';
  return <motion.div className="error-card" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><div className="error-icon"><Icon /></div><div><div className="section-kicker">ANALYSIS INTERRUPTED</div><h3>{title}</h3><p>{detail}</p></div></motion.div>;
}
