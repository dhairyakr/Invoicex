import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import ProfitLoss from './reports/ProfitLoss';
import EnhancedBalanceSheet from './reports/EnhancedBalanceSheet';
import EnhancedCashFlow from './reports/EnhancedCashFlow';
import TrialBalanceLedger from './reports/TrialBalanceLedger';
import AgedReceivablesPayables from './reports/AgedReceivablesPayables';
import JournalEntryModal from './reports/JournalEntryModal';
import QuickTransactionEntry from './reports/QuickTransactionEntry';
import AccountManagement from './reports/AccountManagement';
import { useAuth } from '../context/AuthContext';
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
        return <TrialBalanceLedger {...reportProps} />;
      case 'aged-reports':
        return <AgedReceivablesPayables {...reportProps} />;
      case 'accounts':
        return <AccountManagement key={refreshKey} />;
      default:
        return <ProfitLoss {...reportProps} />;
    }
  };

  const activeReportInfo = reportTabs.find(tab => tab.id === activeReport);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Header Section - Aero Glass */}
      <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-xl">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
        <div className="absolute top-0 right-0 w-96 h-32 bg-gradient-to-l from-blue-500/15 to-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-32 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
        
        {/* Glossy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mr-6 border border-white/30">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Financial Reports</h1>
                <p className="text-xl text-gray-700 font-medium">Real-time business intelligence and accounting insights</p>
              </div>
            </div>

            {/* Top Bar Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Range Presets */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none"></div>
                <select
                  onChange={(e) => handleDatePreset(e.target.value)}
                  className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <option value="">Quick Date Range</option>
                  {datePresets.map(preset => (
                    <option key={preset.value} value={preset.value}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Date Range */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none"></div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 shadow-lg"
                  />
                </div>
                <span className="text-gray-600 font-medium">to</span>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none"></div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 shadow-lg"
                  />
                </div>
              </div>

              {/* View Period Toggle */}
              <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                {(['monthly', 'quarterly', 'yearly'] as ViewPeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setViewPeriod(period)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      viewPeriod === period
                        ? 'bg-blue-500/80 backdrop-blur-sm text-white shadow-lg'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
                    <span className="relative z-10 capitalize">{period}</span>
                  </button>
                ))}
              </div>

              {/* Add Entry Button */}
              <button
                onClick={() => setShowQuickTransaction(true)}
                className="relative group overflow-hidden bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-pink-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <Plus size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">Quick Entry</span>
              </button>

              {/* Journal Entry Button */}
              <button
                onClick={() => setShowJournalEntry(true)}
                className="relative group overflow-hidden bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <FileText size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">Journal Entry</span>
              </button>

              {/* Export Button */}
              <button className="relative group overflow-hidden bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-md text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-emerald-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <Download size={18} className="mr-2 relative z-10" />
                <span className="relative z-10">Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)] overflow-hidden">
        {/* Sidebar Navigation - Aero Glass */}
        <div className="w-80 bg-white/25 backdrop-blur-xl border-r border-white/40 shadow-xl overflow-y-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>

          <div className="relative z-10 p-6 min-h-full">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Financial Reports</h2>
              <p className="text-gray-600">Select a report to view detailed insights</p>
            </div>

            <div className="space-y-3">
              {reportTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReport(tab.id)}
                  className={`group relative w-full text-left p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl border ${
                    activeReport === tab.id
                      ? `bg-gradient-to-r ${tab.bgColor} border-blue-300/50 shadow-lg ring-2 ring-blue-200/50`
                      : 'bg-white/30 backdrop-blur-sm border-white/50 hover:bg-white/40 hover:border-white/60 shadow-lg'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  
                  <div className="relative z-10 flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg transition-all duration-300 group-hover:scale-110 ${
                      activeReport === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white`
                        : 'bg-white/50 backdrop-blur-sm text-gray-600 group-hover:text-gray-800'
                    }`}>
                      {tab.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-bold text-lg transition-colors ${
                          activeReport === tab.id ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                        }`}>
                          {tab.name}
                        </h3>
                        {tab.popular && (
                          <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                            Popular
                          </span>
                        )}
                        <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                          activeReport === tab.id 
                            ? 'text-blue-600 transform rotate-90' 
                            : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
                        }`} />
                      </div>
                      <p className={`text-sm transition-colors ${
                        activeReport === tab.id ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Stats Card */}
            <div className="mt-8 relative bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Quick Overview</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Period:</span>
                    <span className="font-semibold text-gray-900 capitalize">{viewPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date Range:</span>
                    <span className="font-semibold text-gray-900 text-xs">
                      {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Report:</span>
                    <span className="font-semibold text-blue-600">{activeReportInfo?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Report Header */}
          <div className="relative bg-white/20 backdrop-blur-md border-b border-white/30 p-6 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg bg-gradient-to-r ${activeReportInfo?.color} text-white`}>
                  {activeReportInfo?.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{activeReportInfo?.name}</h2>
                  <p className="text-gray-600 text-lg">{activeReportInfo?.description}</p>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="flex items-center gap-4">
                {/* Department Filter */}
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 shadow-lg"
                  >
                    <option value="">All Departments</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="admin">Administration</option>
                  </select>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white/40 to-blue-50/40 p-6">
            <div className="relative">
              {renderActiveReport()}
            </div>
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