import React, { useState, useEffect } from 'react';
import {
  Building, ChevronDown, ChevronRight, TrendingUp, TrendingDown, Layers, Shield, Briefcase,
  DollarSign, Activity, BarChart3, PieChart, Download, FileSpreadsheet, FileText, Search,
  Filter, ArrowUpDown, Eye, Percent, Calendar, AlertCircle, CheckCircle, Info, Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getBalanceSheetData,
  getHistoricalBalanceSheetData,
  getComparativeBalanceSheetData
} from '../../lib/supabase';
import {
  calculateFinancialRatios,
  getCurrentRatioHealth,
  getQuickRatioHealth,
  getDebtToEquityHealth,
  getDebtToAssetsHealth,
  getWorkingCapitalHealth,
  calculateOverallHealthScore,
  getHealthScoreColor,
  getHealthScoreLabel,
  formatRatio,
  formatPercentage
} from '../../utils/financialRatios';
import AccountDetailsModal from './AccountDetailsModal';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

interface BalanceSheetProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

interface BalanceSheetItem {
  name: string;
  amount: number;
  children?: BalanceSheetItem[];
  id?: string;
  code?: string;
  type?: string;
}

const EnhancedBalanceSheet: React.FC<BalanceSheetProps> = ({ dateRange, viewPeriod, department }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [comparativeData, setComparativeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['assets', 'current-assets', 'liabilities', 'current-liabilities', 'equity']);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showVerticalAnalysis, setShowVerticalAnalysis] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'table' | 'charts' | 'ratios'>('table');

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      const [currentResult, historicalResult, previousDateStr] = await Promise.all([
        getBalanceSheetData(user.id, dateRange.end),
        getHistoricalBalanceSheetData(user.id, 6),
        getPreviousPeriodDate(dateRange.end, viewPeriod)
      ]);

      if (currentResult.error) {
        setError(currentResult.error);
      } else {
        setData(currentResult.data);
      }

      if (historicalResult.data) {
        setHistoricalData(historicalResult.data);
      }

      if (previousDateStr) {
        const comparativeResult = await getComparativeBalanceSheetData(user.id, dateRange.end, previousDateStr);
        if (comparativeResult.data) {
          setComparativeData(comparativeResult.data);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [user, dateRange.end, viewPeriod, department]);

  const getPreviousPeriodDate = (currentDate: string, period: 'monthly' | 'quarterly' | 'yearly'): string => {
    const date = new Date(currentDate);
    switch (period) {
      case 'monthly':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() - 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date.toISOString().split('T')[0];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateVariance = (current: number, previous: number) => {
    if (previous === 0) return { amount: current, percentage: 100 };
    const amount = current - previous;
    const percentage = (amount / previous) * 100;
    return { amount, percentage };
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const exportToCSV = () => {
    if (!data) return;

    const csvRows = [];
    csvRows.push(['Account', 'Amount', 'Type']);

    const addRows = (items: any[], prefix = '') => {
      items.forEach(item => {
        csvRows.push([`${prefix}${item.name}`, item.balance || item.amount, item.type || '']);
        if (item.children) {
          addRows(item.children, `${prefix}  `);
        }
      });
    };

    addRows(data.assets, '');
    addRows(data.liabilities, '');
    addRows(data.equity, '');

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance-sheet-${dateRange.end}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading balance sheet data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50/60 backdrop-blur-md border border-red-200/50 rounded-2xl p-8 text-center">
        <div className="text-red-600 mb-4">
          <Building size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold">Error Loading Balance Sheet</h3>
          <p className="text-sm mt-2">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const totalAssets = data.totalAssets;
  const totalLiabilitiesAndEquity = data.totalLiabilities + data.totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1;

  const currentAssets = data.assets.filter((acc: any) => acc.subtype === 'current');
  const fixedAssets = data.assets.filter((acc: any) => acc.subtype === 'fixed');
  const currentLiabilities = data.liabilities.filter((acc: any) => acc.subtype === 'current');
  const longTermLiabilities = data.liabilities.filter((acc: any) => acc.subtype === 'long-term');

  const currentAssetsTotal = currentAssets.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0);
  const fixedAssetsTotal = fixedAssets.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0);
  const currentLiabilitiesTotal = currentLiabilities.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0);
  const longTermLiabilitiesTotal = longTermLiabilities.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0);

  const cashAccount = currentAssets.find((acc: any) => acc.code === '1000');
  const cashAmount = cashAccount ? Math.abs(cashAccount.balance) : 0;

  const ratios = calculateFinancialRatios(
    totalAssets,
    currentAssetsTotal,
    fixedAssetsTotal,
    data.totalLiabilities,
    currentLiabilitiesTotal,
    longTermLiabilitiesTotal,
    data.totalEquity,
    cashAmount
  );

  const workingCapital = currentAssetsTotal - currentLiabilitiesTotal;
  const healthScore = calculateOverallHealthScore(ratios);

  const balanceSheetData = {
    assets: {
      name: 'Total Assets',
      amount: totalAssets,
      children: [
        {
          name: 'Current Assets',
          amount: currentAssetsTotal,
          children: currentAssets.map((acc: any) => ({ ...acc, name: acc.name, amount: Math.abs(acc.balance) }))
        },
        {
          name: 'Fixed Assets',
          amount: fixedAssetsTotal,
          children: fixedAssets.map((acc: any) => ({ ...acc, name: acc.name, amount: Math.abs(acc.balance) }))
        }
      ]
    },
    liabilities: {
      name: 'Total Liabilities',
      amount: data.totalLiabilities,
      children: [
        {
          name: 'Current Liabilities',
          amount: currentLiabilitiesTotal,
          children: currentLiabilities.map((acc: any) => ({ ...acc, name: acc.name, amount: Math.abs(acc.balance) }))
        },
        {
          name: 'Long-term Liabilities',
          amount: longTermLiabilitiesTotal,
          children: longTermLiabilities.map((acc: any) => ({ ...acc, name: acc.name, amount: Math.abs(acc.balance) }))
        }
      ]
    },
    equity: {
      name: 'Total Equity',
      amount: data.totalEquity,
      children: data.equity.map((acc: any) => ({ ...acc, name: acc.name, amount: Math.abs(acc.balance) }))
    }
  };

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

  const assetCompositionData = [
    { name: 'Current Assets', value: currentAssetsTotal },
    { name: 'Fixed Assets', value: fixedAssetsTotal }
  ];

  const liabilityCompositionData = [
    { name: 'Current Liabilities', value: currentLiabilitiesTotal },
    { name: 'Long-term Liabilities', value: longTermLiabilitiesTotal }
  ];

  const equityCompositionData = data.equity.map((acc: any) => ({
    name: acc.name,
    value: Math.abs(acc.balance)
  }));

  return (
    <div className="space-y-8">
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-gray-600 mt-1">As of {new Date(dateRange.end).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('table')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeView === 'table'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            <Layers className="w-4 h-4 inline mr-2" />
            Table
          </button>
          <button
            onClick={() => setActiveView('charts')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeView === 'charts'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Charts
          </button>
          <button
            onClick={() => setActiveView('ratios')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeView === 'ratios'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Ratios
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 inline mr-2" />
            CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Assets"
          value={totalAssets}
          icon={Building}
          color="blue"
          trend={historicalData.length > 1 ? calculateVariance(totalAssets, historicalData[historicalData.length - 2]?.totalAssets || 0) : null}
        />
        <KPICard
          title="Total Liabilities"
          value={data.totalLiabilities}
          icon={Shield}
          color="red"
          trend={historicalData.length > 1 ? calculateVariance(data.totalLiabilities, historicalData[historicalData.length - 2]?.totalLiabilities || 0) : null}
        />
        <KPICard
          title="Total Equity"
          value={data.totalEquity}
          icon={Briefcase}
          color="green"
          trend={historicalData.length > 1 ? calculateVariance(data.totalEquity, historicalData[historicalData.length - 2]?.totalEquity || 0) : null}
        />
        <KPICard
          title="Working Capital"
          value={workingCapital}
          icon={DollarSign}
          color="indigo"
          subtitle={`Current: ${formatCurrency(currentAssetsTotal)} - ${formatCurrency(currentLiabilitiesTotal)}`}
        />
        <KPICard
          title="Current Ratio"
          value={ratios.liquidity.currentRatio}
          icon={Activity}
          color="emerald"
          isRatio
          health={getCurrentRatioHealth(ratios.liquidity.currentRatio)}
        />
        <KPICard
          title="Health Score"
          value={healthScore}
          icon={TrendingUp}
          color={getHealthScoreColor(healthScore)}
          subtitle={getHealthScoreLabel(healthScore)}
          isScore
        />
      </div>

      {!isBalanced && (
        <div className="bg-yellow-50/60 backdrop-blur-md border border-yellow-200/50 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-800">Balance Sheet Warning</h3>
              <p className="text-sm text-yellow-700">
                Assets and Liabilities + Equity do not balance. Difference: {formatCurrency(Math.abs(totalAssets - totalLiabilitiesAndEquity))}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'table' && (
        <TableView
          balanceSheetData={balanceSheetData}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          showComparison={showComparison}
          setShowComparison={setShowComparison}
          showVerticalAnalysis={showVerticalAnalysis}
          setShowVerticalAnalysis={setShowVerticalAnalysis}
          comparativeData={comparativeData}
          totalAssets={totalAssets}
          formatCurrency={formatCurrency}
          calculateVariance={calculateVariance}
          setSelectedAccount={setSelectedAccount}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {activeView === 'charts' && (
        <ChartsView
          historicalData={historicalData}
          assetCompositionData={assetCompositionData}
          liabilityCompositionData={liabilityCompositionData}
          equityCompositionData={equityCompositionData}
          COLORS={COLORS}
          formatCurrency={formatCurrency}
        />
      )}

      {activeView === 'ratios' && (
        <RatiosView
          ratios={ratios}
          workingCapital={workingCapital}
          currentAssetsTotal={currentAssetsTotal}
          healthScore={healthScore}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: { amount: number; percentage: number } | null;
  subtitle?: string;
  isRatio?: boolean;
  isScore?: boolean;
  health?: any;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color, trend, subtitle, isRatio, isScore, health }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    yellow: 'from-yellow-500 to-orange-600',
    orange: 'from-orange-500 to-red-600'
  };

  const bgColorClasses = {
    blue: 'from-blue-500/10 to-indigo-500/10',
    red: 'from-red-500/10 to-pink-500/10',
    green: 'from-green-500/10 to-emerald-500/10',
    indigo: 'from-indigo-500/10 to-purple-500/10',
    emerald: 'from-emerald-500/10 to-teal-500/10',
    yellow: 'from-yellow-500/10 to-orange-500/10',
    orange: 'from-orange-500/10 to-red-500/10'
  };

  return (
    <div className="group relative bg-white/40 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColorClasses[color as keyof typeof bgColorClasses] || bgColorClasses.blue} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
          <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {isRatio ? formatRatio(value) : isScore ? value : formatCurrency(value)}
        </div>
        {health && (
          <div className={`text-xs font-medium text-${health.color}-600 mb-1`}>
            {health.message}
          </div>
        )}
        {subtitle && (
          <div className="text-xs text-gray-600">{subtitle}</div>
        )}
        {trend && (
          <div className={`flex items-center text-xs font-medium ${trend.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend.percentage >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend.percentage).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

interface TableViewProps {
  balanceSheetData: any;
  expandedSections: string[];
  toggleSection: (sectionId: string) => void;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  showVerticalAnalysis: boolean;
  setShowVerticalAnalysis: (show: boolean) => void;
  comparativeData: any;
  totalAssets: number;
  formatCurrency: (amount: number) => string;
  calculateVariance: (current: number, previous: number) => { amount: number; percentage: number };
  setSelectedAccount: (account: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const TableView: React.FC<TableViewProps> = ({
  balanceSheetData,
  expandedSections,
  toggleSection,
  showComparison,
  setShowComparison,
  showVerticalAnalysis,
  setShowVerticalAnalysis,
  comparativeData,
  totalAssets,
  formatCurrency,
  calculateVariance,
  setSelectedAccount,
  searchTerm,
  setSearchTerm
}) => {
  const renderBalanceSheetSection = (
    section: BalanceSheetItem,
    sectionId: string,
    level: number = 0,
    colorScheme: string
  ) => {
    const isExpanded = expandedSections.includes(sectionId);
    const hasChildren = section.children && section.children.length > 0;
    const matchesSearch = searchTerm === '' || section.name.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch && level > 0) return null;

    const previousAmount = comparativeData && getPreviousAmount(section, sectionId);
    const variance = previousAmount !== undefined ? calculateVariance(section.amount, previousAmount) : null;
    const percentOfTotal = (section.amount / totalAssets) * 100;

    return (
      <div key={sectionId}>
        <div
          className={`group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 ${
            hasChildren ? 'cursor-pointer' : ''
          } ${level === 0 ? 'bg-gradient-to-r from-gray-50/40 to-blue-50/40 font-bold border-b border-white/30' : ''}`}
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
          onClick={() => hasChildren && toggleSection(sectionId)}
        >
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button className="mr-3 p-1 rounded-lg hover:bg-white/30 transition-colors">
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-600" />
                ) : (
                  <ChevronRight size={16} className="text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6 mr-3"></div>}

            <div className="flex items-center">
              {level === 0 && (
                <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${colorScheme}`}></div>
              )}
              <span className={`${level === 0 ? 'text-lg font-bold' : level === 1 ? 'font-semibold' : ''} text-gray-900 group-hover:text-blue-600 transition-colors`}>
                {section.name}
              </span>
              {!hasChildren && section.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAccount(section);
                  }}
                  className="ml-2 p-1 rounded-lg hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Eye size={14} className="text-blue-600" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className={`${level === 0 ? 'text-xl font-bold' : 'font-semibold'} text-gray-900 min-w-[140px] text-right`}>
              {formatCurrency(section.amount)}
            </div>

            {showVerticalAnalysis && (
              <div className="text-sm text-gray-600 min-w-[80px] text-right">
                {percentOfTotal.toFixed(1)}%
              </div>
            )}

            {showComparison && variance && (
              <>
                <div className="text-sm text-gray-600 min-w-[140px] text-right">
                  {formatCurrency(previousAmount)}
                </div>
                <div className={`text-sm font-medium min-w-[120px] text-right ${variance.percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {variance.percentage >= 0 ? '+' : ''}{variance.percentage.toFixed(1)}%
                </div>
              </>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && section.children?.map((child, index) =>
          renderBalanceSheetSection(
            child,
            `${sectionId}-${index}`,
            level + 1,
            colorScheme
          )
        )}
      </div>
    );
  };

  const getPreviousAmount = (section: BalanceSheetItem, sectionId: string): number => {
    if (!comparativeData) return 0;
    if (sectionId === 'assets') return comparativeData.previous.totalAssets;
    if (sectionId === 'liabilities') return comparativeData.previous.totalLiabilities;
    if (sectionId === 'equity') return comparativeData.previous.totalEquity;
    return 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            showComparison ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <ArrowUpDown className="w-4 h-4 inline mr-2" />
          Compare
        </button>
        <button
          onClick={() => setShowVerticalAnalysis(!showVerticalAnalysis)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            showVerticalAnalysis ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <Percent className="w-4 h-4 inline mr-2" />
          Vertical Analysis
        </button>
      </div>

      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>

        <div className="relative bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm p-6 border-b border-white/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Balance Sheet Detail</h3>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="border-b border-white/30">
            {renderBalanceSheetSection(balanceSheetData.assets, 'assets', 0, 'from-blue-500 to-indigo-500')}
          </div>
          <div className="border-b border-white/30">
            {renderBalanceSheetSection(balanceSheetData.liabilities, 'liabilities', 0, 'from-red-500 to-pink-500')}
          </div>
          <div>
            {renderBalanceSheetSection(balanceSheetData.equity, 'equity', 0, 'from-green-500 to-emerald-500')}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChartsViewProps {
  historicalData: any[];
  assetCompositionData: any[];
  liabilityCompositionData: any[];
  equityCompositionData: any[];
  COLORS: string[];
  formatCurrency: (amount: number) => string;
}

const ChartsView: React.FC<ChartsViewProps> = ({
  historicalData,
  assetCompositionData,
  liabilityCompositionData,
  equityCompositionData,
  COLORS,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historical Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Area type="monotone" dataKey="totalAssets" stroke="#3b82f6" fill="url(#assetsGradient)" strokeWidth={2} name="Assets" />
            <Area type="monotone" dataKey="totalLiabilities" stroke="#ef4444" fill="url(#liabilitiesGradient)" strokeWidth={2} name="Liabilities" />
            <Area type="monotone" dataKey="totalEquity" stroke="#10b981" fill="url(#equityGradient)" strokeWidth={2} name="Equity" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Asset Composition</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={assetCompositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {assetCompositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Liability Composition</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={liabilityCompositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {liabilityCompositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Equity Composition</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={equityCompositionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry.value > 0 ? `${entry.name}: ${formatCurrency(entry.value)}` : ''}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {equityCompositionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface RatiosViewProps {
  ratios: any;
  workingCapital: number;
  currentAssetsTotal: number;
  healthScore: number;
  formatCurrency: (amount: number) => string;
}

const RatiosView: React.FC<RatiosViewProps> = ({
  ratios,
  workingCapital,
  currentAssetsTotal,
  healthScore,
  formatCurrency
}) => {
  const currentRatioHealth = getCurrentRatioHealth(ratios.liquidity.currentRatio);
  const quickRatioHealth = getQuickRatioHealth(ratios.liquidity.quickRatio);
  const debtToEquityHealth = getDebtToEquityHealth(ratios.leverage.debtToEquity);
  const debtToAssetsHealth = getDebtToAssetsHealth(ratios.leverage.debtToAssets);
  const workingCapitalHealth = getWorkingCapitalHealth(workingCapital, currentAssetsTotal);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overall Financial Health</h2>
            <p className="text-gray-600 mt-1">Comprehensive analysis of your balance sheet strength</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold text-${getHealthScoreColor(healthScore)}-600`}>
              {healthScore}
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">{getHealthScoreLabel(healthScore)}</div>
          </div>
        </div>

        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${
              healthScore >= 80
                ? 'from-green-400 to-green-600'
                : healthScore >= 60
                ? 'from-blue-400 to-blue-600'
                : healthScore >= 40
                ? 'from-yellow-400 to-yellow-600'
                : 'from-red-400 to-red-600'
            } transition-all duration-1000`}
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Liquidity Ratios
          </h3>

          <RatioCard
            title="Current Ratio"
            value={formatRatio(ratios.liquidity.currentRatio)}
            health={currentRatioHealth}
            description="Ability to pay short-term obligations"
            ideal="1.5 - 3.0"
          />
          <RatioCard
            title="Quick Ratio"
            value={formatRatio(ratios.liquidity.quickRatio)}
            health={quickRatioHealth}
            description="Ability to pay obligations without inventory"
            ideal="> 1.0"
          />
          <RatioCard
            title="Cash Ratio"
            value={formatRatio(ratios.liquidity.cashRatio)}
            health={currentRatioHealth}
            description="Ability to pay with cash only"
            ideal="> 0.5"
          />
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" />
            Leverage Ratios
          </h3>

          <RatioCard
            title="Debt-to-Equity"
            value={formatRatio(ratios.leverage.debtToEquity)}
            health={debtToEquityHealth}
            description="Financial leverage and risk"
            ideal="< 2.0"
          />
          <RatioCard
            title="Debt-to-Assets"
            value={formatPercentage(ratios.leverage.debtToAssets)}
            health={debtToAssetsHealth}
            description="Proportion of assets financed by debt"
            ideal="< 50%"
          />
          <RatioCard
            title="Equity Multiplier"
            value={formatRatio(ratios.leverage.equityMultiplier)}
            health={currentRatioHealth}
            description="Financial leverage indicator"
            ideal="< 3.0"
          />
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-green-600" />
            Working Capital Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RatioCard
              title="Working Capital"
              value={formatCurrency(workingCapital)}
              health={workingCapitalHealth}
              description="Current assets minus current liabilities"
              ideal="> 0"
            />
            <RatioCard
              title="Working Capital Ratio"
              value={formatPercentage(ratios.efficiency.workingCapitalRatio)}
              health={workingCapitalHealth}
              description="Working capital as % of current assets"
              ideal="> 20%"
            />
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Status</span>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className={`text-2xl font-bold text-${workingCapitalHealth.color}-600 mb-1`}>
                {workingCapitalHealth.status === 'excellent' || workingCapitalHealth.status === 'good' ? 'Healthy' : 'Monitor'}
              </div>
              <div className="text-xs text-gray-600">{workingCapitalHealth.message}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RatioCardProps {
  title: string;
  value: string;
  health: any;
  description: string;
  ideal: string;
}

const RatioCard: React.FC<RatioCardProps> = ({ title, value, health, description, ideal }) => {
  const colorClasses = {
    green: 'from-green-50 to-emerald-50 border-green-200/50 text-green-600',
    blue: 'from-blue-50 to-indigo-50 border-blue-200/50 text-blue-600',
    yellow: 'from-yellow-50 to-orange-50 border-yellow-200/50 text-yellow-600',
    orange: 'from-orange-50 to-red-50 border-orange-200/50 text-orange-600',
    red: 'from-red-50 to-pink-50 border-red-200/50 text-red-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[health.color as keyof typeof colorClasses] || colorClasses.blue} rounded-xl p-4 mb-4 border`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{title}</span>
        <span className={`text-2xl font-bold ${health.color === 'green' ? 'text-green-600' : health.color === 'blue' ? 'text-blue-600' : health.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
          {value}
        </span>
      </div>
      <div className="text-xs text-gray-600 mb-2">{description}</div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">Ideal: {ideal}</span>
        <span className={`text-xs font-medium ${health.color === 'green' ? 'text-green-600' : health.color === 'blue' ? 'text-blue-600' : health.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
          {health.status.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default EnhancedBalanceSheet;
