import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight,
  BarChart3, PieChart, AlertCircle, Download, Eye, X, ChevronDown, ChevronUp,
  Activity, Target, Zap, Calendar, FileText, Filter, Maximize2, Loader
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart
} from 'recharts';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
            <p className="text-sm text-gray-500">{account.category} - Transaction Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(account.amount)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Transactions</p>
              <p className="text-xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">% of Revenue</p>
              <p className="text-xl font-bold text-gray-900">{account.percentage.toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-2">
            {transactions.length > 0 ? (
              transactions.map((txn, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{txn.description || 'Transaction'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(txn.transaction_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-gray-500">{txn.type === 'debit' ? 'Debit' : 'Credit'}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400">
                <FileText size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No transactions found for this account</p>
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
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading profit & loss data...</p>
        </div>
      </div>
    );
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
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            showComparison
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Eye size={16} />
          Period Comparison
        </button>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Download size={16} />
          CSV
        </button>
      </div>

      {/* Clean KPI Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Target size={16} className="text-blue-600" />
            Key Performance Indicators
          </h3>
          <button
            onClick={() => toggleSection('kpis')}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {expandedSections.has('kpis') ? <ChevronUp size={18} className="text-gray-500" /> : <ChevronDown size={18} className="text-gray-500" />}
          </button>
        </div>

        {expandedSections.has('kpis') && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                {showComparison && previousData && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${getVarianceColor(revenueVariance)}`}>
                    {getVarianceIcon(revenueVariance)}
                    <span>{Math.abs(revenueVariance).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
              {showComparison && previousData && (
                <p className="text-xs text-gray-500 mt-2">
                  vs {formatCurrency(previousData.totalRevenue)} prev period
                </p>
              )}
            </div>

            {/* Gross Profit */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Gross Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(grossProfit)}</p>
              <p className="text-xs text-gray-500 mt-2">{grossMargin.toFixed(1)}% margin</p>
            </div>

            {/* Total Expenses */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                {showComparison && previousData && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${getVarianceColor(-expenseVariance)}`}>
                    {getVarianceIcon(expenseVariance)}
                    <span>{Math.abs(expenseVariance).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalExpenses)}</p>
              {showComparison && previousData && (
                <p className="text-xs text-gray-500 mt-2">
                  vs {formatCurrency(previousData.totalExpenses)} prev period
                </p>
              )}
            </div>

            {/* Net Profit */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                {showComparison && previousData && (
                  <div className={`flex items-center gap-1 text-sm font-medium ${getVarianceColor(profitVariance)}`}>
                    {getVarianceIcon(profitVariance)}
                    <span>{Math.abs(profitVariance).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.netProfit)}</p>
              <p className="text-xs text-gray-500 mt-2">{profitMargin.toFixed(1)}% margin</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue vs Expenses Trend */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Trend Analysis</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="revenue" fill="#dcfce7" stroke="#22c55e" name="Revenue" />
              <Area type="monotone" dataKey="expenses" fill="#fee2e2" stroke="#ef4444" name="Expenses" />
              <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Expense Breakdown</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RePieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${((entry.value / data.totalExpenses) * 100).toFixed(0)}%`}
                outerRadius={90}
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

      {/* Top Accounts Bar Chart */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Top Accounts by Amount</h3>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" width={140} fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Bar dataKey="amount" fill="#3b82f6" name="Amount" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed P&L Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Detailed Profit & Loss Statement</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Account</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Period</th>
                {showComparison && previousData && (
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Previous Period</th>
                )}
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">% of Revenue</th>
                {showComparison && (
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Variance</th>
                )}
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.map((account, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${
                        account.category === 'Revenue' ? 'bg-emerald-500' :
                        account.category === 'COGS' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{account.name}</div>
                        <div className="text-xs text-gray-500">{account.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className={`font-semibold text-sm ${account.amount >= 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {account.amount >= 0 ? '' : '-'}{formatCurrency(account.amount)}
                    </div>
                  </td>
                  {showComparison && previousData && (
                    <td className="px-5 py-4 text-right">
                      <div className="text-sm text-gray-600">
                        {formatCurrency(Math.abs(account.amount) / (1 + account.variance / 100))}
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-right">
                    <div className="text-sm text-gray-700">{account.percentage.toFixed(1)}%</div>
                  </td>
                  {showComparison && (
                    <td className="px-5 py-4 text-right">
                      <div className={`flex items-center justify-end text-sm font-medium ${getVarianceColor(account.variance)}`}>
                        {getVarianceIcon(account.variance)}
                        <span className="ml-1">{Math.abs(account.variance).toFixed(1)}%</span>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleAccountClick(account)}
                      className="px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-medium transition-colors"
                    >
                      <Maximize2 size={12} className="inline mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td className="px-5 py-4 font-semibold text-gray-900">NET PROFIT</td>
                <td className="px-5 py-4 text-right">
                  <div className={`text-lg font-bold ${data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatCurrency(data.netProfit)}
                  </div>
                </td>
                {showComparison && previousData && (
                  <td className="px-5 py-4 text-right">
                    <div className="font-medium text-gray-600">
                      {formatCurrency(previousData.netProfit)}
                    </div>
                  </td>
                )}
                <td className="px-5 py-4 text-right">
                  <div className="font-semibold text-blue-600">{profitMargin.toFixed(1)}%</div>
                </td>
                {showComparison && (
                  <td className="px-5 py-4 text-right">
                    <div className={`flex items-center justify-end font-semibold ${getVarianceColor(profitVariance)}`}>
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
