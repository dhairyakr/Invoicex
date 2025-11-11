import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface JournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface JournalLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: string;
  credit: string;
}

const JournalEntryModal: React.FC<JournalEntryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [journalLines, setJournalLines] = useState<JournalLine[]>([
    { id: '1', accountId: '', accountName: '', debit: '', credit: '' },
    { id: '2', accountId: '', accountName: '', debit: '', credit: '' }
  ]);

  const [formData, setFormData] = useState({
    reference: '',
    description: '',
    journal_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isOpen && user) {
      loadAccounts();
    }
  }, [isOpen, user]);

  const loadAccounts = async () => {
    try {
      const { data, error: err } = await supabase
        .from('accounts')
        .select('id, code, name')
        .eq('user_id', user!.id)
        .eq('is_active', true)
        .order('code');

      if (err) throw err;
      setAccounts(data || []);
    } catch (err: any) {
      setError('Failed to load accounts');
      console.error(err);
    }
  };

  const updateJournalLine = (id: string, field: string, value: string) => {
    setJournalLines(lines =>
      lines.map(line =>
        line.id === id ? { ...line, [field]: value } : line
      )
    );
  };

  const getAccountName = (accountId: string) => {
    const acc = accounts.find(a => a.id === accountId);
    return acc ? `${acc.code} - ${acc.name}` : '';
  };

  const addJournalLine = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setJournalLines([
      ...journalLines,
      { id: newId, accountId: '', accountName: '', debit: '', credit: '' }
    ]);
  };

  const removeJournalLine = (id: string) => {
    if (journalLines.length > 2) {
      setJournalLines(journalLines.filter(line => line.id !== id));
    }
  };

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;
    journalLines.forEach(line => {
      if (line.debit) totalDebit += parseFloat(line.debit) || 0;
      if (line.credit) totalCredit += parseFloat(line.credit) || 0;
    });
    return { totalDebit, totalCredit };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { totalDebit, totalCredit } = calculateTotals();

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      setError('Journal entry must be balanced. Debits must equal credits.');
      return;
    }

    if (journalLines.some(line => !line.accountId || (!line.debit && !line.credit))) {
      setError('All lines must have an account and either debit or credit amount');
      return;
    }

    setLoading(true);
    try {
      const { data: journal, error: journalErr } = await supabase
        .from('journals')
        .insert({
          user_id: user.id,
          reference: formData.reference,
          description: formData.description,
          journal_date: formData.journal_date,
          total_amount: totalDebit,
          status: 'posted'
        })
        .select()
        .single();

      if (journalErr) throw journalErr;

      for (const line of journalLines) {
        if (line.debit) {
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              reference: formData.reference,
              description: formData.description,
              transaction_date: formData.journal_date,
              debit_account_id: line.accountId,
              credit_account_id: null,
              amount: parseFloat(line.debit),
              journal_id: journal.id
            });
        }
        if (line.credit) {
          await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              reference: formData.reference,
              description: formData.description,
              transaction_date: formData.journal_date,
              debit_account_id: null,
              credit_account_id: line.accountId,
              amount: parseFloat(line.credit),
              journal_id: journal.id
            });
        }
      }

      setFormData({
        reference: '',
        description: '',
        journal_date: new Date().toISOString().split('T')[0]
      });
      setJournalLines([
        { id: '1', accountId: '', accountName: '', debit: '', credit: '' },
        { id: '2', accountId: '', accountName: '', debit: '', credit: '' }
      ]);
      setError(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create journal entry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Journal Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="e.g., JE-001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter journal entry description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Journal Date *
            </label>
            <input
              type="date"
              value={formData.journal_date}
              onChange={(e) => setFormData({ ...formData, journal_date: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Account</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700">Debit</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700">Credit</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {journalLines.map((line, idx) => (
                  <tr key={line.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <select
                        value={line.accountId}
                        onChange={(e) => {
                          updateJournalLine(line.id, 'accountId', e.target.value);
                          updateJournalLine(line.id, 'accountName', getAccountName(e.target.value));
                        }}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                      >
                        <option value="">Select Account</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={line.debit}
                        onChange={(e) => updateJournalLine(line.id, 'debit', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={line.credit}
                        onChange={(e) => updateJournalLine(line.id, 'credit', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-right"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      {journalLines.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeJournalLine(line.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-400 font-semibold">
                  <td className="py-2 px-3 text-right">Total:</td>
                  <td className="py-2 px-3 text-right">{totalDebit.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right">{totalCredit.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <button
            type="button"
            onClick={addJournalLine}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} />
            Add Line
          </button>

          {!isBalanced && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              Debits ({totalDebit.toFixed(2)}) must equal Credits ({totalCredit.toFixed(2)})
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isBalanced}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Journal Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JournalEntryModal;
