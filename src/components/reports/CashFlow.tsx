import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, DollarSign, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCashFlowData, ensureAccountsExist } from '../../lib/supabase';

interface CashFlowProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
  onRefresh?: () => void;
}

const CashFlow: React.FC<CashFlowProps> = ({ dateRange, viewPeriod, department, onRefresh }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initializingAccounts, setInitializingAccounts] = useState(false);

  useEffect(() => {
    loadData();
  }, [user, dateRange.start, dateRange.end, viewPeriod, department]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const result = await getCashFlowData(user.id, dateRange.start, dateRange.end);

    if (result.error) {
      setError(result.error);
    } else {
      setData(result.data);
    }

    setLoading(false);
  };

  const handleInitializeAccounts = async () => {
    if (!user) return;

    try {
      setInitializingAccounts(true);
      setError(null);

      const { initialized, error: initError } = await ensureAccountsExist(user.id);

      if (initError) throw new Error(initError);

      await loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError('Failed to initialize accounts: ' + err.message);
    } finally {
      setInitializingAccounts(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    const isCashAccountMissing = error?.includes('Cash account not found');
    const hasNoTransactions = !error && !data;

    return (
      <div className="space-y-6">
        <div className="bg-yellow-50/60 backdrop-blur-md border border-yellow-200/50 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-12 h-12 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-yellow-900 mb-2">
                {isCashAccountMissing ? 'Accounts Not Initialized' : 'No Cash Flow Data'}
              </h3>
              <p className="text-yellow-800 mb-4">
                {isCashAccountMissing
                  ? 'Your chart of accounts needs to be set up before you can view cash flow reports.'
                  : error || 'No transactions found for the selected period. Start by creating journal entries or transactions.'}
              </p>
              {isCashAccountMissing && (
                <button
                  onClick={handleInitializeAccounts}
                  disabled={initializingAccounts}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50"
                >
                  {initializingAccounts ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Initializing Accounts...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Initialize Chart of Accounts
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/50">
          <h4 className="font-bold text-gray-900 mb-4">What is Cash Flow?</h4>
          <p className="text-gray-700 mb-4">
            The Cash Flow Statement shows how money moves in and out of your business. It tracks:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <strong>Operating Activities:</strong> Cash from daily business operations
            </li>
            <li className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              <strong>Investing Activities:</strong> Cash from buying/selling assets
            </li>
            <li className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-purple-600" />
              <strong>Financing Activities:</strong> Cash from loans and equity
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const operatingTotal = data.operating.reduce((sum: number, item: any) => sum + item.amount, 0);
  const investingTotal = data.investing.reduce((sum: number, item: any) => sum + item.amount, 0);
  const financingTotal = data.financing.reduce((sum: number, item: any) => sum + item.amount, 0);
  const netCashFlow = data.netCashFlow;
  const closingCash = data.closingCash;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const renderCashFlowSection = (
    title: string, 
    items: any[], 
    total: number,
    icon: React.ReactNode,
    colorScheme: string
  ) => (
    <div className="relative bg-white/30 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-r ${colorScheme}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/30 transition-colors">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  item.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-gray-800 font-medium">{item.description}</span>
              </div>
              <div className={`font-bold ${
                item.amount >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.amount >= 0 ? '+' : '-'}{formatCurrency(item.amount)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/30">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">Net {title}</span>
            <div className={`font-bold text-xl ${
              total >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {total >= 0 ? '+' : '-'}{formatCurrency(total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Opening Cash</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.openingCash)}</p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Net Cash Flow</p>
            <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netCashFlow >= 0 ? '+' : '-'}{formatCurrency(netCashFlow)}
            </p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Closing Cash</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(closingCash)}</p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Cash Change</p>
            <div className="flex items-center justify-center">
              {netCashFlow >= 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600 mr-1" />
              )}
              <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {((netCashFlow / mockData.openingCash) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderCashFlowSection(
          'Operating Activities',
          data.operating,
          operatingTotal,
          <Activity className="w-5 h-5 text-white" />,
          'from-blue-500 to-indigo-500'
        )}
        
        {renderCashFlowSection(
          'Investing Activities',
          data.investing,
          investingTotal,
          <TrendingUp className="w-5 h-5 text-white" />,
          'from-purple-500 to-violet-500'
        )}
        
        {renderCashFlowSection(
          'Financing Activities',
          data.financing,
          financingTotal,
          <DollarSign className="w-5 h-5 text-white" />,
          'from-green-500 to-emerald-500'
        )}
      </div>

      {/* Cash Flow Summary */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Cash Flow Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/30 rounded-xl">
                <span className="font-semibold text-gray-700">Opening Cash Balance</span>
                <span className="font-bold text-gray-900">{formatCurrency(data.openingCash)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50/60 rounded-xl">
                <span className="font-semibold text-blue-700">Net Operating Cash Flow</span>
                <span className={`font-bold ${operatingTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {operatingTotal >= 0 ? '+' : ''}{formatCurrency(operatingTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50/60 rounded-xl">
                <span className="font-semibold text-purple-700">Net Investing Cash Flow</span>
                <span className={`font-bold ${investingTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {investingTotal >= 0 ? '+' : ''}{formatCurrency(investingTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50/60 rounded-xl">
                <span className="font-semibold text-green-700">Net Financing Cash Flow</span>
                <span className={`font-bold ${financingTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financingTotal >= 0 ? '+' : ''}{formatCurrency(financingTotal)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Closing Cash Balance</h4>
                <p className="text-4xl font-bold text-blue-600 mb-2">{formatCurrency(closingCash)}</p>
                <div className="flex items-center justify-center text-sm">
                  {netCashFlow >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                  )}
                  <span className={`font-semibold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)} net change
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;