import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Clock, DollarSign, Calculator,
  FileText, CreditCard, Activity, Loader2, Sparkles
} from 'lucide-react';

interface LoadingAnimationProps {
  reportType?: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'trial-balance' | 'aged-reports' | 'accounts' | 'combined';
  message?: string;
  progress?: number;
  showTips?: boolean;
}

const tips = [
  "Double-entry bookkeeping ensures every transaction balances perfectly",
  "Regular reconciliation helps catch errors early",
  "Understanding your cash flow is key to business success",
  "The trial balance should always equal zero",
  "Aging reports help you manage customer payments effectively",
  "Assets = Liabilities + Equity - the accounting equation",
  "Revenue - Expenses = Net Income",
  "Managing your chart of accounts keeps your books organized"
];

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  reportType = 'combined',
  message,
  progress,
  showTips = true
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (showTips) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showTips]);

  useEffect(() => {
    if (progress !== undefined) {
      const timer = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const getReportIcon = () => {
    switch (reportType) {
      case 'profit-loss':
        return <TrendingUp className="w-16 h-16" />;
      case 'balance-sheet':
        return <BarChart3 className="w-16 h-16" />;
      case 'cash-flow':
        return <DollarSign className="w-16 h-16" />;
      case 'trial-balance':
        return <Calculator className="w-16 h-16" />;
      case 'aged-reports':
        return <Clock className="w-16 h-16" />;
      case 'accounts':
        return <FileText className="w-16 h-16" />;
      case 'combined':
        return <Activity className="w-16 h-16" />;
      default:
        return <Loader2 className="w-16 h-16" />;
    }
  };

  const getGradient = () => {
    switch (reportType) {
      case 'profit-loss':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'balance-sheet':
        return 'from-green-500 via-emerald-500 to-teal-500';
      case 'cash-flow':
        return 'from-orange-500 via-amber-500 to-yellow-500';
      case 'trial-balance':
        return 'from-pink-500 via-rose-500 to-red-500';
      case 'aged-reports':
        return 'from-cyan-500 via-blue-500 to-indigo-500';
      case 'accounts':
        return 'from-violet-500 via-purple-500 to-fuchsia-500';
      case 'combined':
        return 'from-blue-500 via-purple-500 to-pink-500';
      default:
        return 'from-gray-500 via-gray-600 to-gray-700';
    }
  };

  const getMessage = () => {
    if (message) return message;

    switch (reportType) {
      case 'profit-loss':
        return 'Calculating revenue and expenses...';
      case 'balance-sheet':
        return 'Analyzing assets and liabilities...';
      case 'cash-flow':
        return 'Tracking cash movements...';
      case 'trial-balance':
        return 'Balancing the books...';
      case 'aged-reports':
        return 'Analyzing aging data...';
      case 'accounts':
        return 'Loading chart of accounts...';
      case 'combined':
        return 'Preparing financial reports...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className="relative min-h-[400px] flex items-center justify-center py-12">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-5 animate-gradient`}></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Icon Container with Glassmorphism */}
        <div className="relative mb-8 inline-block">
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} rounded-full blur-2xl opacity-30 animate-pulse`}></div>

          {/* Glass Card */}
          <div className="relative bg-white/40 backdrop-blur-xl rounded-full p-8 shadow-2xl border border-white/50">
            <div className={`text-transparent bg-clip-text bg-gradient-to-br ${getGradient()} animate-pulse-slow`}>
              {getReportIcon()}
            </div>

            {/* Spinning Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin-slow"></div>

            {/* Inner Sparkle */}
            <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Loading Message */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-fade-in">
          {getMessage()}
        </h3>

        {/* Animated Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="mb-6">
            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getGradient()} rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${displayProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-semibold">{displayProgress}% Complete</p>
          </div>
        )}

        {/* Tips Section */}
        {showTips && (
          <div className="relative bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div className="relative">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Did you know?</p>
              <p className="text-sm text-gray-700 min-h-[2.5rem] transition-all duration-500 animate-fade-in" key={currentTip}>
                {tips[currentTip]}
              </p>
            </div>
          </div>
        )}

        {/* Combined Report Specific */}
        {reportType === 'combined' && (
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md mx-auto">
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-pulse" />
              <p className="text-xs font-semibold text-gray-700">Profit & Loss</p>
            </div>
            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600 animate-pulse" />
              <p className="text-xs font-semibold text-gray-700">Aging Reports</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(10px) translateY(10px); }
          50% { transform: translateX(-10px) translateY(10px); }
          75% { transform: translateX(10px) translateY(-10px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-gradient {
          animation: gradient 10s ease infinite;
        }

        .animate-float {
          animation: float ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;
