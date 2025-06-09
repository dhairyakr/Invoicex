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
  X
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    filteredInvoices, 
    deleteInvoice, 
    duplicateInvoice, 
    filters, 
    setFilters 
  } = useInvoice();
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getCurrencySymbol = (currency: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[currency as keyof typeof currencies] || '$';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    setSelectedTags([]);
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
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search and Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 lg:w-80">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-md font-medium transition duration-200 flex items-center ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter size={18} className="mr-2" />
            Filters
          </button>
          
          {/* New Invoice Button */}
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-200 flex items-center whitespace-nowrap"
          >
            <Plus size={18} className="mr-1" /> New Invoice
          </Link>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['draft', 'sent', 'paid', 'overdue'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.status === status
                        ? 'bg-blue-600 text-white'
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newTags = filters.tags.includes(tag)
                        ? filters.tags.filter(t => t !== tag)
                        : [...filters.tags, tag];
                      setFilters({ ...filters, tags: newTags });
                    }}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Tag size={12} className="inline mr-1" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <X size={16} className="mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredInvoices.length} of {filteredInvoices.length} invoices
        </p>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
              ? 'No invoices match your filters'
              : 'No invoices yet'
            }
          </h2>
          <p className="text-gray-500 mb-6">
            {filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0
              ? 'Try adjusting your search criteria'
              : 'Create your first invoice to get started'
            }
          </p>
          {!(filters.search || filters.status || filters.dateRange.start || filters.tags.length > 0) && (
            <Link
              to="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition duration-200 flex items-center"
            >
              <Plus size={18} className="mr-2" /> Create Invoice
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => {
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
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-blue-600">
                            <Link to={`/edit/${invoice.id}`}>{invoice.number}</Link>
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.tags.map(tag => (
                              <span key={tag} className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs mr-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{invoice.client.name || 'Unnamed Client'}</div>
                          <div className="text-xs text-gray-500">{invoice.client.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(invoice.issueDate)}
                          </div>
                          <div className="text-xs text-gray-400">
                            Due: {formatDate(invoice.dueDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {currencySymbol}{total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/edit/${invoice.id}`}
                            className="text-blue-600 hover:text-blue-800 transition duration-200 p-1"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(invoice.id)}
                            className="text-green-600 hover:text-green-800 transition duration-200 p-1"
                            title="Duplicate"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => handleEmailSend(invoice)}
                            className="text-purple-600 hover:text-purple-800 transition duration-200 p-1"
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            onClick={() => handleWhatsAppSend(invoice)}
                            className="text-green-600 hover:text-green-800 transition duration-200 p-1"
                            title="Send WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-800 transition duration-200 p-1"
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
  );
};

export default Dashboard;