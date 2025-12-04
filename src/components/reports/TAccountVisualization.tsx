import React from 'react';
import { Scale, TrendingUp, TrendingDown } from 'lucide-react';
import { TAccountData } from '../../types';
import { formatCurrency } from '../../utils/trialBalanceUtils';

interface TAccountVisualizationProps {
  tAccountData: TAccountData;
  onClose?: () => void;
}

const TAccountVisualization: React.FC<TAccountVisualizationProps> = ({ tAccountData, onClose }) => {
  const { accountName, accountCode, accountType, normalBalance, openingBalance, totalDebits, totalCredits, closingBalance, debits, credits } = tAccountData;

  const getTypeColor = () => {
    switch (accountType) {
      case 'Asset': return 'from-blue-500 to-cyan-500';
      case 'Liability': return 'from-red-500 to-pink-500';
      case 'Equity': return 'from-green-500 to-emerald-500';
      case 'Revenue': return 'from-emerald-500 to-teal-500';
      case 'Expense': return 'from-orange-500 to-amber-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getBalanceIcon = () => {
    if (closingBalance > openingBalance) {
      return <TrendingUp className="w-5 h-5" />;
    } else if (closingBalance < openingBalance) {
      return <TrendingDown className="w-5 h-5" />;
    }
    return <Scale className="w-5 h-5" />;
  };

  const maxEntries = Math.max(debits.length, credits.length);
  const displayCount = Math.min(maxEntries, 8);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className={`relative bg-gradient-to-r ${getTypeColor()} p-8`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between text-white">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm opacity-90 font-medium">{accountCode}</div>
                    <h2 className="text-3xl font-bold">{accountName}</h2>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    {accountType}
                  </span>
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                    Normal Balance: {normalBalance === 'debit' ? 'Debit' : 'Credit'}
                  </span>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300"
                >
                  <span className="text-2xl">×</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200/50">
              <div className="text-sm text-blue-600 font-semibold mb-1">Opening Balance</div>
              <div className="text-3xl font-bold text-blue-900">{formatCurrency(openingBalance)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-600 font-semibold mb-1">Closing Balance</div>
                  <div className="text-3xl font-bold text-purple-900">{formatCurrency(closingBalance)}</div>
                </div>
                <div className="text-purple-600">
                  {getBalanceIcon()}
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
              <div className="text-sm text-emerald-600 font-semibold mb-1">Net Movement</div>
              <div className="text-3xl font-bold text-emerald-900">
                {formatCurrency(Math.abs(closingBalance - openingBalance))}
              </div>
            </div>
          </div>

          <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 text-center">
                  <div className="text-lg font-bold">DEBIT</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(totalDebits)}</div>
                  <div className="text-xs opacity-90 mt-1">{debits.length} entries</div>
                </div>
                <div className="p-4 space-y-2 min-h-[400px]">
                  {debits.slice(0, displayCount).map((entry, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-green-200/50 hover:border-green-400 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {entry.ref}
                        </span>
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1 truncate" title={entry.description}>
                        {entry.description}
                      </div>
                      <div className="text-lg font-bold text-green-700">
                        {formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                  {debits.length > displayCount && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      +{debits.length - displayCount} more entries
                    </div>
                  )}
                  {debits.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No debit entries
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50/50 to-pink-50/50">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 text-center">
                  <div className="text-lg font-bold">CREDIT</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(totalCredits)}</div>
                  <div className="text-xs opacity-90 mt-1">{credits.length} entries</div>
                </div>
                <div className="p-4 space-y-2 min-h-[400px]">
                  {credits.slice(0, displayCount).map((entry, index) => (
                    <div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-red-200/50 hover:border-red-400 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {entry.ref}
                        </span>
                        <span className="text-xs text-gray-500">{entry.date}</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1 truncate" title={entry.description}>
                        {entry.description}
                      </div>
                      <div className="text-lg font-bold text-red-700">
                        {formatCurrency(entry.amount)}
                      </div>
                    </div>
                  ))}
                  {credits.length > displayCount && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      +{credits.length - displayCount} more entries
                    </div>
                  )}
                  {credits.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      No credit entries
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-300 bg-gradient-to-r from-gray-100 to-slate-100 border-t-2 border-gray-300">
              <div className="p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold mb-1">Total Debits</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(totalDebits)}</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-sm text-gray-600 font-semibold mb-1">Total Credits</div>
                <div className="text-2xl font-bold text-red-700">{formatCurrency(totalCredits)}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 font-semibold mb-1">Account Balance</div>
                <div className="text-4xl font-bold text-blue-900">{formatCurrency(closingBalance)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  {normalBalance === 'debit' ? 'Debit' : 'Credit'} Balance Account
                </div>
                <div className={`text-lg font-semibold ${
                  closingBalance > 0 ? 'text-green-600' : closingBalance < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {closingBalance > 0 ? 'Positive' : closingBalance < 0 ? 'Negative' : 'Zero'} Balance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TAccountVisualization;