import React, { useState, useEffect } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, DollarSign,
  AlertCircle, RefreshCw, Plus, ChevronDown, ChevronRight, Eye, Search, ArrowUpDown,
  BarChart3, PieChart, Layers, Download, FileSpreadsheet, Percent, Target, Zap,
  Shield, TrendingDown as TrendingDownIcon, X, Info, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, ComposedChart,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { getCashFlowData, getHistoricalCashFlowData, ensureAccountsExist } from '../../lib/supabase';

interface CashFlowProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
  onRefresh?: () => void;
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  items: any[];
  total: number;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const DrillDownModal: React.FC<DrillDownModalProps> = ({ isOpen, onClose, category, items, total }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between z-10">
          <div>
            <h3 className="text-2xl font-bold text-white">{category}</h3>
            <p className="text-blue-100 text-sm mt-1">Cash Flow Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total {category}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Number of Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>

          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${item.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.description || 'Transaction'}</p>
                        <p className="text-xs text-gray-500">{item.type === 'inflow' ? 'Cash Inflow' : 'Cash Outflow'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.amount >= 0 ? '+' : '-'}{formatCurrency(item.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity size={48} className="mx-auto mb-4 opacity-30" />
                <p>No items found for this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedCashFlow: React.FC<CashFlowProps> = ({ dateRange, viewPeriod, department, onRefresh }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [previousData, setPreviousData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initializingAccounts, setInitializingAccounts] = useState(false);
  const [activeView, setActiveView] = useState<'table' | 'charts' | 'analytics'>('table');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['operating', 'investing', 'financing']));
  const [showComparison, setShowComparison] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [user, dateRange.start, dateRange.end, viewPeriod, department]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const [currentResult, historicalResult, prevStartDate, prevEndDate] = await Promise.all([
      getCashFlowData(user.id, dateRange.start, dateRange.end),
      getHistoricalCashFlowData(user.id, 6),
      getPreviousPeriodStart(dateRange.start, viewPeriod),
      getPreviousPeriodEnd(dateRange.start, viewPeriod)
    ]);

    if (currentResult.error) {
      setError(currentResult.error);
    } else {
      setData(currentResult.data);
    }

    if (historicalResult.data) {
      setHistoricalData(historicalResult.data);
    }

    if (prevStartDate && prevEndDate) {
      const prevResult = await getCashFlowData(user.id, prevStartDate, prevEndDate);
      if (prevResult.data) {
        setPreviousData(prevResult.data);
      }
    }

    setLoading(false);
  };

  const getPreviousPeriodStart = (currentStart: string, period: 'monthly' | 'quarterly' | 'yearly'): string => {
    const date = new Date(currentStart);
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

  const getPreviousPeriodEnd = (currentStart: string, period: 'monthly' | 'quarterly' | 'yearly'): string => {
    const date = new Date(currentStart);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };

  const handleInitializeAccounts = async () => {
    if (!user) return;

    try {
      setInitializingAccounts(true);
      setError(null);

      const { initialized, error: initError } = await ensureAccountsExist(user.id);

      if (initError) throw new Error(initError);

      await loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError('Failed to initialize accounts: ' + err.message);
    } finally {
      setInitializingAccounts(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const calculateVariance = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return 'text-green-600';
    if (variance < -5) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 5) return <ArrowUpRight size={16} className="text-green-600" />;
    if (variance < -5) return <ArrowDownRight size={16} className="text-red-600" />;
    return <Activity size={16} className="text-gray-600" />;
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleCategoryClick = (category: string, items: any[], total: number) => {
    setSelectedCategory({ category, items, total });
    setIsDrillDownOpen(true);
  };

  const exportToCSV = () => {
    if (!data) return;

    const headers = ['Category,Description,Amount,Type\n'];
    const rows: string[] = [];

    data.operating.forEach((item: any) => {
      rows.push(`Operating,${item.description},${item.amount},${item.type}\n`);
    });
    data.investing.forEach((item: any) => {
      rows.push(`Investing,${item.description},${item.amount},${item.type}\n`);
    });
    data.financing.forEach((item: any) => {
      rows.push(`Financing,${item.description},${item.amount},${item.type}\n`);
    });

    const csv = headers.concat(rows).join('');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cash-flow-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl p-8 h-40 border border-white/50"></div>
          ))}
        </div>
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 h-96 border border-white/50"></div>
      </div>
    );
  }

  if (error || !data) {
    const isCashAccountMissing = error?.includes('Cash account not found');

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50/60 backdrop-blur-md border border-yellow-200/50 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-900 mb-2">
                {isCashAccountMissing ? 'Accounts Not Initialized' : 'No Cash Flow Data'}
              </h3>
              <p className="text-yellow-800 mb-4">
                {isCashAccountMissing
                  ? 'Your chart of accounts needs to be set up before you can view cash flow reports.'
                  : error || 'No transactions found for the selected period.'}
              </p>
              {isCashAccountMissing && (
                <button
                  onClick={handleInitializeAccounts}
                  disabled={initializingAccounts}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50"
                >
                  {initializingAccounts ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Initializing Accounts...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Initialize Chart of Accounts
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const operatingTotal = data.operating.reduce((sum: number, item: any) => sum + item.amount, 0);
  const investingTotal = data.investing.reduce((sum: number, item: any) => sum + item.amount, 0);
  const financingTotal = data.financing.reduce((sum: number, item: any) => sum + item.amount, 0);
  const netCashFlow = data.netCashFlow;
  const closingCash = data.closingCash;

  const operatingVariance = previousData ? calculateVariance(operatingTotal, previousData.operating.reduce((sum: number, item: any) => sum + item.amount, 0)) : 0;
  const investingVariance = previousData ? calculateVariance(investingTotal, previousData.investing.reduce((sum: number, item: any) => sum + item.amount, 0)) : 0;
  const financingVariance = previousData ? calculateVariance(financingTotal, previousData.financing.reduce((sum: number, item: any) => sum + item.amount, 0)) : 0;
  const netCashFlowVariance = previousData ? calculateVariance(netCashFlow, previousData.netCashFlow) : 0;

  const operatingCashFlowRatio = netCashFlow > 0 && operatingTotal > 0 ? (operatingTotal / netCashFlow) * 100 : 0;
  const freeCashFlow = operatingTotal + investingTotal;
  const cashFlowToNetIncomeRatio = data.totalRevenue ? (netCashFlow / data.totalRevenue) * 100 : 0;

  const cashFlowBreakdown = [
    { name: 'Operating', value: Math.abs(operatingTotal), color: COLORS[0] },
    { name: 'Investing', value: Math.abs(investingTotal), color: COLORS[1] },
    { name: 'Financing', value: Math.abs(financingTotal), color: COLORS[2] }
  ];

  const filteredOperating = data.operating.filter((item: any) =>
    searchTerm === '' || item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredInvesting = data.investing.filter((item: any) =>
    searchTerm === '' || item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredFinancing = data.financing.filter((item: any) =>
    searchTerm === '' || item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Flow Statement</h1>
          <p className="text-gray-600 mt-1">
            {new Date(dateRange.start).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} - {' '}
            {new Date(dateRange.end).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
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
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              activeView === 'analytics'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/60 text-gray-600 hover:bg-white/80'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 rounded-xl font-medium bg-white/60 text-gray-600 hover:bg-white/80 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 inline mr-2" />
            CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Opening Cash"
          value={data.openingCash}
          icon={Wallet}
          color="blue"
        />
        <KPICard
          title="Net Cash Flow"
          value={netCashFlow}
          icon={Activity}
          color={netCashFlow >= 0 ? 'green' : 'red'}
          trend={previousData ? { amount: netCashFlow - previousData.netCashFlow, percentage: netCashFlowVariance } : undefined}
        />
        <KPICard
          title="Closing Cash"
          value={closingCash}
          icon={DollarSign}
          color="indigo"
        />
        <KPICard
          title="Cash Change"
          value={data.openingCash !== 0 ? ((netCashFlow / data.openingCash) * 100) : 0}
          icon={netCashFlow >= 0 ? TrendingUp : TrendingDown}
          color={netCashFlow >= 0 ? 'emerald' : 'orange'}
          isPercentage
        />
      </div>

      {activeView === 'table' && (
        <TableView
          data={data}
          previousData={previousData}
          operatingTotal={operatingTotal}
          investingTotal={investingTotal}
          financingTotal={financingTotal}
          operatingVariance={operatingVariance}
          investingVariance={investingVariance}
          financingVariance={financingVariance}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          showComparison={showComparison}
          setShowComparison={setShowComparison}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredOperating={filteredOperating}
          filteredInvesting={filteredInvesting}
          filteredFinancing={filteredFinancing}
          handleCategoryClick={handleCategoryClick}
          formatCurrency={formatCurrency}
          calculateVariance={calculateVariance}
          getVarianceColor={getVarianceColor}
          getVarianceIcon={getVarianceIcon}
        />
      )}

      {activeView === 'charts' && (
        <ChartsView
          historicalData={historicalData}
          cashFlowBreakdown={cashFlowBreakdown}
          data={data}
          formatCurrency={formatCurrency}
          COLORS={COLORS}
        />
      )}

      {activeView === 'analytics' && (
        <AnalyticsView
          operatingCashFlowRatio={operatingCashFlowRatio}
          freeCashFlow={freeCashFlow}
          cashFlowToNetIncomeRatio={cashFlowToNetIncomeRatio}
          operatingTotal={operatingTotal}
          investingTotal={investingTotal}
          financingTotal={financingTotal}
          netCashFlow={netCashFlow}
          closingCash={closingCash}
          formatCurrency={formatCurrency}
        />
      )}

      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        category={selectedCategory?.category || ''}
        items={selectedCategory?.items || []}
        total={selectedCategory?.total || 0}
      />
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend?: { amount: number; percentage: number };
  isPercentage?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, color, trend, isPercentage }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
    green: 'from-green-500 to-emerald-600',
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    orange: 'from-orange-500 to-red-600'
  };

  const bgColorClasses = {
    blue: 'from-blue-500/10 to-indigo-500/10',
    red: 'from-red-500/10 to-pink-500/10',
    green: 'from-green-500/10 to-emerald-500/10',
    indigo: 'from-indigo-500/10 to-purple-500/10',
    emerald: 'from-emerald-500/10 to-teal-500/10',
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
          {isPercentage ? `${value.toFixed(1)}%` : formatCurrency(value)}
        </div>
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
  data: any;
  previousData: any;
  operatingTotal: number;
  investingTotal: number;
  financingTotal: number;
  operatingVariance: number;
  investingVariance: number;
  financingVariance: number;
  expandedSections: Set<string>;
  toggleSection: (section: string) => void;
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredOperating: any[];
  filteredInvesting: any[];
  filteredFinancing: any[];
  handleCategoryClick: (category: string, items: any[], total: number) => void;
  formatCurrency: (amount: number) => string;
  calculateVariance: (current: number, previous: number) => number;
  getVarianceColor: (variance: number) => string;
  getVarianceIcon: (variance: number) => JSX.Element;
}

const TableView: React.FC<TableViewProps> = ({
  data,
  previousData,
  operatingTotal,
  investingTotal,
  financingTotal,
  operatingVariance,
  investingVariance,
  financingVariance,
  expandedSections,
  toggleSection,
  showComparison,
  setShowComparison,
  searchTerm,
  setSearchTerm,
  filteredOperating,
  filteredInvesting,
  filteredFinancing,
  handleCategoryClick,
  formatCurrency,
  calculateVariance,
  getVarianceColor,
  getVarianceIcon
}) => {
  const renderCashFlowSection = (
    title: string,
    items: any[],
    total: number,
    variance: number,
    icon: React.ReactNode,
    colorScheme: string,
    sectionId: string
  ) => {
    const isExpanded = expandedSections.has(sectionId);
    const previousTotal = previousData ? previousData[sectionId].reduce((sum: number, item: any) => sum + item.amount, 0) : 0;

    return (
      <div className="relative bg-white/30 backdrop-blur-md rounded-2xl border border-white/50 overflow-hidden">
        <div
          className={`p-4 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all ${
            isExpanded ? 'bg-gradient-to-r from-gray-50/40 to-blue-50/40' : ''
          }`}
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <button className="mr-3 p-1 rounded-lg hover:bg-white/30 transition-colors">
                {isExpanded ? (
                  <ChevronDown size={20} className="text-gray-600" />
                ) : (
                  <ChevronRight size={20} className="text-gray-600" />
                )}
              </button>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-r ${colorScheme}`}>
                {icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{items.length} items</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className={`text-xl font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {total >= 0 ? '+' : '-'}{formatCurrency(total)}
                </div>
                {showComparison && previousData && (
                  <div className={`text-sm font-medium flex items-center justify-end ${getVarianceColor(variance)}`}>
                    {getVarianceIcon(variance)}
                    <span className="ml-1">{Math.abs(variance).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCategoryClick(title, items, total);
                }}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 rounded-lg text-sm font-semibold transition-all"
              >
                <Eye size={14} className="inline mr-1" />
                View
              </button>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-white/30">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 px-16 hover:bg-white/20 transition-colors border-b border-white/10 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${item.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-800 font-medium">{item.description || 'Transaction'}</span>
                </div>
                <div className={`font-bold ${item.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.amount >= 0 ? '+' : '-'}{formatCurrency(item.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search cash flow items..."
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
      </div>

      <div className="space-y-4">
        {renderCashFlowSection(
          'Operating Activities',
          filteredOperating,
          operatingTotal,
          operatingVariance,
          <Activity className="w-5 h-5 text-white" />,
          'from-blue-500 to-indigo-500',
          'operating'
        )}

        {renderCashFlowSection(
          'Investing Activities',
          filteredInvesting,
          investingTotal,
          investingVariance,
          <TrendingUp className="w-5 h-5 text-white" />,
          'from-purple-500 to-violet-500',
          'investing'
        )}

        {renderCashFlowSection(
          'Financing Activities',
          filteredFinancing,
          financingTotal,
          financingVariance,
          <DollarSign className="w-5 h-5 text-white" />,
          'from-green-500 to-emerald-500',
          'financing'
        )}
      </div>

      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Cash Flow Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <SummaryRow label="Opening Cash Balance" amount={data.openingCash} formatCurrency={formatCurrency} />
            <SummaryRow label="Net Operating Cash Flow" amount={operatingTotal} formatCurrency={formatCurrency} color="blue" />
            <SummaryRow label="Net Investing Cash Flow" amount={investingTotal} formatCurrency={formatCurrency} color="purple" />
            <SummaryRow label="Net Financing Cash Flow" amount={financingTotal} formatCurrency={formatCurrency} color="green" />
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 w-full">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Closing Cash Balance</h4>
              <p className="text-4xl font-bold text-blue-600 mb-2">{formatCurrency(data.closingCash)}</p>
              <div className="flex items-center justify-center text-sm">
                {data.netCashFlow >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                )}
                <span className={`font-semibold ${data.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.netCashFlow >= 0 ? '+' : ''}{formatCurrency(data.netCashFlow)} net change
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  amount: number;
  formatCurrency: (amount: number) => string;
  color?: string;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, amount, formatCurrency, color }) => {
  const bgColors: any = {
    blue: 'bg-blue-50/60',
    purple: 'bg-purple-50/60',
    green: 'bg-green-50/60'
  };

  const textColors: any = {
    blue: 'text-blue-700',
    purple: 'text-purple-700',
    green: 'text-green-700'
  };

  return (
    <div className={`flex justify-between items-center p-4 ${color ? bgColors[color] : 'bg-white/30'} rounded-xl`}>
      <span className={`font-semibold ${color ? textColors[color] : 'text-gray-700'}`}>{label}</span>
      <span className={`font-bold ${amount >= 0 ? 'text-green-600' : amount === 0 ? 'text-gray-900' : 'text-red-600'}`}>
        {amount > 0 ? '+' : amount < 0 ? '-' : ''}{formatCurrency(amount)}
      </span>
    </div>
  );
};

interface ChartsViewProps {
  historicalData: any[];
  cashFlowBreakdown: any[];
  data: any;
  formatCurrency: (amount: number) => string;
  COLORS: string[];
}

const ChartsView: React.FC<ChartsViewProps> = ({ historicalData, cashFlowBreakdown, data, formatCurrency, COLORS }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historical Cash Flow Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={historicalData}>
            <defs>
              <linearGradient id="operatingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netCashFlowGradient" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="operating" stroke="#3b82f6" fill="url(#operatingGradient)" strokeWidth={2} name="Operating" />
            <Line type="monotone" dataKey="netCashFlow" stroke="#10b981" strokeWidth={3} name="Net Cash Flow" dot={{ fill: '#10b981', r: 4 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cash Flow Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPie>
            <Pie
              data={cashFlowBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {cashFlowBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cash Flow Components Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={historicalData}>
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
            <Bar dataKey="operating" fill={COLORS[0]} name="Operating" radius={[8, 8, 0, 0]} />
            <Bar dataKey="investing" fill={COLORS[1]} name="Investing" radius={[8, 8, 0, 0]} />
            <Bar dataKey="financing" fill={COLORS[2]} name="Financing" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Cash Balance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData}>
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
            <Line
              type="monotone"
              dataKey="closingCash"
              stroke="#8b5cf6"
              strokeWidth={3}
              name="Closing Cash"
              dot={{ fill: '#8b5cf6', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface AnalyticsViewProps {
  operatingCashFlowRatio: number;
  freeCashFlow: number;
  cashFlowToNetIncomeRatio: number;
  operatingTotal: number;
  investingTotal: number;
  financingTotal: number;
  netCashFlow: number;
  closingCash: number;
  formatCurrency: (amount: number) => string;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  operatingCashFlowRatio,
  freeCashFlow,
  cashFlowToNetIncomeRatio,
  operatingTotal,
  investingTotal,
  financingTotal,
  netCashFlow,
  closingCash,
  formatCurrency
}) => {
  const getCashHealthColor = (value: number) => {
    if (value >= 70) return 'from-green-400 to-green-600';
    if (value >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getCashHealthLabel = (value: number) => {
    if (value >= 70) return 'Excellent';
    if (value >= 40) return 'Good';
    return 'Needs Attention';
  };

  const cashHealthScore = Math.min(100, Math.max(0,
    (operatingTotal > 0 ? 40 : 0) +
    (freeCashFlow > 0 ? 30 : 0) +
    (netCashFlow > 0 ? 30 : 0)
  ));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Overall Cash Flow Health</h2>
            <p className="text-gray-600 mt-1">Comprehensive analysis of your cash position</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${cashHealthScore >= 70 ? 'text-green-600' : cashHealthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {cashHealthScore}
            </div>
            <div className="text-sm font-medium text-gray-600 mt-2">{getCashHealthLabel(cashHealthScore)}</div>
          </div>
        </div>

        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getCashHealthColor(cashHealthScore)} transition-all duration-1000`}
            style={{ width: `${cashHealthScore}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Operating Cash Flow Ratio"
          value={`${operatingCashFlowRatio.toFixed(1)}%`}
          description="Measures the quality of cash flow from operations"
          icon={Activity}
          color="blue"
          ideal="> 100%"
        />
        <MetricCard
          title="Free Cash Flow"
          value={formatCurrency(freeCashFlow)}
          description="Cash available after capital expenditures"
          icon={Zap}
          color="green"
          ideal="> 0"
        />
        <MetricCard
          title="Cash Flow Coverage"
          value={`${cashFlowToNetIncomeRatio.toFixed(1)}%`}
          description="Ability to generate cash from operations"
          icon={Shield}
          color="purple"
          ideal="> 80%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2 text-blue-600" />
            Cash Flow Analysis
          </h3>
          <div className="space-y-4">
            <AnalysisRow
              label="Operating Activities"
              amount={operatingTotal}
              total={Math.abs(operatingTotal) + Math.abs(investingTotal) + Math.abs(financingTotal)}
              formatCurrency={formatCurrency}
              color="blue"
            />
            <AnalysisRow
              label="Investing Activities"
              amount={investingTotal}
              total={Math.abs(operatingTotal) + Math.abs(investingTotal) + Math.abs(financingTotal)}
              formatCurrency={formatCurrency}
              color="purple"
            />
            <AnalysisRow
              label="Financing Activities"
              amount={financingTotal}
              total={Math.abs(operatingTotal) + Math.abs(investingTotal) + Math.abs(financingTotal)}
              formatCurrency={formatCurrency}
              color="green"
            />
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Info className="w-6 h-6 mr-2 text-indigo-600" />
            Key Insights
          </h3>
          <div className="space-y-4">
            <InsightCard
              text={operatingTotal > 0
                ? "Strong operating cash flow indicates healthy core business operations"
                : "Negative operating cash flow requires attention to business operations"}
              type={operatingTotal > 0 ? "positive" : "warning"}
            />
            <InsightCard
              text={freeCashFlow > 0
                ? "Positive free cash flow provides flexibility for growth and dividends"
                : "Limited free cash flow may restrict expansion opportunities"}
              type={freeCashFlow > 0 ? "positive" : "info"}
            />
            <InsightCard
              text={netCashFlow > 0
                ? "Overall cash position is improving"
                : "Cash position is declining, monitor carefully"}
              type={netCashFlow > 0 ? "positive" : "warning"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: any;
  color: string;
  ideal: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon: Icon, color, ideal }) => {
  const colorClasses: any = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200/50',
    green: 'from-green-50 to-emerald-50 border-green-200/50',
    purple: 'from-purple-50 to-pink-50 border-purple-200/50'
  };

  const iconColors: any = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 border`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${iconColors[color]}`} />
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs text-gray-500">Ideal: {ideal}</p>
    </div>
  );
};

interface AnalysisRowProps {
  label: string;
  amount: number;
  total: number;
  formatCurrency: (amount: number) => string;
  color: string;
}

const AnalysisRow: React.FC<AnalysisRowProps> = ({ label, amount, total, formatCurrency, color }) => {
  const percentage = total > 0 ? (Math.abs(amount) / total) * 100 : 0;

  const barColors: any = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className={`font-bold ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(amount)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${barColors[color]} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</div>
    </div>
  );
};

interface InsightCardProps {
  text: string;
  type: 'positive' | 'warning' | 'info';
}

const InsightCard: React.FC<InsightCardProps> = ({ text, type }) => {
  const bgColors = {
    positive: 'bg-green-50/60 border-green-200',
    warning: 'bg-yellow-50/60 border-yellow-200',
    info: 'bg-blue-50/60 border-blue-200'
  };

  const textColors = {
    positive: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  };

  return (
    <div className={`${bgColors[type]} border rounded-lg p-4`}>
      <p className={`text-sm ${textColors[type]}`}>{text}</p>
    </div>
  );
};

export default EnhancedCashFlow;
