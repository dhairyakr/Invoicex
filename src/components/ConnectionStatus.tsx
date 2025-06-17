import React from 'react';
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink, Database } from 'lucide-react';

interface ConnectionStatusProps {
  status?: 'checking' | 'connected' | 'error';
  error?: string | null;
  onRetry?: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status = 'connected', error, onRetry }) => {
  // Don't show anything when connected
  if (status === 'connected') {
    return null;
  }

  if (status === 'checking') {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 mx-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <RefreshCw className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
          <div>
            <h4 className="font-medium text-blue-800">Connecting to Supabase...</h4>
            <p className="text-sm text-blue-600">Please wait while we establish connection.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 mx-4 rounded-lg shadow-sm">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 mb-1">
            Supabase Connection Error
          </h4>
          <p className="text-sm text-red-700 mb-3">
            {error || 'Unable to connect to Supabase database.'}
          </p>
          
          <div className="bg-red-100 rounded-lg p-3 mb-4">
            <h5 className="font-medium text-red-800 mb-2">Quick Fix Steps:</h5>
            <ol className="text-sm text-red-700 space-y-1 list-decimal list-inside">
              <li>Check your <code className="bg-red-200 px-1 rounded">.env</code> file exists in the project root</li>
              <li>Verify your Supabase URL and API key are correct</li>
              <li>Ensure your Supabase project is active and accessible</li>
              <li>Restart your development server: <code className="bg-red-200 px-1 rounded">npm run dev</code></li>
            </ol>
          </div>

          <div className="flex flex-wrap gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </button>
            )}
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white text-red-600 text-sm border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <Database className="w-4 h-4 mr-2" />
              Open Supabase Dashboard
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;