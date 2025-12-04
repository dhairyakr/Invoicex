import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, CreditCard, Mail, AlertTriangle, FileDown, BarChart3, Eye, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAgedReceivables } from '../../lib/supabase';
import {
  AgingData,
  calculateAgingMetrics,
  assessCustomerRisk,
  getAgingDistributionData,
  getTopOverdueCustomers,
  formatCurrency,
  formatPercentage,
  getRiskColor,
  getRiskBorderColor,
  calculatePriorityScore
} from '../../utils/agingAnalytics';
import { AgingDistributionChart, AgingPieChart, DSOTrendChart } from './AgingCharts';
import CustomerVendorProfile from './CustomerVendorProfile';
import PaymentRecordModal, { PaymentData } from './PaymentRecordModal';
import ReminderModal, { ReminderData } from './ReminderModal';
import AgingFilters, { FilterOptions } from './AgingFilters';

interface AgedReceivablesPayablesProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
  onRefresh?: () => void;
}

const EnhancedAgedReceivablesPayables: React.FC<AgedReceivablesPayablesProps> = ({
  dateRange,
  viewPeriod,
  department,
  onRefresh
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'receivables' | 'payables'>('receivables');
  const [viewMode, setViewMode] = useState<'table' | 'analytics'>('table');
  const [receivablesData, setReceivablesData] = useState<AgingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<AgingData | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    riskLevels: [],
    agingBuckets: [],
    amountRange: { min: 0, max: 10000000 },
    collectionStatus: [],
    sortBy: 'total',
    sortOrder: 'desc'
  });

  const mockPayables: AgingData[] = [
    { customer: 'Supplier A', current: 15000, days30: 8000, days60: 0, days90: 0, total: 23000, overdue: true, email: 'supplier-a@example.com', phone: '+91-9876543210' },
    { customer: 'Supplier B', current: 0, days30: 0, days60: 12000, days90: 3000, total: 15000, overdue: true, email: 'supplier-b@example.com', phone: '+91-9876543211' },
    { customer: 'Service Provider C', current: 22000, days30: 0, days60: 0, days90: 0, total: 22000, overdue: false, email: 'service-c@example.com', phone: '+91-9876543212' },
  ];

  useEffect(() => {
    loadReceivables();
  }, [user, dateRange.end, viewPeriod, department]);

  const loadReceivables = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const result = await getAgedReceivables(user.id, dateRange.end);

    if (result.error) {
      setError(result.error);
      setReceivablesData([]);
    } else {
      const transformedData: AgingData[] = result.data?.map((item: any) => ({
        customer: item.customer_name,
        current: item.current_amount || 0,
        days30: item.days_30 || 0,
        days60: item.days_60 || 0,
        days90: item.days_90 || 0,
        total: item.total_amount || 0,
        overdue: (item.days_30 + item.days_60 + item.days_90) > 0,
        email: item.email || '',
        phone: item.phone || ''
      })) || [];
      setReceivablesData(transformedData);
    }

    setLoading(false);
  };

  const currentData = activeTab === 'receivables' ? receivablesData : mockPayables;

  const filteredData = useMemo(() => {
    let data = [...currentData];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      data = data.filter(item => item.customer.toLowerCase().includes(searchLower));
    }

    if (filters.riskLevels.length > 0) {
      data = data.filter(item => {
        const risk = assessCustomerRisk(item);
        return filters.riskLevels.includes(risk.rating);
      });
    }

    if (filters.agingBuckets.length > 0) {
      data = data.filter(item => {
        return filters.agingBuckets.some(bucket => {
          if (bucket === 'current' && item.current > 0) return true;
          if (bucket === 'days30' && item.days30 > 0) return true;
          if (bucket === 'days60' && item.days60 > 0) return true;
          if (bucket === 'days90' && item.days90 > 0) return true;
          return false;
        });
      });
    }

    data = data.filter(item =>
      item.total >= filters.amountRange.min &&
      item.total <= filters.amountRange.max
    );

    data.sort((a, b) => {
      let aVal = 0, bVal = 0;
      switch (filters.sortBy) {
        case 'customer':
          return filters.sortOrder === 'asc'
            ? a.customer.localeCompare(b.customer)
            : b.customer.localeCompare(a.customer);
        case 'total':
          aVal = a.total;
          bVal = b.total;
          break;
        case 'overdue':
          aVal = a.days30 + a.days60 + a.days90;
          bVal = b.days30 + b.days60 + b.days90;
          break;
        case 'days90':
          aVal = a.days90;
          bVal = b.days90;
          break;
      }
      return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [currentData, filters]);

  const metrics = useMemo(() => calculateAgingMetrics(filteredData), [filteredData]);
  const chartData = useMemo(() => getAgingDistributionData(filteredData), [filteredData]);
  const topOverdue = useMemo(() => getTopOverdueCustomers(filteredData, 5), [filteredData]);

  const dsoTrendData = [
    { month: 'Jan', dso: 45, amount: 250000 },
    { month: 'Feb', dso: 42, amount: 280000 },
    { month: 'Mar', dso: 48, amount: 260000 },
    { month: 'Apr', dso: 44, amount: 290000 },
    { month: 'May', dso: 41, amount: 310000 },
    { month: 'Jun', dso: 39, amount: 330000 },
  ];

  const toggleRow = (customer: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(customer)) {
      newExpanded.delete(customer);
    } else {
      newExpanded.add(customer);
    }
    setExpandedRows(newExpanded);
  };

  const toggleSelection = (customer: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(customer)) {
      newSelected.delete(customer);
    } else {
      newSelected.add(customer);
    }
    setSelectedRows(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(item => item.customer)));
    }
  };

  const handleViewProfile = (data: AgingData) => {
    setSelectedCustomer(data);
    setShowProfileModal(true);
  };

  const handleRecordPayment = (data: AgingData) => {
    setSelectedCustomer(data);
    setShowPaymentModal(true);
  };

  const handleSendReminder = (data: AgingData) => {
    setSelectedCustomer(data);
    setShowReminderModal(true);
  };

  const handlePaymentSave = async (paymentData: PaymentData) => {
    console.log('Payment recorded:', paymentData);
    await loadReceivables();
  };

  const handleReminderSend = async (reminderData: ReminderData) => {
    console.log('Reminder sent:', reminderData);
  };

  const handleBulkReminder = () => {
    console.log('Sending reminders to', selectedRows.size, 'customers');
  };

  const handleExport = () => {
    console.log('Exporting aging report...');
  };

  const calculateTotals = (data: AgingData[]) => {
    return data.reduce((acc, item) => ({
      current: acc.current + item.current,
      days30: acc.days30 + item.days30,
      days60: acc.days60 + item.days60,
      days90: acc.days90 + item.days90,
      total: acc.total + item.total
    }), { current: 0, days30: 0, days60: 0, days90: 0, total: 0 });
  };

  const totals = calculateTotals(filteredData);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading aging data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
            <button
              onClick={() => setActiveTab('receivables')}
              className={`relative px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'receivables'
                  ? 'bg-green-500/80 backdrop-blur-sm text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
              }`}
            >
              <TrendingUp size={18} className="inline mr-2" />
              Receivables
            </button>
            <button
              onClick={() => setActiveTab('payables')}
              className={`relative px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'payables'
                  ? 'bg-red-500/80 backdrop-blur-sm text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
              }`}
            >
              <CreditCard size={18} className="inline mr-2" />
              Payables
            </button>
          </div>

          <div className="relative bg-white/30 backdrop-blur-md rounded-xl p-1 border border-white/50 shadow-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`relative px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                viewMode === 'table'
                  ? 'bg-blue-500/80 backdrop-blur-sm text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`relative px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                viewMode === 'analytics'
                  ? 'bg-blue-500/80 backdrop-blur-sm text-white shadow-lg'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/30'
              }`}
            >
              <BarChart3 size={18} className="inline mr-2" />
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Outstanding</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalReceivables)}</p>
            <p className="text-xs text-gray-600 mt-1">{filteredData.length} accounts</p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Overdue</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(metrics.totalOverdue)}</p>
            <p className="text-xs text-red-600 mt-1 font-semibold">{formatPercentage(metrics.overduePercentage)} of total</p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">DSO</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.dso.toFixed(0)} days</p>
            <p className="text-xs text-gray-600 mt-1">Days Sales Outstanding</p>
          </div>
        </div>

        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Collection Rate</p>
            <p className="text-3xl font-bold text-green-600">{formatPercentage(metrics.collectionRate)}</p>
            <p className="text-xs text-gray-600 mt-1">Current period</p>
          </div>
        </div>
      </div>

      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgingDistributionChart data={chartData} />
          <AgingPieChart data={chartData} />
          <div className="lg:col-span-2">
            <DSOTrendChart data={dsoTrendData} />
          </div>

          {topOverdue.length > 0 && (
            <div className="lg:col-span-2 relative bg-white/40 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Overdue Accounts</h3>
                <div className="space-y-3">
                  {topOverdue.map((item, index) => {
                    const risk = assessCustomerRisk(item);
                    return (
                      <div
                        key={item.customer}
                        className={`flex items-center justify-between p-4 bg-white rounded-2xl border-2 ${getRiskBorderColor(risk.rating)} hover:shadow-lg transition-all cursor-pointer`}
                        onClick={() => handleViewProfile(item)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.customer}</p>
                            <p className="text-sm text-gray-600">
                              Overdue: {formatCurrency(item.days30 + item.days60 + item.days90)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(risk.rating)}`}>
                            {risk.rating.toUpperCase()}
                          </span>
                          <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(item.total)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === 'table' && (
        <>
          <AgingFilters
            onFilterChange={setFilters}
            totalCount={currentData.length}
            filteredCount={filteredData.length}
          />

          {selectedRows.size > 0 && (
            <div className="relative bg-blue-50 backdrop-blur-md rounded-2xl p-4 border border-blue-200 shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-blue-900 font-semibold">
                  {selectedRows.size} account(s) selected
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkReminder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Send Reminders
                  </button>
                  <button
                    onClick={() => setSelectedRows(new Set())}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>

            <div className="relative z-10 overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50/40 to-blue-50/40 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {activeTab === 'receivables' ? 'Customer' : 'Vendor'}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Current</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">1-30 Days</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">31-60 Days</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">60+ Days</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-8 py-12 text-center">
                        <FileDown className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No records found matching your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => {
                      const risk = assessCustomerRisk(item);
                      const isExpanded = expandedRows.has(item.customer);
                      const isSelected = selectedRows.has(item.customer);

                      return (
                        <React.Fragment key={item.customer}>
                          <tr className={`hover:bg-gradient-to-r transition-all duration-300 group ${
                            item.overdue
                              ? 'hover:from-red-50/30 hover:to-pink-50/30'
                              : 'hover:from-blue-50/30 hover:to-purple-50/30'
                          } ${isSelected ? 'bg-blue-50/30' : ''}`}>
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelection(item.customer)}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleRow(item.customer)}
                                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                {item.overdue && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {item.customer}
                                  </div>
                                  {item.overdue && (
                                    <div className="text-xs text-red-600 font-medium">Overdue Payment</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                              {item.current > 0 ? formatCurrency(item.current) : '—'}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-blue-600">
                              {item.days30 > 0 ? formatCurrency(item.days30) : '—'}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-yellow-600">
                              {item.days60 > 0 ? formatCurrency(item.days60) : '—'}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-red-600">
                              {item.days90 > 0 ? formatCurrency(item.days90) : '—'}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-lg text-gray-900">
                              {formatCurrency(item.total)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${getRiskColor(risk.rating)}`}>
                                {risk.rating.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewProfile(item)}
                                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all"
                                  title="View Profile"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleSendReminder(item)}
                                  className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg transition-all"
                                  title="Send Reminder"
                                >
                                  <Mail size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-gray-50/50">
                              <td colSpan={9} className="px-6 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">Contact Information</p>
                                    <p className="text-sm text-gray-600">Email: {item.email || 'Not available'}</p>
                                    <p className="text-sm text-gray-600">Phone: {item.phone || 'Not available'}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">Risk Assessment</p>
                                    <p className="text-sm text-gray-600">Score: {risk.score}/100</p>
                                    <p className="text-sm text-gray-600">{risk.recommendation}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
                <tfoot className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 backdrop-blur-sm border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={2} className="px-8 py-6 font-bold text-gray-900 text-lg">Total</td>
                    <td className="px-6 py-6 text-right font-bold text-xl text-gray-900">{formatCurrency(totals.current)}</td>
                    <td className="px-6 py-6 text-right font-bold text-xl text-blue-600">{formatCurrency(totals.days30)}</td>
                    <td className="px-6 py-6 text-right font-bold text-xl text-yellow-600">{formatCurrency(totals.days60)}</td>
                    <td className="px-6 py-6 text-right font-bold text-xl text-red-600">{formatCurrency(totals.days90)}</td>
                    <td className="px-6 py-6 text-right font-bold text-2xl text-gray-900">{formatCurrency(totals.total)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {selectedRows.size > 0 ? (
              <button
                onClick={handleBulkReminder}
                className="relative group overflow-hidden bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
              >
                <Mail size={20} className="mr-3" />
                Send Reminders to {selectedRows.size} Selected
              </button>
            ) : (
              <button
                onClick={handleBulkReminder}
                className="relative group overflow-hidden bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
              >
                <Mail size={20} className="mr-3" />
                Send Bulk Reminders
              </button>
            )}

            <button
              onClick={handleExport}
              className="relative group overflow-hidden bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
            >
              <FileDown size={20} className="mr-3" />
              Export Aging Report
            </button>
          </div>
        </>
      )}

      {selectedCustomer && (
        <>
          <CustomerVendorProfile
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            data={selectedCustomer}
            type={activeTab === 'receivables' ? 'customer' : 'vendor'}
            riskAssessment={assessCustomerRisk(selectedCustomer)}
            onRecordPayment={() => {
              setShowProfileModal(false);
              setShowPaymentModal(true);
            }}
            onSendReminder={() => {
              setShowProfileModal(false);
              setShowReminderModal(true);
            }}
          />

          <PaymentRecordModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            customerName={selectedCustomer.customer}
            totalOutstanding={selectedCustomer.total}
            onSave={handlePaymentSave}
          />

          <ReminderModal
            isOpen={showReminderModal}
            onClose={() => setShowReminderModal(false)}
            customerName={selectedCustomer.customer}
            customerEmail={selectedCustomer.email}
            totalOutstanding={selectedCustomer.total}
            daysOverdue={Math.max(
              selectedCustomer.days30 > 0 ? 30 : 0,
              selectedCustomer.days60 > 0 ? 60 : 0,
              selectedCustomer.days90 > 0 ? 90 : 0
            )}
            onSend={handleReminderSend}
          />
        </>
      )}
    </div>
  );
};

export default EnhancedAgedReceivablesPayables;
