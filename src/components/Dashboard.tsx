import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { formatDate } from '../utils/helpers';
import { sendEmailInvoice, sendWhatsAppInvoice } from '../utils/communication';
import { FileText, Plus, Trash2, Search, Filter, Copy, Mail, MessageCircle, Eye, Edit, Calendar, Tag, X, TrendingUp, DollarSign, Clock, Users, BarChart3, ArrowUpRight, ArrowDownRight, CheckCircle, AlertCircle, XCircle, Zap, ChevronDown, Download, Layers, Box, Hexagon, Triangle, Square, Circle, Diamond, Star, Sparkles, Gem, Printer as Prism, Italic as Crystallize } from 'lucide-react';

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
      case 'paid': return 'bg-emerald-500/30 text-emerald-200 border-emerald-300/50 backdrop-blur-2xl shadow-2xl shadow-emerald-500/20';
      case 'sent': return 'bg-blue-500/30 text-blue-200 border-blue-300/50 backdrop-blur-2xl shadow-2xl shadow-blue-500/20';
      case 'overdue': return 'bg-red-500/30 text-red-200 border-red-300/50 backdrop-blur-2xl shadow-2xl shadow-red-500/20';
      default: return 'bg-gray-500/30 text-gray-200 border-gray-300/50 backdrop-blur-2xl shadow-2xl shadow-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={14} className="text-emerald-300 drop-shadow-lg" />;
      case 'sent': return <Clock size={14} className="text-blue-300 drop-shadow-lg" />;
      case 'overdue': return <AlertCircle size={14} className="text-red-300 drop-shadow-lg" />;
      default: return <XCircle size={14} className="text-gray-300 drop-shadow-lg" />;
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
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 60% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
        linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
      `
    }}>
      {/* Ultra-Lustrous Aero Glass Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-black/10"></div>
      <div className="absolute inset-0 backdrop-blur-3xl"></div>
      
      {/* Lustrous Glass Reflection Layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-white/5 via-transparent to-white/5"></div>
      
      {/* Enhanced Floating Isometric Elements with Lustrous Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Lustrous Isometric Shapes */}
        <div className="absolute top-20 left-10 transform rotate-12 opacity-30">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-3xl blur-2xl"></div>
            <Gem size={120} className="relative text-white/40 animate-pulse drop-shadow-2xl" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <div className="absolute top-40 right-20 transform -rotate-12 opacity-25">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-blue-600/30 rounded-full blur-xl"></div>
            <Prism size={80} className="relative text-cyan-300/50 animate-bounce drop-shadow-2xl" style={{ animationDuration: '6s' }} />
          </div>
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-45 opacity-35">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-2xl blur-xl"></div>
            <Diamond size={60} className="relative text-purple-300/60 animate-pulse drop-shadow-2xl" style={{ animationDuration: '3s' }} />
          </div>
        </div>
        <div className="absolute bottom-20 right-40 transform -rotate-45 opacity-30">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-red-600/30 rounded-3xl blur-2xl"></div>
            <Crystallize size={100} className="relative text-pink-300/50 animate-bounce drop-shadow-2xl" style={{ animationDuration: '5s' }} />
          </div>
        </div>
        
        {/* Small Lustrous Floating Elements */}
        <div className="absolute top-60 left-1/3 transform rotate-12 opacity-40">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-blue-600/40 rounded-full blur-lg"></div>
            <Circle size={40} className="relative text-cyan-300/70 animate-ping drop-shadow-xl" style={{ animationDuration: '2s' }} />
          </div>
        </div>
        <div className="absolute top-80 right-1/3 transform -rotate-12 opacity-35">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-600/40 rounded-lg blur-lg"></div>
            <Square size={35} className="relative text-yellow-300/60 animate-pulse drop-shadow-xl" style={{ animationDuration: '4s' }} />
          </div>
        </div>
        <div className="absolute bottom-60 left-1/2 transform rotate-45 opacity-45">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/40 to-emerald-600/40 rounded-full blur-xl"></div>
            <Star size={45} className="relative text-green-300/70 animate-spin drop-shadow-xl" style={{ animationDuration: '8s' }} />
          </div>
        </div>
        
        {/* Additional Lustrous Particles */}
        <div className="absolute top-32 right-1/4 opacity-20">
          <Sparkles size={25} className="text-white/60 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-25">
          <Sparkles size={30} className="text-blue-300/60 animate-pulse" style={{ animationDuration: '2.5s' }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Hero Header Section with Ultra-Lustrous Aero Glass */}
        <div className="relative overflow-hidden rounded-3xl mb-8 backdrop-blur-3xl bg-white/15 border border-white/30 shadow-2xl shadow-black/20">
          {/* Multiple Lustrous Glass Effect Layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/15 to-white/20"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/15"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
          
          {/* Enhanced Lustrous Glow Effects */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl transform -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/20 rounded-full blur-2xl transform -translate-x-32 -translate-y-32"></div>
          
          <div className="relative z-10 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center space-x-6">
                {/* Ultra-Lustrous Isometric Logo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-purple-600/40 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-white/10 rounded-3xl"></div>
                  <div className="relative bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-3xl p-6 rounded-3xl border border-white/40 shadow-2xl shadow-blue-500/20 group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                    <Layers size={48} className="relative text-white drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-5xl font-bold text-white drop-shadow-2xl mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    Invoice Dashboard
                  </h1>
                  <p className="text-white/90 text-xl drop-shadow-lg font-medium">Liquid Glass Interface • Ultra-Lustrous Vista Aero Design</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Ultra-Lustrous Aero Glass Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-white/20 rounded-2xl blur-lg group-hover:blur-sm transition-all duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/15 rounded-2xl"></div>
                  <div className="relative bg-white/15 backdrop-blur-3xl border border-white/40 rounded-2xl shadow-2xl shadow-blue-500/20 group-hover:shadow-3xl group-hover:shadow-purple-500/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 rounded-2xl"></div>
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 drop-shadow-lg" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={filters.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="relative w-full lg:w-80 pl-12 pr-4 py-4 bg-transparent text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/60 rounded-2xl drop-shadow-lg"
                    />
                  </div>
                </div>
                
                {/* Ultra-Lustrous Aero Glass Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative group px-6 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center backdrop-blur-3xl border shadow-2xl ${
                    showFilters 
                      ? 'bg-white/25 text-white border-white/50 shadow-blue-500/30' 
                      : 'bg-white/15 text-white/90 hover:bg-white/25 border-white/30 hover:border-white/50 shadow-purple-500/20 hover:shadow-blue-500/30'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/5 to-white/15 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl"></div>
                  <Filter size={18} className="mr-2 relative z-10 drop-shadow-lg" />
                  <span className="relative z-10 drop-shadow-lg">Filters</span>
                </button>
                
                {/* Ultra-Lustrous Aero Glass New Invoice Button */}
                <Link
                  to="/create"
                  className="relative group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center bg-gradient-to-r from-blue-500/40 to-purple-600/40 text-white hover:from-blue-500/50 hover:to-purple-600/50 border border-white/40 hover:border-white/60 backdrop-blur-3xl shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-purple-500/40 transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/10 to-white/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 rounded-2xl"></div>
                  <Plus size={18} className="mr-2 relative z-10 drop-shadow-lg" /> 
                  <span className="relative z-10 drop-shadow-lg">New Invoice</span>
                  <Sparkles size={16} className="ml-2 relative z-10 animate-pulse drop-shadow-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards with Ultra-Lustrous Aero Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Total Invoices',
              value: stats.total,
              icon: FileText,
              gradient: 'from-blue-500/40 to-cyan-500/40',
              glowColor: 'blue-500/30',
              change: '+12%',
              isPositive: true
            },
            {
              title: 'Total Revenue',
              value: `₹${stats.totalAmount.toFixed(0)}`,
              icon: DollarSign,
              gradient: 'from-emerald-500/40 to-green-500/40',
              glowColor: 'emerald-500/30',
              change: '+8%',
              isPositive: true
            },
            {
              title: 'Paid Invoices',
              value: stats.paid,
              icon: CheckCircle,
              gradient: 'from-purple-500/40 to-pink-500/40',
              glowColor: 'purple-500/30',
              change: `₹${stats.paidAmount.toFixed(0)} collected`,
              isPositive: true
            },
            {
              title: 'Pending',
              value: stats.pending + stats.overdue,
              icon: Clock,
              gradient: 'from-orange-500/40 to-red-500/40',
              glowColor: 'orange-500/30',
              change: `${stats.overdue} overdue`,
              isPositive: false
            }
          ].map((stat, index) => (
            <div key={index} className="relative group">
              {/* Enhanced Lustrous Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 group-hover:blur-xl transition-all duration-500`}></div>
              <div className={`absolute inset-0 bg-${stat.glowColor} rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-500`}></div>
              
              {/* Ultra-Lustrous Glass Card */}
              <div className="relative bg-white/15 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 group-hover:border-white/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/10 to-white/15 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm font-medium drop-shadow-lg">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-1 drop-shadow-2xl">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-2xl backdrop-blur-2xl border border-white/40 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl"></div>
                      <stat.icon className="relative w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-300 mr-1 drop-shadow-lg" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-300 mr-1 drop-shadow-lg" />
                    )}
                    <span className={`font-medium drop-shadow-lg ${stat.isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Advanced Filters Panel with Ultra-Lustrous Aero Glass */}
        {showFilters && (
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-white/25 to-white/15 rounded-3xl blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/15 rounded-3xl"></div>
            <div className="relative bg-white/15 backdrop-blur-3xl rounded-3xl p-6 border border-white/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/15 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white drop-shadow-2xl">Advanced Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-white/15 text-white/90 rounded-xl hover:bg-white/25 transition-all duration-200 flex items-center text-sm backdrop-blur-2xl border border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl"
                  >
                    <X size={16} className="mr-2 drop-shadow-lg" />
                    <span className="drop-shadow-lg">Clear All</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 drop-shadow-lg">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {['draft', 'sent', 'paid', 'overdue'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-2xl border shadow-xl ${
                            filters.status === status
                              ? 'bg-blue-500/40 text-white border-blue-300/60 shadow-blue-500/30'
                              : 'bg-white/15 text-white/80 hover:bg-white/25 border-white/30 hover:border-white/50 hover:shadow-2xl'
                          }`}
                        >
                          <span className="drop-shadow-lg">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 drop-shadow-lg">Date Range</label>
                    <div className="space-y-3">
                      <input
                        type="date"
                        value={filters.dateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                        className="w-full px-3 py-2 bg-white/15 backdrop-blur-2xl border border-white/30 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/60 shadow-xl focus:shadow-2xl transition-all duration-200"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                        className="w-full px-3 py-2 bg-white/15 backdrop-blur-2xl border border-white/30 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-white/60 shadow-xl focus:shadow-2xl transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 drop-shadow-lg">Tags</label>
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
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 backdrop-blur-2xl border shadow-lg ${
                            filters.tags.includes(tag)
                              ? 'bg-purple-500/40 text-white border-purple-300/60 shadow-purple-500/30'
                              : 'bg-white/15 text-white/80 hover:bg-white/25 border-white/30 hover:border-white/50 hover:shadow-xl'
                          }`}
                        >
                          <Tag size={12} className="inline mr-1 drop-shadow-lg" />
                          <span className="drop-shadow-lg">{tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-3 drop-shadow-lg">Quick Actions</label>
                    <div className="space-y-2">
                      <Link
                        to="/templates"
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-white rounded-xl hover:from-purple-500/50 hover:to-pink-500/50 transition-all duration-200 flex items-center justify-center text-sm font-medium backdrop-blur-2xl border border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl"
                      >
                        <Zap size={16} className="mr-2 drop-shadow-lg" />
                        <span className="drop-shadow-lg">Browse Templates</span>
                      </Link>
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500/40 to-teal-500/40 text-white rounded-xl hover:from-green-500/50 hover:to-teal-500/50 transition-all duration-200 flex items-center justify-center text-sm font-medium backdrop-blur-2xl border border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl">
                        <BarChart3 size={16} className="mr-2 drop-shadow-lg" />
                        <span className="drop-shadow-lg">Export Report</span>
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
            <p className="text-white/90 font-medium drop-shadow-2xl">
              Showing <span className="text-blue-200 font-bold drop-shadow-lg">{filteredInvoices.length}</span> of <span className="font-bold text-white drop-shadow-lg">{invoices.length}</span> invoices
            </p>
            {(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
              <span className="px-3 py-1 bg-blue-500/40 text-blue-100 rounded-full text-sm font-medium backdrop-blur-2xl border border-blue-300/50 shadow-xl shadow-blue-500/30">
                <span className="drop-shadow-lg">Filtered</span>
              </span>
            )}
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-white/15 rounded-3xl"></div>
            <div className="relative bg-white/15 backdrop-blur-3xl rounded-3xl p-16 text-center border border-white/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10 rounded-3xl"></div>
              
              <div className="relative z-10 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-blue-500/40 to-purple-500/40 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-blue-500/30">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full"></div>
                  <FileText size={48} className="relative text-white drop-shadow-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-2xl">
                  {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                    ? 'No invoices match your filters'
                    : 'No invoices yet'
                  }
                </h2>
                <p className="text-white/80 mb-8 text-lg drop-shadow-lg">
                  {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
                    ? 'Try adjusting your search criteria or clear filters'
                    : 'Create your first invoice to get started with professional billing'
                  }
                </p>
                {!(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
                  <Link
                    to="/create"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500/40 to-purple-600/40 text-white rounded-2xl font-semibold transition-all duration-300 hover:from-blue-500/50 hover:to-purple-600/50 hover:scale-105 transform backdrop-blur-2xl border border-white/40 hover:border-white/60 shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-purple-500/40"
                  >
                    <Plus size={20} className="mr-3 drop-shadow-lg" /> 
                    <span className="drop-shadow-lg">Create Your First Invoice</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/10 rounded-3xl blur-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/5 to-white/15 rounded-3xl"></div>
            <div className="relative bg-white/15 backdrop-blur-3xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-white/10"></div>
              
              <div className="relative z-10 overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-2xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Client
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Dates
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Total
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-white/90 uppercase tracking-wider drop-shadow-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
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
                        <tr key={invoice.id} className="hover:bg-white/10 transition-all duration-300 group">
                          <td className="px-6 py-6">
                            <div>
                              <div className="text-sm font-bold text-blue-200 hover:text-blue-100 transition-colors drop-shadow-lg">
                                <Link to={`/edit/${invoice.id}`}>{invoice.number}</Link>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {invoice.tags.map(tag => (
                                  <span key={tag} className="inline-block bg-purple-500/30 text-purple-100 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-xl border border-purple-300/40 shadow-lg shadow-purple-500/20">
                                    <span className="drop-shadow-lg">{tag}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div>
                              <div className="font-semibold text-white drop-shadow-lg">{invoice.client.name || 'Unnamed Client'}</div>
                              <div className="text-sm text-white/70 drop-shadow-lg">{invoice.client.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="relative">
                              <button
                                onClick={() => toggleStatusDropdown(invoice.id)}
                                className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border cursor-pointer hover:shadow-xl transition-all duration-200 ${getStatusColor(invoice.status)}`}
                              >
                                {getStatusIcon(invoice.status)}
                                <span className="ml-1 drop-shadow-lg">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                                <ChevronDown size={12} className="ml-1 drop-shadow-lg" />
                              </button>
                              
                              {statusDropdowns[invoice.id] && (
                                <div className="absolute top-full left-0 mt-1 bg-white/15 backdrop-blur-3xl border border-white/30 rounded-xl shadow-2xl z-10 min-w-[120px]">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-xl"></div>
                                  {['draft', 'sent', 'paid', 'overdue'].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(invoice.id, status)}
                                      className={`relative w-full text-left px-3 py-2 text-sm hover:bg-white/15 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                                        invoice.status === status ? 'bg-blue-500/30 text-blue-100 font-medium' : 'text-white/80'
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        {getStatusIcon(status)}
                                        <span className="ml-2 drop-shadow-lg">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
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
                                <Calendar size={14} className="mr-2 text-white/70 drop-shadow-lg" />
                                <span className="drop-shadow-lg">{formatDate(invoice.issueDate)}</span>
                              </div>
                              <div className="text-xs text-white/70 drop-shadow-lg">
                                Due: {formatDate(invoice.dueDate)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="text-lg font-bold text-white drop-shadow-2xl">
                              {currencySymbol}{total.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/edit/${invoice.id}`}
                                className="p-2 text-blue-200 hover:text-blue-100 hover:bg-blue-500/30 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-blue-300/50 shadow-lg hover:shadow-xl hover:shadow-blue-500/30"
                                title="Edit"
                              >
                                <Edit size={16} className="drop-shadow-lg" />
                              </Link>
                              <button
                                onClick={() => handleDuplicate(invoice.id)}
                                className="p-2 text-green-200 hover:text-green-100 hover:bg-green-500/30 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-green-300/50 shadow-lg hover:shadow-xl hover:shadow-green-500/30"
                                title="Duplicate"
                              >
                                <Copy size={16} className="drop-shadow-lg" />
                              </button>
                              <button
                                onClick={() => handleEmailSend(invoice)}
                                className="p-2 text-purple-200 hover:text-purple-100 hover:bg-purple-500/30 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-purple-300/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30"
                                title="📧 Send Email with PDF"
                              >
                                <Mail size={16} className="drop-shadow-lg" />
                              </button>
                              <button
                                onClick={() => handleWhatsAppSend(invoice)}
                                className="p-2 text-green-200 hover:text-green-100 hover:bg-green-500/30 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-green-300/50 shadow-lg hover:shadow-xl hover:shadow-green-500/30"
                                title="📱 Send WhatsApp with PDF"
                              >
                                <MessageCircle size={16} className="drop-shadow-lg" />
                              </button>
                              <button
                                onClick={() => deleteInvoice(invoice.id)}
                                className="p-2 text-red-200 hover:text-red-100 hover:bg-red-500/30 rounded-xl transition-all duration-200 backdrop-blur-xl border border-transparent hover:border-red-300/50 shadow-lg hover:shadow-xl hover:shadow-red-500/30"
                                title="Delete"
                              >
                                <Trash2 size={16} className="drop-shadow-lg" />
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