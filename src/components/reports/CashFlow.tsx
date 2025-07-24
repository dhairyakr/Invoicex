import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, DollarSign } from 'lucide-react';

interface CashFlowProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

const CashFlow: React.FC<CashFlowProps> = ({ dateRange, viewPeriod, department }) => {
  // Mock data - replace with actual data from Supabase
  const mockData = {
    openingCash: 85000,
    operating: [
      { description: 'Cash from Sales', amount: 125000, type: 'inflow' },
      { description: 'Cash paid to Suppliers', amount: -45000, type: 'outflow' },
      { description: 'Salaries and Benefits', amount: -25000, type: 'outflow' },
      { description: 'Operating Expenses', amount: -15000, type: 'outflow' }
    ],
    investing: [
      { description: 'Equipment Purchase', amount: -20000, type: 'outflow' },
      { description: 'Investment Income', amount: 5000, type: 'inflow' }
    ],
    financing: [
      { description: 'Loan Proceeds', amount: 30000, type: 'inflow' },
      { description: 'Loan Repayment', amount: -10000, type: 'outflow' },
      { description: 'Dividends Paid', amount: -8000, type: 'outflow' }
    ]
  };

  const operatingTotal = mockData.operating.reduce((sum, item) => sum + item.amount, 0);
  const investingTotal = mockData.investing.reduce((sum, item) => sum + item.amount, 0);
  const financingTotal = mockData.financing.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;
  const closingCash = mockData.openingCash + netCashFlow;

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
    items: typeof mockData.operating, 
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
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockData.openingCash)}</p>
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
          mockData.operating,
          operatingTotal,
          <Activity className="w-5 h-5 text-white" />,
          'from-blue-500 to-indigo-500'
        )}
        
        {renderCashFlowSection(
          'Investing Activities',
          mockData.investing,
          investingTotal,
          <TrendingUp className="w-5 h-5 text-white" />,
          'from-purple-500 to-violet-500'
        )}
        
        {renderCashFlowSection(
          'Financing Activities',
          mockData.financing,
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
                <span className="font-bold text-gray-900">{formatCurrency(mockData.openingCash)}</span>
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