import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Scale, PieChart, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TrialBalanceData, FinancialRatios, AccountActivityLevel } from '../../types';
import { formatCurrency, formatNumber, formatPercentage, calculateFinancialRatios } from '../../utils/trialBalanceUtils';

interface AnalyticsDashboardProps {
  data: TrialBalanceData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const ratios = calculateFinancialRatios(data.summary);

  const activityDistribution = data.accounts.reduce((acc, account) => {
    acc[account.activityLevel] = (acc[account.activityLevel] || 0) + 1;
    return acc;
  }, {} as Record<AccountActivityLevel, number>);

  const unreconciledCount = data.accounts.filter(a => a.reconciliationStatus === 'unreconciled').length;
  const activeAccountsCount = data.accounts.filter(a => a.closingBalance !== 0).length;

  const netIncome = data.summary.totalRevenue - data.summary.totalExpenses;
  const profitMargin = data.summary.totalRevenue !== 0 ? (netIncome / data.summary.totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 text-white mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">Financial Analytics Dashboard</h3>
          </div>
          <p className="text-white/90 text-sm">
            Comprehensive insights and key performance indicators for the period
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              {netIncome > 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="text-sm text-gray-600 font-semibold mb-1">Net Income</div>
            <div className={`text-2xl font-bold ${netIncome > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Profit Margin: {formatPercentage(profitMargin)}
            </div>
          </div>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              {ratios.assetsEqualsLiabilitiesPlusEquity ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="text-sm text-gray-600 font-semibold mb-1">Accounting Equation</div>
            <div className={`text-lg font-bold ${ratios.assetsEqualsLiabilitiesPlusEquity ? 'text-green-600' : 'text-red-600'}`}>
              {ratios.assetsEqualsLiabilitiesPlusEquity ? 'Balanced' : 'Imbalanced'}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Variance: {formatCurrency(ratios.accountingEquationVariance)}
            </div>
          </div>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600 font-semibold mb-1">Active Accounts</div>
            <div className="text-2xl font-bold text-purple-600">
              {activeAccountsCount} / {data.accounts.length}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {formatPercentage((activeAccountsCount / data.accounts.length) * 100)} active
            </div>
          </div>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-amber-50/50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              {unreconciledCount > 0 ? (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div className="text-sm text-gray-600 font-semibold mb-1">Reconciliation</div>
            <div className={`text-2xl font-bold ${unreconciledCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
              {unreconciledCount} Pending
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {data.accounts.length - unreconciledCount} reconciled
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Financial Ratios</h4>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Current Ratio</span>
                  <span className="text-xs text-gray-500">Assets / Liabilities</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{formatNumber(ratios.currentRatio)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {ratios.currentRatio >= 2 ? 'Excellent' : ratios.currentRatio >= 1 ? 'Good' : 'Needs attention'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-xl p-4 border border-purple-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Quick Ratio</span>
                  <span className="text-xs text-gray-500">Liquid Assets / Liabilities</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">{formatNumber(ratios.quickRatio)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {ratios.quickRatio >= 1 ? 'Strong liquidity' : 'Monitor closely'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Debt-to-Equity</span>
                  <span className="text-xs text-gray-500">Liabilities / Equity</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{formatNumber(ratios.debtToEquity)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {ratios.debtToEquity <= 1 ? 'Conservative' : ratios.debtToEquity <= 2 ? 'Moderate' : 'High leverage'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50/60 to-amber-50/60 rounded-xl p-4 border border-orange-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Working Capital</span>
                  <span className="text-xs text-gray-500">Assets - Liabilities</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">{formatCurrency(ratios.workingCapital)}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {ratios.workingCapital > 0 ? 'Positive working capital' : 'Negative working capital'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">Account Summary</h4>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50/60 to-cyan-50/60 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Assets</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-700">{formatCurrency(data.summary.totalAssets)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-50/60 to-pink-50/60 rounded-xl p-4 border border-red-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Liabilities</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-700">{formatCurrency(data.summary.totalLiabilities)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Equity</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-700">{formatCurrency(data.summary.totalEquity)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/60 rounded-xl p-4 border border-emerald-200/50">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Revenue</div>
                  <div className="text-lg font-bold text-emerald-700">{formatCurrency(data.summary.totalRevenue)}</div>
                </div>

                <div className="bg-gradient-to-r from-orange-50/60 to-amber-50/60 rounded-xl p-4 border border-orange-200/50">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Expenses</div>
                  <div className="text-lg font-bold text-orange-700">{formatCurrency(data.summary.totalExpenses)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        <div className="relative z-10 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Account Activity Distribution</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200/50">
              <div className="text-sm text-gray-600 font-semibold mb-2">High Activity</div>
              <div className="text-3xl font-bold text-red-600">{activityDistribution.high || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200/50">
              <div className="text-sm text-gray-600 font-semibold mb-2">Medium Activity</div>
              <div className="text-3xl font-bold text-orange-600">{activityDistribution.medium || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50">
              <div className="text-sm text-gray-600 font-semibold mb-2">Low Activity</div>
              <div className="text-3xl font-bold text-blue-600">{activityDistribution.low || 0}</div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200/50">
              <div className="text-sm text-gray-600 font-semibold mb-2">Dormant</div>
              <div className="text-3xl font-bold text-gray-600">{activityDistribution.dormant || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;