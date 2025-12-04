import React from 'react';
import { X, FileText, Calendar, User, Tag, Hash, Link as LinkIcon, Clock } from 'lucide-react';
import { LedgerEntry, TransactionType } from '../../types';
import { formatCurrency } from '../../utils/trialBalanceUtils';

interface TransactionDetailsModalProps {
  entry: LedgerEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ entry, isOpen, onClose }) => {
  if (!isOpen || !entry) return null;

  const getTypeColor = (type: TransactionType) => {
    const colors = {
      journal: 'bg-blue-100 text-blue-800 border-blue-300',
      invoice: 'bg-purple-100 text-purple-800 border-purple-300',
      payment: 'bg-green-100 text-green-800 border-green-300',
      adjustment: 'bg-orange-100 text-orange-800 border-orange-300',
      opening: 'bg-gray-100 text-gray-800 border-gray-300',
      closing: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[type] || colors.journal;
  };

  const getReconciliationColor = (status: string) => {
    const colors = {
      unreconciled: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      reconciled: 'bg-green-100 text-green-800 border-green-300',
      locked: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status as keyof typeof colors] || colors.unreconciled;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20"></div>
          <div className="relative z-10 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Transaction Details</h2>
                <p className="text-sm opacity-90">Reference: {entry.ref}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200/50">
              <div className="flex items-center space-x-2 text-blue-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-semibold">Transaction Date</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200/50">
              <div className="flex items-center space-x-2 text-purple-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">Posting Date</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                {new Date(entry.postingDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-6">
            <div className="flex items-center space-x-2 text-gray-700 mb-3">
              <FileText className="w-5 h-5" />
              <span className="text-lg font-bold">Description</span>
            </div>
            <p className="text-gray-900 text-base leading-relaxed">{entry.description}</p>
          </div>

          {entry.memo && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200/50 mb-6">
              <div className="flex items-center space-x-2 text-amber-700 mb-3">
                <FileText className="w-5 h-5" />
                <span className="text-lg font-bold">Memo</span>
              </div>
              <p className="text-gray-800 text-sm leading-relaxed italic">{entry.memo}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200/50">
              <div className="text-sm text-green-600 font-semibold mb-2">Debit Amount</div>
              <div className="text-2xl font-bold text-green-800">
                {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-200/50">
              <div className="text-sm text-red-600 font-semibold mb-2">Credit Amount</div>
              <div className="text-2xl font-bold text-red-800">
                {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200/50">
              <div className="text-sm text-blue-600 font-semibold mb-2">Running Balance</div>
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(entry.balance)}
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 mb-6">
            <div className="flex items-center space-x-2 text-gray-700 mb-4">
              <LinkIcon className="w-5 h-5" />
              <span className="text-lg font-bold">Contra Account</span>
            </div>
            <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl p-4 border border-gray-300">
              <div className="text-lg font-semibold text-gray-900">{entry.contraAccount}</div>
              <div className="text-sm text-gray-600 mt-1">
                {entry.debit > 0 ? 'Credit account' : 'Debit account'} in this transaction
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-2 text-gray-700 mb-3">
                <Hash className="w-4 h-4" />
                <span className="text-sm font-semibold">Transaction Type</span>
              </div>
              <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${getTypeColor(entry.type)}`}>
                {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
              </span>
            </div>

            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-2 text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-semibold">Reconciliation Status</span>
              </div>
              <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border ${getReconciliationColor(entry.reconciliationStatus)}`}>
                {entry.reconciliationStatus.charAt(0).toUpperCase() + entry.reconciliationStatus.slice(1)}
              </span>
            </div>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 mb-6">
              <div className="flex items-center space-x-2 text-gray-700 mb-3">
                <Tag className="w-4 h-4" />
                <span className="text-sm font-semibold">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {entry.attachments && entry.attachments.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
              <div className="flex items-center space-x-2 text-gray-700 mb-3">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-semibold">Attachments</span>
              </div>
              <div className="space-y-2">
                {entry.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;