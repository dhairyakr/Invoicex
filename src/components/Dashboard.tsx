import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { formatDate } from '../utils/helpers';
import { sendEmailInvoice, sendWhatsAppInvoice } from '../utils/communication';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Copy, 
  Mail, 
  MessageCircle,
  Eye,
  Edit,
  Calendar,
  Tag,
  X,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    filteredInvoices, 
    deleteInvoice, 
    duplicateInvoice, 
    filters, 
    setFilters,
    invoices
  } = useInvoice();
  
  const [showFilters, setShowFilters] = useState(false);

  const getCurrencySymbol = (currency: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[currency as keyof typeof currencies] || '$';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} className="text-emerald-600" />;
      case 'sent': return <Clock size={14} className="text-blue-600" />;
      case 'overdue': return <AlertCircle size={14} className="text-red-600" />;
      default: return <XCircle size={14} className="text-gray-600" />;
    }
  };

  // Calculate dashboard statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'sent').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => {
      const subtotal = inv.items.reduce((s, item) => s + (item.quantity * item.rate), 0);
      let discountAmount = 0;
      if (inv.discountValue > 0) {
        discountAmount = inv.discountType === 'percentage' 
          ? (subtotal * inv.discountValue) / 100 
          : inv.discountValue;
      }
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (inv.taxRates || []).reduce((s, tax) => s + (afterDiscount * tax.rate) / 100, 0);
      return sum + (afterDiscount + taxAmount);
    }, 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => {
      const subtotal = inv.items.reduce((s, item) => s + (item.quantity * item.rate), 0);
      let discountAmount = 0;
      if (inv.discountValue > 0) {
        discountAmount = inv.discountType === 'percentage' 
          ? (subtotal * inv.discountValue) / 100 
          : inv.discountValue;
      }
      const afterDiscount = subtotal - discountAmount;
      const taxAmount = (inv.taxRates || []).reduce((s, tax) => s + (afterDiscount * tax.rate) / 100, 0);
      return sum + (afterDiscount + taxAmount);
    }, 0)
  };

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({ ...filters, status: status === filters.status ? '' : status });
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    setFilters({
      ...filters,
      dateRange: { ...filters.dateRange, [field]: value }
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      dateRange: { start: '', end: '' },
      tags: []
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateInvoice(id);
  };

  const handleEmailSend = (invoice: any) => {
    sendEmailInvoice(invoice, invoice.client.email);
  };

  const handleWhatsAppSend = (invoice: any) => {
    const phone = prompt('Enter WhatsApp number (with country code):');
    if (phone) {
      sendWhatsAppInvoice(invoice, phone);
    }
  };

  // Get all unique tags from invoices
  const allTags = Array.from(new Set(filteredInvoices.flatMap(inv => inv.tags)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-10 rounded-full transform -translate-x-32 translate-y-32"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Invoice Dashboard</h1>
                <p className="text-blue-100 text-lg">Manage your invoices with style and efficiency</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full lg:w-80 pl-12 pr-4 py-3 bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 rounded-xl text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center backdrop-blur-sm ${
                    showFilters 
                      ? 'bg-white bg-opacity-20 text-white border border-white border-opacity-30' 
                      : 'bg-white bg-opacity-10 text-blue-100 hover:bg-opacity-20 border border-white border-opacity-20'
                  }`}
                >
                  <Filter size={18} className="mr-2" />
                  Filters
                </button>
                
                {/* New Invoice Button */}
                <Link
                  to="/create"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center hover:bg-blue-50 hover:scale-105 transform shadow-lg"
                >
                  <Plus size={18} className="mr-2" /> 
                  New Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₹{stats.totalAmount.toFixed(0)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.paid}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-emerald-600 font-medium">₹{stats.paidAmount.toFixed(0)}</span>
              <span className="text-gray-500 ml-1">collected</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending + stats.overdue}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-red-600 font-medium">{stats.overdue}</span>
              <span className="text-gray-500 ml-1">overdue</span>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
              >
                <X size={16} className="mr-2" />
                Clear All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                <div className="flex flex-wrap gap-2">
                  {['draft', 'sent', 'paid', 'overdue'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filters.status === status
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
                <div className="space-y-3">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="End date"
                  />
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        const newTags = filters.tags.includes(tag)
                          ? filters.tags.filter(t => t !== tag)
                          : [...filters.tags, tag];
                        setFilters({ ...filters, tags: newTags });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        filters.tags.includes(tag)
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      }`}
                    >
                      <Tag size={12} className="inline mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Actions</label>
                <div className="space-y-2">
                  <Link
                    to="/templates"
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center text-sm font-medium"
                  >
                    <Zap size={16} className="mr-2" />
                    Browse Templates
                  </Link>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center text-sm font-medium">
                    <BarChart3 size={16} className="mr-2" />
                    Export Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredInvoices.length}</span> of <span className="font-bold">{invoices.length}</span> invoices
            </p>
            {(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Filtered
              </span>
            )}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                  ? 'No invoices match your filters'
                  : 'No invoices yet'
                }
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                  ? 'Try adjusting your search criteria or clear filters'
                  : 'Create your first invoice to get started with professional billing'
                }
              </p>
              {!(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
                <Link
                  to="/create"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform shadow-lg"
                >
                  <Plus size={20} className="mr-3" /> 
                  Create Your First Invoice
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredInvoices.map((invoice, index) => {
                    // Calculate total using the same logic as the context
                    const subtotal = invoice.items.reduce(
                      (sum, item) => sum + (item.quantity * item.rate),
                      0
                    );

                    let discountAmount = 0;
                    if (invoice.discountValue > 0) {
                      if (invoice.discountType === 'percentage') {
                        discountAmount = (subtotal * invoice.discountValue) / 100;
                      } else {
                        discountAmount = invoice.discountValue;
                      }
                    }

                    const afterDiscount = subtotal - discountAmount;

                    const taxAmount = (invoice.taxRates || []).reduce(
                      (sum, tax) => sum + (afterDiscount * tax.rate) / 100,
                      0
                    );

                    const total = afterDiscount + taxAmount;
                    const currencySymbol = getCurrencySymbol(invoice.currency || 'USD');

                    return (
                      <tr key={invoice.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                        <td className="px-6 py-6">
                          <div>
                            <div className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                              <Link to={`/edit/${invoice.id}`}>{invoice.number}</Link>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {invoice.tags.map(tag => (
                                <span key={tag} className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div>
                            <div className="font-semibold text-gray-900">{invoice.client.name || 'Unnamed Client'}</div>
                            <div className="text-sm text-gray-500">{invoice.client.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-6 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center text-gray-900">
                              <Calendar size={14} className="mr-2 text-gray-400" />
                              {formatDate(invoice.issueDate)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Due: {formatDate(invoice.dueDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="text-lg font-bold text-gray-900">
                            {currencySymbol}{total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/edit/${invoice.id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDuplicate(invoice.id)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Duplicate"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => handleEmailSend(invoice)}
                              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-all duration-200"
                              title="Send Email"
                            >
                              <Mail size={16} />
                            </button>
                            <button
                              onClick={() => handleWhatsAppSend(invoice)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-all duration-200"
                              title="Send WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;