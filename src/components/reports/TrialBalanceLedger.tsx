import React, { useState } from 'react';
import { Calculator, BookOpen, Search, Filter, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface TrialBalanceLedgerProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

const TrialBalanceLedger: React.FC<TrialBalanceLedgerProps> = ({ dateRange, viewPeriod, department }) => {
  const [activeView, setActiveView] = useState<'trial-balance' | 'ledger'>('trial-balance');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from Supabase
  const mockTrialBalance = [
    { account: 'Cash', debit: 125000, credit: 0, type: 'Asset' },
    { account: 'Accounts Receivable', debit: 85000, credit: 0, type: 'Asset' },
    { account: 'Inventory', debit: 45000, credit: 0, type: 'Asset' },
    { account: 'Equipment', debit: 150000, credit: 0, type: 'Asset' },
    { account: 'Accounts Payable', debit: 0, credit: 65000, type: 'Liability' },
    { account: 'Short-term Loans', debit: 0, credit: 35000, type: 'Liability' },
    { account: 'Share Capital', debit: 0, credit: 200000, type: 'Equity' },
    { account: 'Sales Revenue', debit: 0, credit: 125000, type: 'Revenue' },
    { account: 'Cost of Goods Sold', debit: 45000, credit: 0, type: 'Expense' },
    { account: 'Salaries Expense', debit: 25000, credit: 0, type: 'Expense' },
  ];

  const mockLedgerEntries = [
    { date: '2024-01-15', ref: 'INV-001', description: 'Sale to ABC Corp', debit: 25000, credit: 0, balance: 25000 },
    { date: '2024-01-18', ref: 'PAY-001', description: 'Payment from ABC Corp', debit: 0, credit: 25000, balance: 0 },
    { date: '2024-01-22', ref: 'INV-002', description: 'Sale to XYZ Ltd', debit: 35000, credit: 0, balance: 35000 },
    { date: '2024-01-25', ref: 'INV-003', description: 'Sale to DEF Inc', debit: 15000, credit: 0, balance: 50000 },
  ];

  const totalDebits = mockTrialBalance.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = mockTrialBalance.reduce((sum, item) => sum + item.credit, 0);
  const isBalanced = totalDebits === totalCredits;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'bg-blue-100/60 text-blue-800';
      case 'Liability': return 'bg-red-100/60 text-red-800';
      case 'Equity': return 'bg-green-100/60 text-green-800';
      case 'Revenue': return 'bg-emerald-100/60 text-emerald-800';
      case 'Expense': return 'bg-orange-100/60 text-orange-800';
      default: return 'bg-gray-100/60 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
          <button
            onClick={() => setActiveView('trial-balance')}
            className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'trial-balance'
                ? 'bg-blue-500/80 backdrop-blur-sm text-white shadow-lg'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
            <span className="relative z-10 flex items-center">
              <Calculator size={18} className="mr-2" />
              Trial Balance
            </span>
          </button>
          <button
            onClick={() => setActiveView('ledger')}
            className={`relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeView === 'ledger'
                ? 'bg-blue-500/80 backdrop-blur-sm text-white shadow-lg'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
            <span className="relative z-10 flex items-center">
              <BookOpen size={18} className="mr-2" />
              General Ledger
            </span>
          </button>
        </div>

        {/* Balance Status */}
        <div className={`flex items-center px-6 py-3 rounded-xl backdrop-blur-md border shadow-lg ${
          isBalanced 
            ? 'bg-green-50/60 border-green-200/50 text-green-800' 
            : 'bg-red-50/60 border-red-200/50 text-red-800'
        }`}>
          {isBalanced ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          <span className="font-semibold">
            {isBalanced ? 'Trial Balance is Balanced' : 'Trial Balance is Imbalanced'}
          </span>
        </div>
      </div>

      {activeView === 'trial-balance' ? (
        /* Trial Balance View */
        <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          
          {/* Table Header */}
          <div className="relative bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm p-6 border-b border-white/30">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Trial Balance</h3>
              </div>
              <div className="text-sm text-gray-600">
                As of {new Date(dateRange.end).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="relative z-10 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50/40 to-blue-50/40 backdrop-blur-sm">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Account Name</th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Debit (₹)</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Credit (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/30">
                {mockTrialBalance.map((item, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.account}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/50 ${getAccountTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="font-bold text-gray-900">
                        {item.debit > 0 ? formatCurrency(item.debit) : '—'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="font-bold text-gray-900">
                        {item.credit > 0 ? formatCurrency(item.credit) : '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm border-t border-white/30">
                <tr>
                  <td colSpan={2} className="px-8 py-6 font-bold text-gray-900 text-lg">Total</td>
                  <td className="px-8 py-6 text-right font-bold text-xl text-gray-900">{formatCurrency(totalDebits)}</td>
                  <td className="px-8 py-6 text-right font-bold text-xl text-gray-900">{formatCurrency(totalCredits)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* General Ledger View */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Account List */}
          <div className="relative bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
            <div className="relative z-10">
              <div className="p-4 border-b border-white/30 bg-gradient-to-r from-gray-50/40 to-blue-50/40">
                <h4 className="font-bold text-gray-900">Accounts</h4>
                <div className="mt-3 relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white/40 border border-white/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>
              <div className="p-2 max-h-[500px] overflow-y-auto">
                {mockTrialBalance.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAccount(item.account)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-300 mb-1 ${
                      selectedAccount === item.account
                        ? 'bg-blue-500/80 text-white shadow-lg'
                        : 'hover:bg-white/30 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{item.account}</div>
                    <div className="text-xs opacity-75">{item.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ledger Entries */}
          <div className="lg:col-span-3 relative bg-white/30 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
            <div className="relative z-10">
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
                </div>
              </div>

              {selectedAccount ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50/40 to-purple-50/40">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reference</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Debit</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Credit</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/30">
                      {mockLedgerEntries.map((entry, index) => (
                        <tr key={index} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-pink-50/30 transition-all duration-300">
                          <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-blue-100/60 text-blue-800 rounded text-xs font-mono">
                              {entry.ref}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{entry.description}</td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            {entry.debit > 0 ? formatCurrency(entry.debit) : '—'}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                            {entry.credit > 0 ? formatCurrency(entry.credit) : '—'}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">
                            {formatCurrency(entry.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-16 text-center">
                  <BookOpen size={48} className="text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-bold text-gray-700 mb-2">Select an Account</h4>
                  <p className="text-gray-600">Choose an account from the left sidebar to view its ledger entries</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrialBalanceLedger;