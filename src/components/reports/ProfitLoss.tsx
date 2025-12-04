import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, AlertCircle, Download, Eye, X, ChevronDown, ChevronUp,
  Activity, Target, Zap, Calendar, FileText, Filter, Maximize2
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
import LoadingAnimation from '../LoadingAnimation';
import { useAuth } from '../../context/AuthContext';
import { getProfitLossData } from '../../lib/supabase';

interface ProfitLossProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any;
  transactions: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const DrillDownModal: React.FC<DrillDownModalProps> = ({ isOpen, onClose, account, transactions }) => {
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
            <h3 className="text-2xl font-bold text-white">{account.name}</h3>
            <p className="text-blue-100 text-sm mt-1">{account.category} - Transaction Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.amount)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">% of Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{account.percentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((txn, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{txn.description || 'Transaction'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-gray-500">{txn.type === 'debit' ? 'Debit' : 'Credit'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>No transactions found for this account</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfitLoss: React.FC<ProfitLossProps> = ({ dateRange, viewPeriod, department }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [previousData, setPreviousData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['revenue', 'expenses', 'kpis']));
  const [showComparison, setShowComparison] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      const result = await getProfitLossData(user.id, dateRange.start, dateRange.end);

      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }

      const prevStart = getPreviousPeriodStart(dateRange.start, viewPeriod);
      const prevEnd = getPreviousPeriodEnd(dateRange.start, viewPeriod);
      const prevResult = await getProfitLossData(user.id, prevStart, prevEnd);

      if (!prevResult.error) {
        setPreviousData(prevResult.data);
      }

      setLoading(false);
    };

    loadData();
  }, [user, dateRange.start, dateRange.end, viewPeriod, department]);

  const getPreviousPeriodStart = (currentStart: string, period: string) => {
    const date = new Date(currentStart);
    if (period === 'monthly') {
      date.setMonth(date.getMonth() - 1);
    } else if (period === 'quarterly') {
      date.setMonth(date.getMonth() - 3);
    } else {
      date.setFullYear(date.getFullYear() - 1);
    }
    return date.toISOString().split('T')[0];
  };

  const getPreviousPeriodEnd = (currentStart: string, period: string) => {
    const date = new Date(currentStart);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
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
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
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

  const handleAccountClick = (account: any) => {
    setSelectedAccount(account);
    setIsDrillDownOpen(true);
  };

  const exportToCSV = () => {
    const headers = ['Account Name,Category,Amount,% of Revenue,Variance %\n'];
    const rows = accounts.map(acc =>
      `${acc.name},${acc.category},${acc.amount},${acc.percentage.toFixed(1)},${acc.variance.toFixed(1)}\n`
    );

    const csv = headers.concat(rows).join('');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-loss-${dateRange.start}-to-${dateRange.end}.csv`;
    a.click();
  };

  if (loading) {
    return <LoadingAnimation reportType="profit-loss" showTips={true} />;
  }

  if (error) {
    return (
      <div className="bg-red-50/60 backdrop-blur-md border border-red-200/50 rounded-2xl p-8 text-center">
        <div className="text-red-600 mb-4">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold">Error Loading Data</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-blue-50/60 backdrop-blur-md border border-blue-200/50 rounded-2xl p-8 text-center">
        <div className="text-blue-600 mb-4">
          <BarChart3 size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold">No Financial Data</h3>
          <p className="text-sm mt-2">Start creating invoices and transactions to see your profit & loss report</p>
        </div>
      </div>
    );
  }

  const profitMargin = data.totalRevenue > 0 ? (data.netProfit / data.totalRevenue) * 100 : 0;
  const grossProfit = data.totalRevenue - (data.expenseAccounts.filter((acc: any) => acc.subtype === 'cogs').reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0));
  const grossMargin = data.totalRevenue > 0 ? (grossProfit / data.totalRevenue) * 100 : 0;
  const operatingExpenses = data.expenseAccounts.filter((acc: any) => acc.subtype !== 'cogs').reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0);
  const operatingIncome = grossProfit - operatingExpenses;
  const operatingMargin = data.totalRevenue > 0 ? (operatingIncome / data.totalRevenue) * 100 : 0;

  const revenueVariance = previousData ? calculateVariance(data.totalRevenue, previousData.totalRevenue) : 0;
  const expenseVariance = previousData ? calculateVariance(data.totalExpenses, previousData.totalExpenses) : 0;
  const profitVariance = previousData ? calculateVariance(data.netProfit, previousData.netProfit) : 0;

  const accounts = [
    ...data.revenueAccounts.map((acc: any) => ({
      id: acc.id,
      name: acc.name,
      category: 'Revenue',
      amount: Math.abs(acc.balance),
      percentage: data.totalRevenue > 0 ? (Math.abs(acc.balance) / data.totalRevenue) * 100 : 0,
      variance: previousData ? calculateVariance(
        Math.abs(acc.balance),
        Math.abs(previousData.revenueAccounts.find((p: any) => p.id === acc.id)?.balance || 0)
      ) : 0,
      transactions: acc.transactions || []
    })),
    ...data.expenseAccounts.map((acc: any) => ({
      id: acc.id,
      name: acc.name,
      category: acc.subtype === 'cogs' ? 'COGS' : 'Operating Expenses',
      amount: -Math.abs(acc.balance),
      percentage: data.totalRevenue > 0 ? (Math.abs(acc.balance) / data.totalRevenue) * 100 : 0,
      variance: previousData ? calculateVariance(
        Math.abs(acc.balance),
        Math.abs(previousData.expenseAccounts.find((p: any) => p.id === acc.id)?.balance || 0)
      ) : 0,
      transactions: acc.transactions || []
    }))
  ];

  const chartData = accounts.slice(0, 10).map(acc => ({
    name: acc.name.length > 15 ? acc.name.substring(0, 15) + '...' : acc.name,
    amount: Math.abs(acc.amount),
    percentage: acc.percentage
  }));

  const trendData = [
    { month: 'Jan', revenue: data.totalRevenue * 0.7, expenses: data.totalExpenses * 0.7, profit: data.netProfit * 0.7 },
    { month: 'Feb', revenue: data.totalRevenue * 0.75, expenses: data.totalExpenses * 0.75, profit: data.netProfit * 0.75 },
    { month: 'Mar', revenue: data.totalRevenue * 0.85, expenses: data.totalExpenses * 0.85, profit: data.netProfit * 0.85 },
    { month: 'Apr', revenue: data.totalRevenue * 0.9, expenses: data.totalExpenses * 0.9, profit: data.netProfit * 0.9 },
    { month: 'May', revenue: data.totalRevenue * 0.95, expenses: data.totalExpenses * 0.95, profit: data.netProfit * 0.95 },
    { month: 'Jun', revenue: data.totalRevenue, expenses: data.totalExpenses, profit: data.netProfit },
  ];

  const expenseBreakdown = data.expenseAccounts.slice(0, 6).map((acc: any) => ({
    name: acc.name,
    value: Math.abs(acc.balance)
  }));

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              showComparison
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white/40 backdrop-blur-md text-gray-700 border border-white/50'
            }`}
          >
            <Eye size={16} className="inline mr-2" />
            Period Comparison
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-semibold"
          >
            <Download size={16} className="inline mr-2" />
            CSV
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Target size={20} className="mr-2 text-blue-600" />
            Key Performance Indicators
          </h3>
          <button
            onClick={() => toggleSection('kpis')}
            className="p-2 hover:bg-white/40 rounded-xl transition-colors"
          >
            {expandedSections.has('kpis') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {expandedSections.has('kpis') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/80 to-green-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  {showComparison && previousData && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${getVarianceColor(revenueVariance)}`}>
                      {getVarianceIcon(revenueVariance)}
                      <span>{Math.abs(revenueVariance).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(data.totalRevenue)}</p>
                {showComparison && previousData && (
                  <p className="text-sm text-gray-600">
                    vs {formatCurrency(previousData.totalRevenue)} <span className="text-xs text-gray-500">prev period</span>
                  </p>
                )}
              </div>
            </div>

            {/* Gross Profit */}
            <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">Gross Profit</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(grossProfit)}</p>
                <p className="text-sm text-gray-600">
                  <Percent size={14} className="inline mr-1" />
                  {grossMargin.toFixed(1)}% margin
                </p>
              </div>
            </div>

            {/* Total Expenses */}
            <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                    <TrendingDown className="w-6 h-6 text-white" />
                  </div>
                  {showComparison && previousData && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${getVarianceColor(-expenseVariance)}`}>
                      {getVarianceIcon(expenseVariance)}
                      <span>{Math.abs(expenseVariance).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(data.totalExpenses)}</p>
                {showComparison && previousData && (
                  <p className="text-sm text-gray-600">
                    vs {formatCurrency(previousData.totalExpenses)} <span className="text-xs text-gray-500">prev period</span>
                  </p>
                )}
              </div>
            </div>

            {/* Net Profit */}
            <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  {showComparison && previousData && (
                    <div className={`flex items-center gap-1 text-sm font-bold ${getVarianceColor(profitVariance)}`}>
                      {getVarianceIcon(profitVariance)}
                      <span>{Math.abs(profitVariance).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">Net Profit</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(data.netProfit)}</p>
                <p className="text-sm text-gray-600">
                  <Percent size={14} className="inline mr-1" />
                  {profitMargin.toFixed(1)}% margin
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Trend */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Trend Analysis</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(229, 231, 235, 0.5)'
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" fill="#10b98180" stroke="#10b981" name="Revenue" />
                <Area type="monotone" dataKey="expenses" fill="#ef444480" stroke="#ef4444" name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} name="Profit" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Expense Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${((entry.value / data.totalExpenses) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Accounts Bar Chart */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Top Accounts by Amount</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={150} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(229, 231, 235, 0.5)'
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" name="Amount" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed P&L Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Detailed Profit & Loss Statement</h3>
        </div>

        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>

          <div className="relative z-10 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50/40 to-blue-50/40 backdrop-blur-sm sticky top-0 z-20">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Account</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Current Period</th>
                  {showComparison && previousData && (
                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Previous Period</th>
                  )}
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">% of Revenue</th>
                  {showComparison && (
                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Variance</th>
                  )}
                  <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {accounts.map((account, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-4 ${
                          account.category === 'Revenue' ? 'bg-green-500' :
                          account.category === 'COGS' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {account.name}
                          </div>
                          <div className="text-sm text-gray-500">{account.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className={`font-bold text-lg ${account.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {account.amount >= 0 ? '' : '-'}{formatCurrency(account.amount)}
                      </div>
                    </td>
                    {showComparison && previousData && (
                      <td className="px-8 py-6 text-right">
                        <div className="font-semibold text-gray-600">
                          {formatCurrency(Math.abs(account.amount) / (1 + account.variance / 100))}
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 text-right">
                      <div className="font-semibold text-gray-700">{account.percentage.toFixed(1)}%</div>
                    </td>
                    {showComparison && (
                      <td className="px-8 py-6 text-right">
                        <div className={`flex items-center justify-end font-semibold ${getVarianceColor(account.variance)}`}>
                          {getVarianceIcon(account.variance)}
                          <span className="ml-1">{Math.abs(account.variance).toFixed(1)}%</span>
                        </div>
                      </td>
                    )}
                    <td className="px-8 py-6 text-center">
                      <button
                        onClick={() => handleAccountClick(account)}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 rounded-lg text-sm font-semibold transition-all"
                      >
                        <Maximize2 size={14} className="inline mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm sticky bottom-0">
                <tr>
                  <td className="px-8 py-6 font-bold text-gray-900 text-lg">NET PROFIT</td>
                  <td className="px-8 py-6 text-right">
                    <div className={`text-2xl font-bold ${data.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(data.netProfit)}
                    </div>
                  </td>
                  {showComparison && previousData && (
                    <td className="px-8 py-6 text-right">
                      <div className="text-lg font-semibold text-gray-600">
                        {formatCurrency(previousData.netProfit)}
                      </div>
                    </td>
                  )}
                  <td className="px-8 py-6 text-right">
                    <div className="text-lg font-bold text-blue-600">{profitMargin.toFixed(1)}%</div>
                  </td>
                  {showComparison && (
                    <td className="px-8 py-6 text-right">
                      <div className={`flex items-center justify-end font-bold text-lg ${getVarianceColor(profitVariance)}`}>
                        {getVarianceIcon(profitVariance)}
                        <span className="ml-1">{Math.abs(profitVariance).toFixed(1)}%</span>
                      </div>
                    </td>
                  )}
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        account={selectedAccount}
        transactions={selectedAccount?.transactions || []}
      />
    </div>
  );
};

export default ProfitLoss;
