import React, { useState, useEffect } from 'react';
import { Clock, Users, CreditCard, Mail, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAgedReceivables } from '../../lib/supabase';

interface AgedReceivablesPayablesProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

const AgedReceivablesPayables: React.FC<AgedReceivablesPayablesProps> = ({ dateRange, viewPeriod, department }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'receivables' | 'payables'>('receivables');
  const [receivablesData, setReceivablesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReceivables = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      const result = await getAgedReceivables(user.id, dateRange.end);
      
      if (result.error) {
        setError(result.error);
      } else {
        const transformedData = result.data?.map((item: any) => ({
          customer: item.customer_name,
          current: item.current_amount,
          days30: item.days_30,
          days60: item.days_60,
          days90: item.days_90,
          total: item.total_amount,
          overdue: (item.days_30 + item.days_60 + item.days_90) > 0
        })) || [];
        setReceivablesData(transformedData);
      }
      
      setLoading(false);
    };

    loadReceivables();
  }, [user, dateRange.end, viewPeriod, department]);

  // Mock payables data (implement similar to receivables when needed)
  const mockPayables = [
    { vendor: 'Supplier A', current: 15000, days30: 8000, days60: 0, days90: 0, total: 23000, overdue: false },
    { vendor: 'Supplier B', current: 0, days30: 0, days60: 12000, days90: 3000, total: 15000, overdue: true },
    { vendor: 'Service Provider C', current: 22000, days30: 0, days60: 0, days90: 0, total: 22000, overdue: false },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotals = (data: typeof mockReceivables) => {
    return data.reduce((acc, item) => ({
      current: acc.current + item.current,
      days30: acc.days30 + item.days30,
      days60: acc.days60 + item.days60,
      days90: acc.days90 + item.days90,
      total: acc.total + item.total
    }), { current: 0, days30: 0, days60: 0, days90: 0, total: 0 });
  };

  const receivablesTotals = calculateTotals(receivablesData);
  const payablesTotals = calculateTotals(mockPayables);

  const renderAgingTable = (
    tableData: any[],
    totals: any,
    type: 'receivables' | 'payables'
  ) => (
    <>
      {loading && (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && (
    <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
      
      {/* Table Header */}
      <div className="relative bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm p-6 border-b border-white/30">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
              type === 'receivables' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {type === 'receivables' ? (
                <TrendingUp className="w-5 h-5 text-white" />
              ) : (
                <CreditCard className="w-5 h-5 text-white" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              Aged {type === 'receivables' ? 'Receivables' : 'Payables'}
            </h3>
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
              <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                {type === 'receivables' ? 'Customer' : 'Vendor'}
              </th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Current</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">1-30 Days</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">31-60 Days</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">61-90 Days</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">&gt;90 Days</th>
              <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
              <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {tableData.map((item, index) => (
              <tr key={index} className={`hover:bg-gradient-to-r transition-all duration-300 group ${
                item.overdue 
                  ? 'hover:from-red-50/30 hover:to-pink-50/30 bg-red-50/20' 
                  : 'hover:from-blue-50/30 hover:to-purple-50/30'
              }`}>
                <td className="px-8 py-6">
                  <div className="flex items-center">
                    {item.overdue && (
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {type === 'receivables' ? item.customer : (item as any).vendor}
                      </div>
                      {item.overdue && (
                        <div className="text-xs text-red-600 font-medium">Overdue</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-right font-semibold text-gray-900">
                  {item.current > 0 ? formatCurrency(item.current) : '—'}
                </td>
                <td className="px-8 py-6 text-right font-semibold text-gray-900">
                  {item.days30 > 0 ? formatCurrency(item.days30) : '—'}
                </td>
                <td className="px-8 py-6 text-right font-semibold text-yellow-600">
                  {item.days60 > 0 ? formatCurrency(item.days60) : '—'}
                </td>
                <td className="px-8 py-6 text-right font-semibold text-red-600">
                  {item.days90 > 0 ? formatCurrency(item.days90) : '—'}
                </td>
                <td className="px-8 py-6 text-right font-bold text-lg text-gray-900">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-8 py-6 text-center">
                  {type === 'receivables' && (
                    <button className="relative px-4 py-2 bg-blue-600/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-700/90 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
                      <Mail size={14} className="mr-1 relative z-10" />
                      <span className="relative z-10">Remind</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm border-t border-white/30">
            <tr>
              <td className="px-8 py-6 font-bold text-gray-900 text-lg">Total</td>
              <td className="px-8 py-6 text-right font-bold text-xl text-gray-900">{formatCurrency(totals.current)}</td>
              <td className="px-8 py-6 text-right font-bold text-xl text-gray-900">{formatCurrency(totals.days30)}</td>
              <td className="px-8 py-6 text-right font-bold text-xl text-yellow-600">{formatCurrency(totals.days60)}</td>
              <td className="px-8 py-6 text-right font-bold text-xl text-red-600">{formatCurrency(totals.days90)}</td>
              <td className="px-8 py-6 text-right font-bold text-2xl text-gray-900">{formatCurrency(totals.total)}</td>
              <td className="px-8 py-6"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
      )}
    </>
  );

  return (
    <div className="space-y-8">
      {/* Tab Toggle */}
      <div className="flex items-center justify-center">
        <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
          <button
            onClick={() => setActiveTab('receivables')}
            className={`relative px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'receivables'
                ? 'bg-green-500/80 backdrop-blur-sm text-white shadow-lg'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
            <span className="relative z-10 flex items-center">
              <TrendingUp size={20} className="mr-3" />
              Receivables
            </span>
          </button>
          <button
            onClick={() => setActiveTab('payables')}
            className={`relative px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              activeTab === 'payables'
                ? 'bg-red-500/80 backdrop-blur-sm text-white shadow-lg'
                : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-lg"></div>
            <span className="relative z-10 flex items-center">
              <CreditCard size={20} className="mr-3" />
              Payables
            </span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Current</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(activeTab === 'receivables' ? receivablesTotals.current : payablesTotals.current)}
            </p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">1-30 Days</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(activeTab === 'receivables' ? receivablesTotals.days30 : payablesTotals.days30)}
            </p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">31-60 Days</p>
            <p className="text-2xl font-bold text-yellow-600">
              {formatCurrency(activeTab === 'receivables' ? receivablesTotals.days60 : payablesTotals.days60)}
            </p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">&gt;60 Days</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(activeTab === 'receivables' ? receivablesTotals.days90 : payablesTotals.days90)}
            </p>
          </div>
        </div>
      </div>

      {/* Aging Table */}
      {activeTab === 'receivables' 
        ? renderAgingTable(receivablesData, receivablesTotals, 'receivables')
        : renderAgingTable(mockPayables as any, payablesTotals, 'payables')
      }

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="relative group overflow-hidden bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-indigo-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <Mail size={20} className="mr-3 relative z-10" />
          <span className="relative z-10">Send Bulk Reminders</span>
        </button>
        
        <button className="relative group overflow-hidden bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/90 to-emerald-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          <FileText size={20} className="mr-3 relative z-10" />
          <span className="relative z-10">Export Aging Report</span>
        </button>
      </div>
    </div>
  );
};

export default AgedReceivablesPayables;