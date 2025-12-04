import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, getAccounts } from '../../lib/supabase';

interface QuickTransactionEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickTransactionEntry: React.FC<QuickTransactionEntryProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] = useState<'revenue' | 'expense'>('revenue');

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    accountId: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      loadAccounts();
    }
  }, [isOpen, user]);

  const loadAccounts = async () => {
    if (!user) return;

    try {
      const { data, error: err } = await getAccounts(user.id);
      if (err) throw err;
      setAccounts(data || []);
    } catch (err: any) {
      setError('Failed to load accounts: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.accountId || !formData.amount) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const cashAccount = accounts.find(acc => acc.code === '1000');
      if (!cashAccount) {
        throw new Error('Cash account not found');
      }

      const debitAccountId = transactionType === 'revenue' ? cashAccount.id : formData.accountId;
      const creditAccountId = transactionType === 'revenue' ? formData.accountId : cashAccount.id;

      const { error: transErr } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          reference: `QT-${Date.now()}`,
          description: formData.description,
          transaction_date: formData.date,
          debit_account_id: debitAccountId,
          credit_account_id: creditAccountId,
          amount: amount
        });

      if (transErr) throw transErr;

      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        accountId: ''
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredAccounts = accounts.filter(acc => {
    if (transactionType === 'revenue') {
      return acc.type === 'revenue';
    } else {
      return acc.type === 'expense';
    }
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Transaction Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() => setTransactionType('revenue')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
              transactionType === 'revenue'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Revenue / Income
          </button>
          <button
            type="button"
            onClick={() => setTransactionType('expense')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
              transactionType === 'expense'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            Expense
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`e.g., ${transactionType === 'revenue' ? 'Sales Revenue' : 'Office Supplies'}`}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {transactionType === 'revenue' ? 'Revenue' : 'Expense'} Account *
            </label>
            <select
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Account</option>
              {filteredAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.code} - {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">Transaction Preview:</p>
            <p>
              {transactionType === 'revenue' ? (
                <>
                  <strong>Debit:</strong> Cash (1000) &nbsp;&nbsp;
                  <strong>Credit:</strong> {filteredAccounts.find(a => a.id === formData.accountId)?.name || 'Revenue Account'}
                </>
              ) : (
                <>
                  <strong>Debit:</strong> {filteredAccounts.find(a => a.id === formData.accountId)?.name || 'Expense Account'} &nbsp;&nbsp;
                  <strong>Credit:</strong> Cash (1000)
                </>
              )}
            </p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickTransactionEntry;
