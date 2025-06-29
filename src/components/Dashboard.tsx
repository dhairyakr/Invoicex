import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useInvoice } from '../context/InvoiceContext';
import { formatDate } from '../utils/helpers';
import { sendEmailInvoice } from '../utils/communication';
import { exportToPDF } from '../utils/pdfExport';
import InvoicePreview from './InvoicePreview';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Copy, 
  Mail, 
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
  Zap,
  ChevronDown,
  Download,
  Sparkles,
  Star,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    filteredInvoices, 
    deleteInvoice, 
    duplicateInvoice, 
    updateInvoiceStatus,
    filters, 
    setFilters,
    invoices
  } = useInvoice();
  
  const [showFilters, setShowFilters] = useState(false);
  const [statusDropdowns, setStatusDropdowns] = useState<{[key: string]: boolean}>({});

  const getCurrencySymbol = (currency: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[currency as keyof typeof currencies] || '$';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100/60 backdrop-blur-sm text-emerald-800 border-emerald-300/50 shadow-emerald-200/50';
      case 'sent': return 'bg-blue-100/60 backdrop-blur-sm text-blue-800 border-blue-300/50 shadow-blue-200/50';
      case 'overdue': return 'bg-red-100/60 backdrop-blur-sm text-red-800 border-red-300/50 shadow-red-200/50';
      default: return 'bg-gray-100/60 backdrop-blur-sm text-gray-800 border-gray-300/50 shadow-gray-200/50';
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

  // Calculate dashboard statistics with proper currency handling
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
    navigate('/create');
  };

  const handleEmailSend = async (invoice: any) => {
    try {
      // Create a temporary container for rendering the invoice
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = 'auto';
      tempContainer.setAttribute('data-invoice-preview', 'true');
      document.body.appendChild(tempContainer);

      // Create a React root and render the InvoicePreview
      const root = createRoot(tempContainer);
      
      // Render the invoice preview
      root.render(React.createElement(InvoicePreview, { invoice }));
      
      // Wait for the component to render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        // Generate PDF from the temporary container
        const pdfBlob = await exportToPDF(tempContainer, `invoice-${invoice.number}.pdf`, true) as Blob;
        
        // Send email with the generated PDF
        await sendEmailInvoice(invoice, pdfBlob);
      } finally {
        // Clean up: unmount and remove the temporary container
        root.unmount();
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Error sending email. Please try again.');
    }
  };

  const toggleStatusDropdown = (invoiceId: string) => {
    setStatusDropdowns(prev => ({
      ...prev,
      [invoiceId]: !prev[invoiceId]
    }));
  };

  const handleStatusChange = (invoiceId: string, newStatus: string) => {
    updateInvoiceStatus(invoiceId, newStatus);
    setStatusDropdowns(prev => ({
      ...prev,
      [invoiceId]: false
    }));
  };

  // Get all unique tags from invoices
  const allTags = Array.from(new Set(filteredInvoices.flatMap(inv => inv.tags)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-white/60 to-purple-100/40 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Header Section - Aero Glass */}
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl rounded-[32px] p-12 mb-12 shadow-2xl shadow-blue-500/20 border border-white/40">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mr-6 border border-white/30">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">Invoice Dashboard</h1>
                    <p className="text-xl text-gray-700 font-medium">Manage your invoices with precision and style</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                {/* Enhanced Search Bar - Aero Glass */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg shadow-gray-500/20 hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                    <Search size={20} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors z-10" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="relative z-10 w-full lg:w-80 pl-14 pr-6 py-4 bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none text-lg font-medium"
                    />
                  </div>
                </div>
                
                {/* Enhanced Filter Toggle - Aero Glass */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative group overflow-hidden px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                    showFilters 
                      ? 'bg-blue-500/80 backdrop-blur-md text-white shadow-blue-500/30 border-white/30' 
                      : 'bg-white/40 backdrop-blur-md text-gray-700 hover:bg-white/50 shadow-gray-500/20 border-white/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${showFilters ? 'opacity-100' : ''}`}></div>
                  <Filter size={18} className="mr-3 relative z-10" />
                  <span className="relative z-10">Filters</span>
                </button>
                
                {/* Enhanced New Invoice Button - Aero Glass */}
                <Link
                  to="/create"
                  className="relative group overflow-hidden bg-gradient-to-r from-blue-600/80 to-indigo-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-1 hover:scale-105 border border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-indigo-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Plus size={20} className="mr-3 relative z-10" /> 
                  <span className="relative z-10">New Invoice</span>
                  <Sparkles size={16} className="ml-2 relative z-10 opacity-75" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards - Aero Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Invoices</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-blue-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <FileText className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Revenue</p>
                  <p className="text-4xl font-bold text-gray-900">Mixed</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/80 to-green-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Paid Invoices</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.paid}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-green-600 font-semibold">Mixed currencies</span>
                <span className="text-gray-600 ml-2">collected</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Pending</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.pending + stats.overdue}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/80 to-red-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-red-600 font-semibold">{stats.overdue}</span>
                <span className="text-gray-600 ml-2">overdue</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Advanced Filters Panel - Aero Glass */}
        {showFilters && (
          <div className="relative bg-white/25 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-gray-500/20 border border-white/50 mb-12">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-white/40 backdrop-blur-sm hover:bg-white/50 text-gray-700 rounded-2xl transition-all duration-300 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <X size={16} className="mr-2 relative z-10" />
                  <span className="relative z-10">Clear All</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Status</label>
                  <div className="flex flex-wrap gap-3">
                    {['draft', 'sent', 'paid', 'overdue'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusFilter(status)}
                        className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                          filters.status === status
                            ? 'bg-blue-600/80 backdrop-blur-sm text-white shadow-blue-500/30 border-white/30'
                            : 'bg-white/40 backdrop-blur-sm text-gray-700 hover:bg-white/50 shadow-gray-500/20 border-white/50'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                        <span className="relative z-10">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Date Range</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
                        placeholder="Start date"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
                        placeholder="End date"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Tags</label>
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
                        className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                          filters.tags.includes(tag)
                            ? 'bg-purple-600/80 backdrop-blur-sm text-white shadow-purple-500/30 border-white/30'
                            : 'bg-purple-100/60 backdrop-blur-sm text-purple-700 hover:bg-purple-200/60 shadow-purple-500/20 border-white/50'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-full"></div>
                        <Tag size={12} className="inline mr-1 relative z-10" />
                        <span className="relative z-10">{tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Quick Actions</label>
                  <div className="space-y-3">
                    <Link
                      to="/templates"
                      className="relative w-full px-6 py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm text-white rounded-2xl hover:from-purple-600/90 hover:to-pink-600/90 transition-all duration-300 flex items-center justify-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <Zap size={16} className="mr-2 relative z-10" />
                      <span className="relative z-10">Browse Templates</span>
                    </Link>
                    <button className="relative w-full px-6 py-3 bg-gradient-to-r from-green-500/80 to-teal-500/80 backdrop-blur-sm text-white rounded-2xl hover:from-green-600/90 hover:to-teal-600/90 transition-all duration-300 flex items-center justify-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <BarChart3 size={16} className="mr-2 relative z-10" />
                      <span className="relative z-10">Export Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <p className="text-gray-700 font-semibold text-lg">
              Showing <span className="text-blue-600 font-bold">{filteredInvoices.length}</span> of <span className="font-bold">{invoices.length}</span> invoices
            </p>
            {(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
              <span className="px-4 py-2 bg-blue-100/60 backdrop-blur-sm text-blue-800 rounded-full text-sm font-semibold shadow-lg border border-white/50">
                Filtered
              </span>
            )}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="relative bg-white/25 backdrop-blur-md rounded-3xl p-20 text-center shadow-2xl shadow-gray-500/20 border border-white/50">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
            <div className="relative z-10 max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 w-32 h-32 rounded-full blur-2xl mx-auto"></div>
                <div className="relative bg-gradient-to-br from-blue-100/60 to-purple-100/60 backdrop-blur-sm w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl border border-white/50">
                  <FileText size={64} className="text-blue-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                  ? 'No invoices match your filters'
                  : 'No invoices yet'
                }
              </h2>
              <p className="text-gray-700 mb-10 text-xl leading-relaxed">
                {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                  ? 'Try adjusting your search criteria or clear filters'
                  : 'Create your first invoice to get started with professional billing'
                }
              </p>
              {!(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
                <Link
                  to="/create"
                  className="relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:from-blue-700/90 hover:to-purple-700/90 hover:scale-105 transform shadow-xl hover:shadow-2xl border border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <Plus size={24} className="mr-3 relative z-10" /> 
                  <span className="relative z-10">Create Your First Invoice</span>
                  <Sparkles size={20} className="ml-3 relative z-10" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="relative z-10 overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm border-b border-white/30">
                  <tr>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-8 py-6 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
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
                      <tr key={invoice.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 group">
                        <td className="px-8 py-8">
                          <div>
                            <div className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors group-hover:scale-105 transform duration-300">
                              <Link to={`/edit/${invoice.id}`}>{invoice.number}</Link>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {invoice.tags.map(tag => (
                                <span key={tag} className="inline-block bg-purple-100/60 backdrop-blur-sm text-purple-700 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-white/50">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{invoice.client.name || 'Unnamed Client'}</div>
                            <div className="text-sm text-gray-600 mt-1">{invoice.client.email}</div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="relative">
                            <button
                              onClick={() => toggleStatusDropdown(invoice.id)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-bold rounded-2xl border cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${getStatusColor(invoice.status)}`}
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                              {getStatusIcon(invoice.status)}
                              <span className="ml-2 relative z-10">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                              <ChevronDown size={14} className="ml-2 relative z-10" />
                            </button>
                            
                            {statusDropdowns[invoice.id] && (
                              <div className="absolute top-full left-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl z-50 min-w-[140px]">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                                {['draft', 'sent', 'paid', 'overdue'].map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(invoice.id, status)}
                                    className={`relative z-10 w-full text-left px-4 py-3 text-sm hover:bg-white/30 transition-colors ${
                                      invoice.status === status ? 'bg-blue-50/60 text-blue-700 font-semibold' : 'text-gray-700'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {getStatusIcon(status)}
                                      <span className="ml-3">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-8 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-900 font-semibold">
                              <Calendar size={16} className="mr-3 text-gray-500" />
                              {formatDate(invoice.issueDate)}
                            </div>
                            <div className="text-xs text-gray-600 ml-7">
                              Due: {formatDate(invoice.dueDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="text-2xl font-bold text-gray-900">
                            {currencySymbol}{total.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/edit/${invoice.id}`}
                              className="relative p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                              title="Edit"
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                              <Edit size={18} className="relative z-10" />
                            </Link>
                            <button
                              onClick={() => handleDuplicate(invoice.id)}
                              className="relative p-3 text-green-600 hover:text-green-800 hover:bg-green-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                              title="Duplicate"
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                              <Copy size={18} className="relative z-10" />
                            </button>
                            <button
                              onClick={() => handleEmailSend(invoice)}
                              className="relative p-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                              title="📧 Send Email with PDF"
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                              <Mail size={18} className="relative z-10" />
                            </button>
                            <button
                              onClick={() => deleteInvoice(invoice.id)}
                              className="relative p-3 text-red-600 hover:text-red-800 hover:bg-red-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                              title="Delete"
                            >
                              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                              <Trash2 size={18} className="relative z-10" />
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