// frontend/src/components/ErrorDisplay.tsx
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: any;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  const status = error?.status || error?.response?.status;
  const message = error?.message || error?.response?.data?.detail || 'An error occurred';

  return (
    <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-400 font-semibold">
            {status === 404 ? 'User Not Found' :
             status === 429 ? 'Rate Limit Exceeded' :
             'Error'}
          </h3>
          <p className="text-gray-300 text-sm">{message}</p>
          {status === 429 && (
            <p className="text-gray-400 text-xs mt-1">
              Please wait a few minutes before trying again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}