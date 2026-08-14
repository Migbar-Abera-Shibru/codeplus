// frontend/src/components/ErrorDisplay.tsx
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ErrorDisplayProps {
  error: any;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const status = error?.status || error?.response?.status;
  const message = error?.message || error?.response?.data?.detail || 'An error occurred';

  const getErrorType = () => {
    if (status === 404) return { icon: AlertCircle, title: 'User Not Found', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    if (status === 429) return { icon: AlertTriangle, title: 'Rate Limit Exceeded', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' };
    if (status === 504) return { icon: Info, title: 'Request Timeout', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
    return { icon: AlertCircle, title: 'Error', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const { icon: Icon, title, color } = getErrorType();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${color} backdrop-blur-sm`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${color.split(' ')[0]} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className={`font-semibold ${color.split(' ')[0]}`}>{title}</h3>
          <p className="text-gray-300 text-sm mt-0.5">{message}</p>
          {status === 429 && (
            <p className="text-gray-500 text-xs mt-1">
              Please wait a few minutes before trying again.
            </p>
          )}
          {status === 404 && (
            <p className="text-gray-500 text-xs mt-1">
              Double-check the username and try again.
            </p>
          )}
          {status === 504 && (
            <p className="text-gray-500 text-xs mt-1">
              The request took too long. Please try again.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}