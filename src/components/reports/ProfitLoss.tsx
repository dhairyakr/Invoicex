import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, ArrowUpRight, ArrowDownRight, BarChart3, PieChart } from 'lucide-react';

interface ProfitLossProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

const ProfitLoss: React.FC<ProfitLossProps> = ({ dateRange, viewPeriod, department }) => {
  // Mock data - replace with actual data from Supabase
  const mockData = {
    totalRevenue: 125000,
    totalExpenses: 87500,
    netProfit: 37500,
    revenueGrowth: 12.5,
    expenseGrowth: 8.3,
    profitMargin: 30,
    accounts: [
      { name: 'Product Sales', category: 'Revenue', amount: 95000, percentage: 76, variance: 15.2 },
      { name: 'Service Revenue', category: 'Revenue', amount: 30000, percentage: 24, variance: 8.7 },
      { name: 'Cost of Goods Sold', category: 'COGS', amount: -45000, percentage: 36, variance: -5.2 },
      { name: 'Salaries & Benefits', category: 'Operating Expenses', amount: -25000, percentage: 20, variance: 3.1 },
      { name: 'Marketing', category: 'Operating Expenses', amount: -12500, percentage: 10, variance: -12.8 },
      { name: 'Office Expenses', category: 'Operating Expenses', amount: -5000, percentage: 4, variance: 2.3 },
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600';
    if (variance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <ArrowUpRight size={16} className="text-green-600" />;
    if (variance < 0) return <ArrowDownRight size={16} className="text-red-600" />;
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(mockData.totalRevenue)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/80 to-green-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight size={16} className="text-green-600 mr-2" />
              <span className="text-green-600 font-semibold">+{mockData.revenueGrowth}%</span>
              <span className="text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Expenses</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(mockData.totalExpenses)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ArrowUpRight size={16} className="text-red-600 mr-2" />
              <span className="text-red-600 font-semibold">+{mockData.expenseGrowth}%</span>
              <span className="text-gray-600 ml-2">vs last period</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Net Profit</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(mockData.netProfit)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center text-sm">
              <Percent size={16} className="text-blue-600 mr-2" />
              <span className="text-blue-600 font-semibold">{mockData.profitMargin}%</span>
              <span className="text-gray-600 ml-2">profit margin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main P&L Table */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
        
        {/* Table Header */}
        <div className="relative bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm p-6 border-b border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Profit & Loss Statement</h3>
            </div>
            <div className="text-sm text-gray-600">
              Period: {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="relative z-10 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50/40 to-blue-50/40 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Account Name</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">This Period</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">% of Revenue</th>
                <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {mockData.accounts.map((account, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group cursor-pointer">
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-4 ${
                        account.category === 'Revenue' ? 'bg-green-500' :
                        account.category === 'COGS' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-500">{account.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`font-bold text-lg ${account.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {account.amount >= 0 ? '' : '-'}{formatCurrency(account.amount)}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="font-semibold text-gray-700">{account.percentage}%</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className={`flex items-center justify-end font-semibold ${getVarianceColor(account.variance)}`}>
                      {getVarianceIcon(account.variance)}
                      <span className="ml-1">{Math.abs(account.variance)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="relative bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm p-6 border-t border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="text-lg font-semibold text-gray-700">Net Profit</div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(mockData.netProfit)}</div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Revenue vs Expenses Trend</h3>
          </div>
          <div className="h-64 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Chart visualization will be implemented here</p>
              <p className="text-gray-500 text-sm">Using Recharts or Chart.js for interactive charts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;