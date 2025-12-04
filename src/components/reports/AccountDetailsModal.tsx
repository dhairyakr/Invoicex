import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, FileText, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAccountTransactions } from '../../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AccountDetailsModalProps {
  account: {
    id: string;
    name: string;
    code: string;
    type: string;
    balance: number;
  };
  onClose: () => void;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ account, onClose }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');

  useEffect(() => {
    const loadTransactions = async () => {
      if (!user) return;

      setLoading(true);
      const result = await getAccountTransactions(user.id, account.id);

      if (result.data) {
        setTransactions(result.data);
      }

      setLoading(false);
    };

    loadTransactions();
  }, [user, account.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'debit') return t.isDebit;
    if (filterType === 'credit') return !t.isDebit;
    return true;
  });

  const calculateRunningBalance = () => {
    let runningBalance = 0;
    return filteredTransactions.map(t => {
      if (t.isDebit) {
        if (account.type === 'asset' || account.type === 'expense') {
          runningBalance += t.amount;
        } else {
          runningBalance -= t.amount;
        }
      } else {
        if (account.type === 'asset' || account.type === 'expense') {
          runningBalance -= t.amount;
        } else {
          runningBalance += t.amount;
        }
      }
      return {
        date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        balance: runningBalance
      };
    }).reverse();
  };

  const chartData = calculateRunningBalance();

  const totalDebit = transactions.filter(t => t.isDebit).reduce((sum, t) => sum + t.amount, 0);
  const totalCredit = transactions.filter(t => !t.isDebit).reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/50">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center justify-between pr-12">
            <div>
              <div className="text-sm opacity-90 mb-1">Account Code: {account.code}</div>
              <h2 className="text-3xl font-bold mb-2">{account.name}</h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium capitalize">
                  {account.type}
                </span>
                <span className="text-2xl font-bold">{formatCurrency(Math.abs(account.balance))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Total Debits</span>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalDebit)}</div>
              <div className="text-xs text-gray-600 mt-1">{transactions.filter(t => t.isDebit).length} transactions</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Total Credits</span>
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalCredit)}</div>
              <div className="text-xs text-gray-600 mt-1">{transactions.filter(t => !t.isDebit).length} transactions</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">Net Balance</span>
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(Math.abs(account.balance))}</div>
              <div className="text-xs text-gray-600 mt-1">{transactions.length} total transactions</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Balance Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
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
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200/50">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('debit')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'debit'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Debits
                </button>
                <button
                  onClick={() => setFilterType('credit')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterType === 'credit'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Credits
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading transactions...</div>
              ) : filteredTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No transactions found</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Opposite Account</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Debit</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{transaction.description}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {transaction.relevantAccount?.name || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {transaction.isDebit ? (
                            <span className="text-green-600">{formatCurrency(transaction.amount)}</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {!transaction.isDebit ? (
                            <span className="text-red-600">{formatCurrency(transaction.amount)}</span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsModal;
