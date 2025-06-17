import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Zap,
  ChevronDown,
  Download,
  Layers,
  Box,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Diamond,
  Star,
  Sparkles
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
      case 'paid': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30 backdrop-blur-xl';
      case 'sent': return 'bg-blue-500/20 text-blue-300 border-blue-400/30 backdrop-blur-xl';
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-400/30 backdrop-blur-xl';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30 backdrop-blur-xl';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} className="text-emerald-400" />;
      case 'sent': return <Clock size={14} className="text-blue-400" />;
      case 'overdue': return <AlertCircle size={14} className="text-red-400" />;
      default: return <XCircle size={14} className="text-gray-400" />;
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
    navigate('/create');
  };

  const handleEmailSend = async (invoice: any) => {
    if (!invoice.client.email) {
      alert('❌ No email address found for this client. Please add an email address first.');
      return;
    }
    await sendEmailInvoice(invoice, invoice.client.email);
  };

  const handleWhatsAppSend = async (invoice: any) => {
    const phone = prompt('📱 Enter WhatsApp number (with country code):\n\nExample: +1234567890');
    if (phone) {
      await sendWhatsAppInvoice(invoice, phone);
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
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      `
    }}>
      {/* Aero Glass Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>
      
      {/* Floating Isometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Isometric Shapes */}
        <div className="absolute top-20 left-10 transform rotate-12 opacity-20">
          <Box size={120} className="text-white/30 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute top-40 right-20 transform -rotate-12 opacity-15">
          <Hexagon size={80} className="text-blue-300/40 animate-bounce" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-45 opacity-25">
          <Diamond size={60} className="text-purple-300/50 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute bottom-20 right-40 transform -rotate-45 opacity-20">
          <Triangle size={100} className="text-pink-300/40 animate-bounce" style={{ animationDuration: '5s' }} />
        </div>
        
        {/* Small Floating Elements */}
        <div className="absolute top-60 left-1/3 transform rotate-12 opacity-30">
          <Circle size={40} className="text-cyan-300/60 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div className="absolute top-80 right-1/3 transform -rotate-12 opacity-25">
          <Square size={35} className="text-yellow-300/50 animate-pulse" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute bottom-60 left-1/2 transform rotate-45 opacity-35">
          <Star size={45} className="text-green-300/60 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Hero Header Section with Aero Glass */}
        <div className="relative overflow-hidden rounded-3xl mb-8 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl">
          {/* Glass Effect Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
          
          {/* Subtle Glow Effects */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-6">
                {/* Isometric Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-2xl blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/30 shadow-2xl">
                    <Layers size={48} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2">
                    Invoice Dashboard
                  </h1>
                  <p className="text-white/80 text-xl drop-shadow-lg">Liquid Glass Interface • Vista Aero Design</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Aero Glass Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-sm"></div>
                  <div className="relative bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full lg:w-80 pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-2xl"
                    />
                  </div>
                </div>
                
                {/* Aero Glass Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative group px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center ${
                    showFilters 
                      ? 'bg-white/20 text-white border border-white/40 shadow-2xl' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20 hover:border-white/40'
                  } backdrop-blur-2xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
                  <Filter size={18} className="mr-2 relative z-10" />
                  <span className="relative z-10">Filters</span>
                </button>
                
                {/* Aero Glass New Invoice Button */}
                <Link
                  to="/create"
                  className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-white hover:from-blue-500/40 hover:to-purple-600/40 border border-white/30 hover:border-white/50 backdrop-blur-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus size={18} className="mr-2 relative z-10" /> 
                  <span className="relative z-10">New Invoice</span>
                  <Sparkles size={16} className="ml-2 relative z-10 animate-pulse" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards with Aero Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Invoices',
              value: stats.total,
              icon: FileText,
              gradient: 'from-blue-500/30 to-cyan-500/30',
              change: '+12%',
              isPositive: true
            },
            {
              title: 'Total Revenue',
              value: `₹${stats.totalAmount.toFixed(0)}`,
              icon: DollarSign,
              gradient: 'from-emerald-500/30 to-green-500/30',
              change: '+8%',
              isPositive: true
            },
            {
              title: 'Paid Invoices',
              value: stats.paid,
              icon: CheckCircle,
              gradient: 'from-purple-500/30 to-pink-500/30',
              change: `₹${stats.paidAmount.toFixed(0)} collected`,
              isPositive: true
            },
            {
              title: 'Pending',
              value: stats.pending + stats.overdue,
              icon: Clock,
              gradient: 'from-orange-500/30 to-red-500/30',
              change: `${stats.overdue} overdue`,
              isPositive: false
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              
              {/* Glass Card */}
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/70 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-1 drop-shadow-lg">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-2xl backdrop-blur-xl border border-white/30 shadow-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                    )}
                    <span className={`font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters Panel with Aero Glass */}
        {showFilters && (
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white drop-shadow-lg">Advanced Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-white/10 text-white/80 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center text-sm backdrop-blur-xl border border-white/20"
                  >
                    <X size={16} className="mr-2" />
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['draft', 'sent', 'paid', 'overdue'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-xl border ${
                            filters.status === status
                              ? 'bg-blue-500/30 text-white border-blue-400/50 shadow-lg'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/20 hover:border-white/40'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Date Range</label>
                    <div className="space-y-3">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/50"
                      />
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Tags</label>
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
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-xl border ${
                            filters.tags.includes(tag)
                              ? 'bg-purple-500/30 text-white border-purple-400/50'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/20 hover:border-white/40'
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
                    <label className="block text-sm font-medium text-white/80 mb-3">Quick Actions</label>
                    <div className="space-y-2">
                      <Link
                        to="/templates"
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white rounded-xl hover:from-purple-500/40 hover:to-pink-500/40 transition-all duration-200 flex items-center justify-center text-sm font-medium backdrop-blur-xl border border-white/20"
                      >
                        <Zap size={16} className="mr-2" />
                        Browse Templates
                      </Link>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500/30 to-teal-500/30 text-white rounded-xl hover:from-green-500/40 hover:to-teal-500/40 transition-all duration-200 flex items-center justify-center text-sm font-medium backdrop-blur-xl border border-white/20">
                        <BarChart3 size={16} className="mr-2" />
                        Export Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-white/80 font-medium drop-shadow-lg">
              Showing <span className="text-blue-300 font-bold">{filteredInvoices.length}</span> of <span className="font-bold text-white">{invoices.length}</span> invoices
            </p>
            {(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
              <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-sm font-medium backdrop-blur-xl border border-blue-400/30">
                Filtered
              </span>
            )}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-16 text-center border border-white/20 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-3xl"></div>
              
              <div className="relative z-10 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-500/30 to-purple-500/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-2xl">
                  <FileText size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
                  {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                    ? 'No invoices match your filters'
                    : 'No invoices yet'
                  }
                </h2>
                <p className="text-white/70 mb-8 text-lg drop-shadow-lg">
                  {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                    ? 'Try adjusting your search criteria or clear filters'
                    : 'Create your first invoice to get started with professional billing'
                  }
                </p>
                {!(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
                  <Link
                    to="/create"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/30 to-purple-600/30 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-blue-500/40 hover:to-purple-600/40 hover:scale-105 transform backdrop-blur-2xl border border-white/30 shadow-2xl"
                  >
                    <Plus size={20} className="mr-3" /> 
                    Create Your First Invoice
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
              
              <div className="relative z-10 overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-white/80 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
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
                        <tr key={invoice.id} className="hover:bg-white/5 transition-all duration-200 group">
                          <td className="px-6 py-6">
                            <div>
                              <div className="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors drop-shadow-lg">
                                <Link to={`/edit/${invoice.id}`}>{invoice.number}</Link>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {invoice.tags.map(tag => (
                                  <span key={tag} className="inline-block bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-xl border border-purple-400/30">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div>
                              <div className="font-semibold text-white drop-shadow-lg">{invoice.client.name || 'Unnamed Client'}</div>
                              <div className="text-sm text-white/60">{invoice.client.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="relative">
                              <button
                                onClick={() => toggleStatusDropdown(invoice.id)}
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer hover:shadow-lg transition-all duration-200 ${getStatusColor(invoice.status)}`}
                              >
                                {getStatusIcon(invoice.status)}
                                <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                                <ChevronDown size={12} className="ml-1" />
                              </button>
                              
                              {statusDropdowns[invoice.id] && (
                                <div className="absolute top-full left-0 mt-1 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl z-10 min-w-[120px]">
                                  {['draft', 'sent', 'paid', 'overdue'].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(invoice.id, status)}
                                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                                        invoice.status === status ? 'bg-blue-500/20 text-blue-200 font-medium' : 'text-white/70'
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        {getStatusIcon(status)}
                                        <span className="ml-2">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center text-white drop-shadow-lg">
                                <Calendar size={14} className="mr-2 text-white/60" />
                                {formatDate(invoice.issueDate)}
                              </div>
                              <div className="text-xs text-white/60">
                                Due: {formatDate(invoice.dueDate)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="text-lg font-bold text-white drop-shadow-lg">
                              {currencySymbol}{total.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/edit/${invoice.id}`}
                                className="p-2 text-blue-300 hover:text-blue-200 hover:bg-blue-500/20 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-blue-400/30"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => handleDuplicate(invoice.id)}
                                className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-green-400/30"
                                title="Duplicate"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => handleEmailSend(invoice)}
                                className="p-2 text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-purple-400/30"
                                title="📧 Send Email with PDF"
                              >
                                <Mail size={16} />
                              </button>
                              <button
                                onClick={() => handleWhatsAppSend(invoice)}
                                className="p-2 text-green-300 hover:text-green-200 hover:bg-green-500/20 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-green-400/30"
                                title="📱 Send WhatsApp with PDF"
                              >
                                <MessageCircle size={16} />
                              </button>
                              <button
                                onClick={() => deleteInvoice(invoice.id)}
                                className="p-2 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-red-400/30"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;