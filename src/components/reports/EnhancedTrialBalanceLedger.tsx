import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  BookOpen,
  Search,
  Filter,
  FileText,
  CheckCircle,
  AlertTriangle,
  Download,
  Scale,
  Activity,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  BarChart3,
  FileDown,
  Eye,
  Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTrialBalanceData, getTransactions, getAccounts } from '../../lib/supabase';
import {
  TrialBalanceAccount,
  TrialBalanceData,
  LedgerEntry,
  AccountType,
  AccountActivityLevel,
  ReconciliationStatus
} from '../../types';
import {
  sortTrialBalance,
  filterAccounts,
  formatCurrency,
  groupAccountsByType,
  calculateAccountAnalytics,
  buildTAccountData,
  getAccountNormalBalance
} from '../../utils/trialBalanceUtils';
import { exportTrialBalanceToCSV, exportTrialBalanceToPDF, exportLedgerToCSV, exportLedgerToPDF } from '../../utils/trialBalanceExport';
import TAccountVisualization from './TAccountVisualization';
import TransactionDetailsModal from './TransactionDetailsModal';
import AnalyticsDashboard from './AnalyticsDashboard';

interface EnhancedTrialBalanceLedgerProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

type ViewMode = 'trial-balance' | 'ledger' | 'analytics' | 't-accounts';
type SortField = 'name' | 'code' | 'type' | 'debit' | 'credit' | 'balance';

const EnhancedTrialBalanceLedger: React.FC<EnhancedTrialBalanceLedgerProps> = ({ dateRange, viewPeriod, department }) => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<ViewMode>('trial-balance');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedAccountData, setSelectedAccountData] = useState<TrialBalanceAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceData | null>(null);
  const [ledgerData, setLedgerData] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<AccountType[]>([]);
  const [selectedActivityLevels, setSelectedActivityLevels] = useState<AccountActivityLevel[]>([]);
  const [showZeroBalance, setShowZeroBalance] = useState(true);
  const [groupByAccountType, setGroupByAccountType] = useState(false);
  const [showTAccount, setShowTAccount] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<LedgerEntry | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<AccountType>>(new Set(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']));

  useEffect(() => {
    loadTrialBalance();
  }, [user, dateRange.end, viewPeriod, department]);

  useEffect(() => {
    if (selectedAccount) {
      loadLedgerData();
    }
  }, [selectedAccount, dateRange]);

  const loadTrialBalance = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getTrialBalanceData(user.id, dateRange.end);

      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        const accounts = result.data.accounts.map((account: any) => ({
          account: account.account,
          accountCode: account.code || '000',
          type: formatAccountType(account.type),
          debit: account.debit || 0,
          credit: account.credit || 0,
          openingBalance: 0,
          closingBalance: (account.debit || 0) - (account.credit || 0),
          transactionCount: 0,
          activityLevel: 'medium' as AccountActivityLevel,
          reconciliationStatus: 'unreconciled' as ReconciliationStatus
        }));

        const totalDebits = result.data.totalDebits || 0;
        const totalCredits = result.data.totalCredits || 0;

        const summary = calculateSummary(accounts);

        setTrialBalanceData({
          accounts,
          totalDebits,
          totalCredits,
          isBalanced: result.data.isBalanced || false,
          variance: Math.abs(totalDebits - totalCredits),
          period: dateRange,
          summary
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error loading trial balance');
    } finally {
      setLoading(false);
    }
  };

  const formatAccountType = (type: string): AccountType => {
    const typeMap: Record<string, AccountType> = {
      asset: 'Asset',
      liability: 'Liability',
      equity: 'Equity',
      revenue: 'Revenue',
      expense: 'Expense'
    };
    return typeMap[type.toLowerCase()] || 'Asset';
  };

  const calculateSummary = (accounts: TrialBalanceAccount[]) => {
    return accounts.reduce(
      (acc, account) => {
        const balance = account.closingBalance;
        switch (account.type) {
          case 'Asset':
            acc.totalAssets += Math.abs(balance);
            break;
          case 'Liability':
            acc.totalLiabilities += Math.abs(balance);
            break;
          case 'Equity':
            acc.totalEquity += Math.abs(balance);
            break;
          case 'Revenue':
            acc.totalRevenue += Math.abs(balance);
            break;
          case 'Expense':
            acc.totalExpenses += Math.abs(balance);
            break;
        }
        return acc;
      },
      {
        totalAssets: 0,
        totalLiabilities: 0,
        totalEquity: 0,
        totalRevenue: 0,
        totalExpenses: 0
      }
    );
  };

  const loadLedgerData = async () => {
    if (!user || !selectedAccount) return;

    try {
      const { data: transactions, error } = await getTransactions(user.id, dateRange.start, dateRange.end);

      if (error) {
        setError(error.message);
        return;
      }

      const accountTransactions = transactions?.filter(
        t => t.debit_account?.name === selectedAccount || t.credit_account?.name === selectedAccount
      ) || [];

      let runningBalance = 0;
      const ledgerEntries: LedgerEntry[] = accountTransactions.map(transaction => {
        const isDebit = transaction.debit_account?.name === selectedAccount;
        const amount = transaction.amount;

        if (isDebit) {
          runningBalance += amount;
        } else {
          runningBalance -= amount;
        }

        return {
          id: transaction.id,
          date: transaction.transaction_date,
          postingDate: transaction.transaction_date,
          ref: transaction.reference,
          description: transaction.description,
          contraAccount: isDebit
            ? transaction.credit_account?.name || 'Unknown'
            : transaction.debit_account?.name || 'Unknown',
          debit: isDebit ? amount : 0,
          credit: isDebit ? 0 : amount,
          balance: runningBalance,
          type: 'journal',
          reconciliationStatus: 'unreconciled',
          tags: [],
          memo: transaction.memo,
          attachments: []
        };
      });

      setLedgerData(ledgerEntries);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredAccounts = useMemo(() => {
    if (!trialBalanceData) return [];

    let filtered = filterAccounts(trialBalanceData.accounts, {
      search: searchQuery,
      types: selectedTypes,
      activityLevels: selectedActivityLevels,
      showZeroBalance
    });

    return sortTrialBalance(filtered, sortField, sortOrder);
  }, [trialBalanceData, searchQuery, selectedTypes, selectedActivityLevels, showZeroBalance, sortField, sortOrder]);

  const groupedAccounts = useMemo(() => {
    return groupAccountsByType(filteredAccounts);
  }, [filteredAccounts]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!trialBalanceData) return;

    const options = {
      format,
      includeOpeningBalance: true,
      includeClosingBalance: true,
      includeVariance: false,
      groupByType: groupByAccountType,
      includeSummary: true,
      includeCharts: false,
      dateRange
    };

    if (format === 'csv') {
      exportTrialBalanceToCSV(trialBalanceData, options);
    } else {
      exportTrialBalanceToPDF(trialBalanceData, options);
    }
  };

  const handleLedgerExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportLedgerToCSV(selectedAccount, ledgerData, dateRange);
    } else {
      exportLedgerToPDF(selectedAccount, ledgerData, dateRange);
    }
  };

  const handleViewTAccount = (account: TrialBalanceAccount) => {
    setSelectedAccountData(account);
    const tAccountData = buildTAccountData(
      account.account,
      account.accountCode,
      account.type,
      ledgerData,
      account.openingBalance
    );
    setShowTAccount(true);
  };

  const toggleGroupExpansion = (type: AccountType) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedGroups(newExpanded);
  };

  const getActivityColor = (level: AccountActivityLevel) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-orange-100 text-orange-800 border-orange-300',
      low: 'bg-blue-100 text-blue-800 border-blue-300',
      dormant: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[level];
  };

  const getAccountTypeColor = (type: AccountType) => {
    const colors = {
      Asset: 'bg-blue-100/60 text-blue-800',
      Liability: 'bg-red-100/60 text-red-800',
      Equity: 'bg-green-100/60 text-green-800',
      Revenue: 'bg-emerald-100/60 text-emerald-800',
      Expense: 'bg-orange-100/60 text-orange-800'
    };
    return colors[type];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading trial balance data...</p>
        </div>
      </div>
    );
  }

  if (error || !trialBalanceData) {
    return (
      <div className="bg-red-50/60 backdrop-blur-md border border-red-200/50 rounded-2xl p-8 text-center">
        <div className="text-red-600 mb-4">
          <Calculator size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold">Error Loading Data</h3>
          <p className="text-sm mt-2">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
          <div className="relative flex flex-wrap gap-1">
            <button
              onClick={() => setActiveView('trial-balance')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                activeView === 'trial-balance'
                  ? 'bg-blue-500/80 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              <Calculator size={16} className="inline mr-1" />
              Trial Balance
            </button>
            <button
              onClick={() => setActiveView('ledger')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                activeView === 'ledger'
                  ? 'bg-blue-500/80 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              <BookOpen size={16} className="inline mr-1" />
              Ledger
            </button>
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm ${
                activeView === 'analytics'
                  ? 'bg-blue-500/80 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              <BarChart3 size={16} className="inline mr-1" />
              Analytics
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center px-4 py-2 rounded-xl backdrop-blur-md border shadow-lg ${
              trialBalanceData.isBalanced
                ? 'bg-green-50/60 border-green-200/50 text-green-800'
                : 'bg-red-50/60 border-red-200/50 text-red-800'
            }`}
          >
            {trialBalanceData.isBalanced ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <AlertTriangle className="w-4 h-4 mr-2" />
            )}
            <span className="font-semibold text-sm">
              {trialBalanceData.isBalanced ? 'Balanced' : 'Imbalanced'}
            </span>
          </div>

          {activeView === 'trial-balance' && (
            <div className="relative bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold text-sm"
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>
            </div>
          )}

          <div className="relative group">
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg font-semibold text-sm">
              <Download size={16} className="mr-2" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 rounded-t-xl text-sm font-medium"
              >
                <FileDown size={16} className="inline mr-2" />
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 rounded-b-xl text-sm font-medium"
              >
                <FileText size={16} className="inline mr-2" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFilters && activeView === 'trial-balance' && (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Account Types</label>
              <div className="space-y-2">
                {(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as AccountType[]).map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type]);
                        } else {
                          setSelectedTypes(selectedTypes.filter(t => t !== type));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-2">
                {(['high', 'medium', 'low', 'dormant'] as AccountActivityLevel[]).map(level => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedActivityLevels.includes(level)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedActivityLevels([...selectedActivityLevels, level]);
                        } else {
                          setSelectedActivityLevels(selectedActivityLevels.filter(l => l !== level));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Display Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showZeroBalance}
                    onChange={e => setShowZeroBalance(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Show zero balances</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={groupByAccountType}
                    onChange={e => setGroupByAccountType(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Group by type</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedTypes([]);
                setSelectedActivityLevels([]);
                setShowZeroBalance(true);
                setGroupByAccountType(false);
              }}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <AnalyticsDashboard data={trialBalanceData} />
      )}

      {activeView === 'trial-balance' && (
        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-6 border-b border-white/30 bg-gradient-to-r from-gray-50/60 to-blue-50/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Trial Balance</h3>
                  <p className="text-sm text-gray-600">As of {new Date(dateRange.end).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="relative bg-white/40 backdrop-blur-sm rounded-xl p-1 border border-white/50">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none text-sm w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50/40 to-blue-50/40">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Code</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Account Name</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Type</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => handleSort('debit')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Debit (₹)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-50/30 transition-colors"
                    onClick={() => handleSort('credit')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Credit (₹)</span>
                      <ArrowUpDown size={14} />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {!groupByAccountType ? (
                  filteredAccounts.map((account, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group cursor-pointer"
                      onClick={() => {
                        setSelectedAccount(account.account);
                        setActiveView('ledger');
                      }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {account.accountCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {account.account}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAccountTypeColor(account.type)}`}>
                          {account.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-gray-900">
                          {account.debit > 0 ? formatCurrency(account.debit) : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-gray-900">
                          {account.credit > 0 ? formatCurrency(account.credit) : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedAccount(account.account);
                            loadLedgerData();
                            const tData = buildTAccountData(
                              account.account,
                              account.accountCode,
                              account.type,
                              [],
                              account.openingBalance
                            );
                            setShowTAccount(true);
                          }}
                          className="p-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
                          title="View T-Account"
                        >
                          <Scale size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  Object.entries(groupedAccounts).map(([type, accounts]) =>
                    accounts.length > 0 ? (
                      <React.Fragment key={type}>
                        <tr
                          className="bg-gradient-to-r from-gray-100/60 to-blue-100/60 cursor-pointer hover:from-gray-200/60 hover:to-blue-200/60 transition-all"
                          onClick={() => toggleGroupExpansion(type as AccountType)}
                        >
                          <td colSpan={6} className="px-6 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {expandedGroups.has(type as AccountType) ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                                <span className="text-lg font-bold text-gray-900">{type}</span>
                                <span className="text-sm text-gray-600">({accounts.length} accounts)</span>
                              </div>
                              <div className="text-sm font-semibold text-gray-700">
                                Total: {formatCurrency(accounts.reduce((sum, acc) => sum + acc.closingBalance, 0))}
                              </div>
                            </div>
                          </td>
                        </tr>
                        {expandedGroups.has(type as AccountType) &&
                          accounts.map((account, index) => (
                            <tr
                              key={`${type}-${index}`}
                              className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group cursor-pointer"
                              onClick={() => {
                                setSelectedAccount(account.account);
                                setActiveView('ledger');
                              }}
                            >
                              <td className="px-6 py-4 pl-12">
                                <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {account.accountCode}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {account.account}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAccountTypeColor(account.type)}`}>
                                  {account.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="font-bold text-gray-900">
                                  {account.debit > 0 ? formatCurrency(account.debit) : '—'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="font-bold text-gray-900">
                                  {account.credit > 0 ? formatCurrency(account.credit) : '—'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    setSelectedAccount(account.account);
                                    loadLedgerData();
                                    const tData = buildTAccountData(
                                      account.account,
                                      account.accountCode,
                                      account.type,
                                      [],
                                      account.openingBalance
                                    );
                                    setShowTAccount(true);
                                  }}
                                  className="p-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
                                  title="View T-Account"
                                >
                                  <Scale size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    ) : null
                  )
                )}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={3} className="px-6 py-4 font-bold text-gray-900 text-lg">
                    Total
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-xl text-gray-900">
                    {formatCurrency(trialBalanceData.totalDebits)}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-xl text-gray-900">
                    {formatCurrency(trialBalanceData.totalCredits)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {activeView === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-4 border-b border-white/30 bg-gradient-to-r from-gray-50/40 to-blue-50/40">
              <h4 className="font-bold text-gray-900 mb-3">Accounts</h4>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-white/40 border border-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
            <div className="p-2 max-h-[600px] overflow-y-auto">
              {filteredAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedAccount(account.account);
                    setSelectedAccountData(account);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 mb-1 ${
                    selectedAccount === account.account
                      ? 'bg-blue-500/80 text-white shadow-lg'
                      : 'hover:bg-white/30 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">{account.account}</div>
                  <div className="text-xs opacity-75">{account.type}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 relative bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-white/30 bg-gradient-to-r from-gray-50/40 to-blue-50/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {selectedAccount || 'Select an Account'}
                    </h4>
                    <p className="text-sm text-gray-600">General Ledger Entries</p>
                  </div>
                </div>
                {selectedAccount && ledgerData.length > 0 && (
                  <div className="relative group">
                    <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg font-semibold text-sm">
                      <Download size={16} className="mr-2" />
                      Export
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                      <button
                        onClick={() => handleLedgerExport('pdf')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 rounded-t-xl text-sm font-medium"
                      >
                        <FileDown size={16} className="inline mr-2" />
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleLedgerExport('csv')}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-700 rounded-b-xl text-sm font-medium"
                      >
                        <FileText size={16} className="inline mr-2" />
                        Export as CSV
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedAccount && ledgerData.length > 0 ? (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50/40 to-purple-50/40 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Contra Account
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Debit
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Credit
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/30">
                    {ledgerData.map((entry, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-300"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-blue-100/60 text-blue-800 rounded text-xs font-mono">
                            {entry.ref}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={entry.description}>
                          {entry.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate" title={entry.contraAccount}>
                          {entry.contraAccount}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-green-700">
                          {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-red-700">
                          {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">
                          {formatCurrency(entry.balance)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedTransaction(entry);
                              setShowTransactionModal(true);
                            }}
                            className="p-2 bg-purple-500/80 hover:bg-purple-600 text-white rounded-lg transition-all duration-300"
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
            ) : (
              <div className="p-16 text-center">
                <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-700 mb-2">
                  {selectedAccount ? 'No Transactions' : 'Select an Account'}
                </h4>
                <p className="text-gray-600">
                  {selectedAccount
                    ? 'This account has no transactions in the selected period'
                    : 'Choose an account from the left sidebar to view its ledger entries'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showTAccount && selectedAccountData && (
        <TAccountVisualization
          tAccountData={buildTAccountData(
            selectedAccountData.account,
            selectedAccountData.accountCode,
            selectedAccountData.type,
            ledgerData,
            selectedAccountData.openingBalance
          )}
          onClose={() => setShowTAccount(false)}
        />
      )}

      <TransactionDetailsModal
        entry={selectedTransaction}
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};

export default EnhancedTrialBalanceLedger;