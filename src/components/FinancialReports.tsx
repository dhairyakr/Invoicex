import React, { useState, lazy, Suspense } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Filter,
  Download,
  Eye,
  ChevronRight,
  Activity,
  PieChart,
  LineChart,
  Calculator,
  CreditCard,
  Building,
  Wallet,
  Target,
  Zap,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  Plus,
  Loader
} from 'lucide-react';
import JournalEntryModal from './reports/JournalEntryModal';
import QuickTransactionEntry from './reports/QuickTransactionEntry';
import { useAuth } from '../context/AuthContext';

const ProfitLoss = lazy(() => import('./reports/ProfitLoss'));
const EnhancedBalanceSheet = lazy(() => import('./reports/EnhancedBalanceSheet'));
const EnhancedCashFlow = lazy(() => import('./reports/EnhancedCashFlow'));
const EnhancedTrialBalanceLedger = lazy(() => import('./reports/EnhancedTrialBalanceLedger'));
const EnhancedAgedReceivablesPayables = lazy(() => import('./reports/EnhancedAgedReceivablesPayables'));
const EnhancedAccountManagement = lazy(() => import('./reports/EnhancedAccountManagement'));
import { ensureAccountsExist } from '../lib/supabase';

type ReportType = 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'trial-balance' | 'aged-reports' | 'accounts';
type ViewPeriod = 'monthly' | 'quarterly' | 'yearly';

const FinancialReports: React.FC = () => {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<ReportType>('profit-loss');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('monthly');
  const [department, setDepartment] = useState('');
  const [showJournalEntry, setShowJournalEntry] = useState(false);
  const [showQuickTransaction, setShowQuickTransaction] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  React.useEffect(() => {
    if (user) {
      ensureAccountsExist(user.id);
    }
  }, [user]);

  const reportTabs = [
    {
      id: 'profit-loss' as ReportType,
      name: 'Profit & Loss',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Revenue, expenses, and net profit analysis',
      color: 'from-emerald-500 to-green-500',
      bgColor: 'from-emerald-50 to-green-50',
      popular: true
    },
    {
      id: 'balance-sheet' as ReportType,
      name: 'Balance Sheet',
      icon: <Building className="w-5 h-5" />,
      description: 'Assets, liabilities, and equity overview',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'from-blue-50 to-indigo-50'
    },
    {
      id: 'cash-flow' as ReportType,
      name: 'Cash Flow',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Operating, investing, and financing activities',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'from-purple-50 to-violet-50'
    },
    {
      id: 'trial-balance' as ReportType,
      name: 'Trial Balance & Ledger',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Account balances and general ledger',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      id: 'aged-reports' as ReportType,
      name: 'Aged Receivables & Payables',
      icon: <Clock className="w-5 h-5" />,
      description: 'Outstanding invoices and bills by age',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50'
    },
    {
      id: 'accounts' as ReportType,
      name: 'Chart of Accounts',
      icon: <FileText className="w-5 h-5" />,
      description: 'Manage your account structure',
      color: 'from-gray-500 to-slate-500',
      bgColor: 'from-gray-50 to-slate-50'
    }
  ];

  const datePresets = [
    { label: 'This Month', value: 'this-month' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'This Quarter', value: 'this-quarter' },
    { label: 'Last Quarter', value: 'last-quarter' },
    { label: 'This Year', value: 'this-year' },
    { label: 'Last Year', value: 'last-year' }
  ];

  const handleDatePreset = (preset: string) => {
    const now = new Date();
    let start: Date, end: Date;

    switch (preset) {
      case 'this-month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'last-month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'this-quarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        start = new Date(now.getFullYear(), quarterStart, 1);
        end = new Date(now.getFullYear(), quarterStart + 3, 0);
        break;
      case 'last-quarter':
        const lastQuarterStart = Math.floor(now.getMonth() / 3) * 3 - 3;
        start = new Date(now.getFullYear(), lastQuarterStart, 1);
        end = new Date(now.getFullYear(), lastQuarterStart + 3, 0);
        break;
      case 'this-year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case 'last-year':
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderActiveReport = () => {
    const reportProps = {
      dateRange,
      viewPeriod,
      department,
      onRefresh: handleRefresh
    };

    switch (activeReport) {
      case 'profit-loss':
        return <ProfitLoss {...reportProps} />;
      case 'balance-sheet':
        return <EnhancedBalanceSheet {...reportProps} />;
      case 'cash-flow':
        return <EnhancedCashFlow {...reportProps} />;
      case 'trial-balance':
        return <EnhancedTrialBalanceLedger {...reportProps} />;
      case 'aged-reports':
        return <EnhancedAgedReceivablesPayables {...reportProps} />;
      case 'accounts':
        return <EnhancedAccountManagement key={refreshKey} />;
      default:
        return <ProfitLoss {...reportProps} />;
    }
  };

  const activeReportInfo = reportTabs.find(tab => tab.id === activeReport);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Clean Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md mr-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
                <p className="text-sm text-gray-500">Real-time business intelligence</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                onChange={(e) => handleDatePreset(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Quick Range</option>
                {datePresets.map(preset => (
                  <option key={preset.value} value={preset.value}>{preset.label}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(['monthly', 'quarterly', 'yearly'] as ViewPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setViewPeriod(period)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      viewPeriod === period
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => setShowQuickTransaction(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Plus size={16} />
                  <span>Quick Entry</span>
                </button>

                <button
                  onClick={() => setShowJournalEntry(true)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                >
                  <FileText size={16} />
                  <span>Journal</span>
                </button>

                <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-200">
                  <Download size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Clean Sidebar Navigation */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Reports</p>

            <nav className="space-y-1">
              {reportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                    activeReport === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 -ml-px'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeReport === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{tab.name}</span>
                      {tab.popular && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{tab.description}</p>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="px-3 py-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Current View</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Period:</span>
                    <span className="font-medium text-gray-700 capitalize">{viewPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">From:</span>
                    <span className="font-medium text-gray-700">{new Date(dateRange.start).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">To:</span>
                    <span className="font-medium text-gray-700">{new Date(dateRange.end).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Compact Report Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${activeReportInfo?.color} text-white shadow-sm`}>
                  {activeReportInfo?.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{activeReportInfo?.name}</h2>
                  <p className="text-sm text-gray-500">{activeReportInfo?.description}</p>
                </div>
              </div>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Departments</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="admin">Administration</option>
              </select>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading report...</p>
                </div>
              </div>
            }>
              {renderActiveReport()}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={showJournalEntry}
        onClose={() => setShowJournalEntry(false)}
        onSuccess={() => {
          handleRefresh();
        }}
      />

      {/* Quick Transaction Entry Modal */}
      <QuickTransactionEntry
        isOpen={showQuickTransaction}
        onClose={() => setShowQuickTransaction(false)}
        onSuccess={() => {
          handleRefresh();
        }}
      />
    </div>
  );
};

export default FinancialReports;