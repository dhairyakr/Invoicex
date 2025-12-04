import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff, Search,
  Filter, BarChart3, Download, Archive, Tag, Edit, Trash2, ChevronDown, ChevronUp, Grid, List, Loader
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { supabase, getAccounts, ensureAccountsExist } from '../../lib/supabase';
import AccountDetailsModal from './AccountDetailsModal';
import { SkeletonLoader } from '../SkeletonLoader';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype: string;
  balance: number;
  is_active: boolean;
  description?: string;
  tax_relevant?: boolean;
  budget_enabled?: boolean;
  last_reconciled?: string;
}

const EnhancedAccountManagement: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [initializingAccounts, setInitializingAccounts] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'charts'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['asset', 'liability', 'equity', 'revenue', 'expense']));
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('code');

      if (err) throw err;

      if (!data || data.length === 0) {
        setError('No accounts found. Click "Initialize Accounts" to create default accounts.');
      } else {
        setAccounts(data as Account[]);
      }
    } catch (err: any) {
      setError('Failed to load accounts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeAccounts = async () => {
    if (!user) return;

    try {
      setInitializingAccounts(true);
      setError(null);

      const { initialized, error: initError } = await ensureAccountsExist(user.id);

      if (initError) throw new Error(initError);

      if (initialized) {
        await loadAccounts();
      } else {
        setError('Accounts already exist.');
      }
    } catch (err: any) {
      setError('Failed to initialize accounts: ' + err.message);
    } finally {
      setInitializingAccounts(false);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', gradient: 'from-green-500 to-emerald-500' };
      case 'liability':
        return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', gradient: 'from-red-500 to-pink-500' };
      case 'equity':
        return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', gradient: 'from-blue-500 to-indigo-500' };
      case 'revenue':
        return { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', gradient: 'from-purple-500 to-fuchsia-500' };
      case 'expense':
        return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', gradient: 'from-orange-500 to-amber-500' };
      default:
        return { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', gradient: 'from-gray-500 to-gray-600' };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredAccounts = accounts.filter(account => {
    if (!showInactive && !account.is_active) return false;
    if (filterType !== 'all' && account.type !== filterType) return false;
    if (searchTerm && !account.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !account.code.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const groupedAccounts = filteredAccounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const totalsByType = Object.entries(groupedAccounts).map(([type, accs]) => ({
    type,
    total: accs.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    count: accs.length
  }));

  const chartData = totalsByType.map(({ type, total }) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: Math.abs(total)
  }));

  const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#a855f7', '#f97316'];

  const toggleGroup = (type: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  const toggleSelection = (accountId: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountId)) {
      newSelected.delete(accountId);
    } else {
      newSelected.add(accountId);
    }
    setSelectedAccounts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedAccounts.size === filteredAccounts.length) {
      setSelectedAccounts(new Set());
    } else {
      setSelectedAccounts(new Set(filteredAccounts.map(a => a.id)));
    }
  };

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading chart of accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chart of Accounts</h2>
            <p className="text-sm text-gray-600">Manage and organize your account structure</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Selector */}
          <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === 'table' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-700'
              }`}
            >
              <List size={18} className="inline mr-1" />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === 'cards' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-700'
              }`}
            >
              <Grid size={18} className="inline mr-1" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                viewMode === 'charts' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-700'
              }`}
            >
              <BarChart3 size={18} className="inline mr-1" />
              Charts
            </button>
          </div>

          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl hover:bg-white/80 transition-all shadow-lg"
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showInactive ? 'Hide' : 'Show'} Inactive
          </button>

          <button
            onClick={loadAccounts}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-md border border-white/50 rounded-xl hover:bg-white/80 transition-all shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {accounts.length === 0 && (
            <button
              onClick={handleInitializeAccounts}
              disabled={initializingAccounts}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50"
            >
              {initializingAccounts ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Initialize Accounts
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      {accounts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search accounts by name or code..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white/60 backdrop-blur-sm"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white/60 backdrop-blur-sm font-medium"
          >
            <option value="all">All Types</option>
            <option value="asset">Assets</option>
            <option value="liability">Liabilities</option>
            <option value="equity">Equity</option>
            <option value="revenue">Revenue</option>
            <option value="expense">Expenses</option>
          </select>

          {selectedAccounts.size > 0 && (
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
              <Download size={18} />
              Export ({selectedAccounts.size})
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">Notice</p>
            <p className="text-sm text-yellow-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {accounts.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {totalsByType.map(({ type, total, count }) => {
              const colors = getAccountTypeColor(type);
              return (
                <div key={type} className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${colors.text} ${colors.bg} mb-3`}>
                      {type.toUpperCase()}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm text-gray-600 font-semibold">
                      {formatCurrency(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Content Views */}
          {viewMode === 'charts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Balance Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Balances by Type</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={totalsByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                      {totalsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((account) => {
                const colors = getAccountTypeColor(account.type);
                return (
                  <div
                    key={account.id}
                    className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleViewDetails(account)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${colors.text} ${colors.bg}`}>
                          {account.code}
                        </div>
                        {!account.is_active && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold">Inactive</span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                        {account.name}
                      </h4>
                      <p className="text-2xl font-bold text-gray-900 mb-2">{formatCurrency(account.balance)}</p>
                      <p className="text-xs text-gray-600 capitalize">{account.subtype || account.type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {viewMode === 'table' && (
            <div className="space-y-6">
              {Object.entries(groupedAccounts).map(([type, typeAccounts]) => {
                const colors = getAccountTypeColor(type);
                const isExpanded = expandedGroups.has(type);

                return (
                  <div key={type} className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                    {/* Group Header */}
                    <div
                      className={`px-6 py-4 border-b border-gray-200 ${colors.bg} cursor-pointer hover:bg-opacity-80 transition-all`}
                      onClick={() => toggleGroup(type)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          <h3 className="text-lg font-bold capitalize">{type} Accounts</h3>
                          <span className="px-2 py-1 bg-white/50 rounded-lg text-sm font-semibold">
                            {typeAccounts.length} accounts
                          </span>
                        </div>
                        <div className="text-xl font-bold">
                          {formatCurrency(typeAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0))}
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    {isExpanded && (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50/50">
                            <tr>
                              <th className="px-6 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={typeAccounts.every(acc => selectedAccounts.has(acc.id))}
                                  onChange={() => {
                                    const allSelected = typeAccounts.every(acc => selectedAccounts.has(acc.id));
                                    const newSelected = new Set(selectedAccounts);
                                    typeAccounts.forEach(acc => {
                                      if (allSelected) {
                                        newSelected.delete(acc.id);
                                      } else {
                                        newSelected.add(acc.id);
                                      }
                                    });
                                    setSelectedAccounts(newSelected);
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded"
                                />
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Code
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Account Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Subtype
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Balance
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {typeAccounts.map((account) => (
                              <tr key={account.id} className={`hover:bg-gray-50/50 transition-colors ${!account.is_active ? 'opacity-50' : ''}`}>
                                <td className="px-6 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedAccounts.has(account.id)}
                                    onChange={() => toggleSelection(account.id)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                                  {account.code}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                  {account.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                                  {account.subtype || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900">
                                  {formatCurrency(account.balance || 0)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  {account.is_active ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircle className="w-3 h-3" />
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Inactive
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => handleViewDetails(account)}
                                    className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all mr-2"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAccount(null);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedAccountManagement;
