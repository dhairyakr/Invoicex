import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Edit, 
  Trash2, 
  Tag, 
  DollarSign,
  BarChart3,
  Grid,
  List,
  Eye,
  EyeOff,
  TrendingUp,
  ShoppingCart,
  Star,
  AlertCircle,
  CheckCircle,
  X,
  Zap,
  Table,
  Sparkles,
  Activity,
  Archive
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';
import ProductForm from './ProductForm';
import QuickAddTable from './QuickAddTable';

const ProductManager: React.FC = () => {
  const {
    filteredProducts,
    filters,
    setFilters,
    loading,
    error,
    deleteProduct,
    products
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'quick'>('quick');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories and tags
  const categories = Array.from(new Set(products.map(p => p.category)));
  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));

  // Calculate statistics with proper currency handling
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0),
    categories: categories.length,
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const { error } = await deleteProduct(id);
      if (error) {
        alert('Error deleting product: ' + error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getCurrencySymbol = (currency: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[currency as keyof typeof currencies] || '$';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-white/60 to-purple-100/40 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center bg-white/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="relative z-10">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-700 text-xl font-semibold">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 via-white/60 to-purple-100/40 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header - Aero Glass */}
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mr-6 border border-white/30">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">Product Database</h1>
                    <p className="text-xl text-gray-700 font-medium">Manage your products and services efficiently</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 min-w-0">
                {/* Enhanced Search Bar - Aero Glass */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg shadow-gray-500/20 hover:shadow-xl hover:shadow-gray-500/25 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                    <Search size={20} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-purple-600 transition-colors z-10" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="relative z-10 w-full lg:w-80 pl-14 pr-6 py-4 bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none text-lg font-medium"
                    />
                  </div>
                </div>
                
                {/* Enhanced Filter Toggle - Aero Glass */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative group overflow-hidden px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                    showFilters 
                      ? 'bg-purple-500/80 backdrop-blur-md text-white shadow-purple-500/30 border-white/30' 
                      : 'bg-white/40 backdrop-blur-md text-gray-700 hover:bg-white/50 shadow-gray-500/20 border-white/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/80 to-blue-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${showFilters ? 'opacity-100' : ''}`}></div>
                  <Filter size={18} className="mr-3 relative z-10" />
                  <span className="relative z-10">Filters</span>
                </button>
                
                {/* Enhanced Add Product Button - Aero Glass */}
                <button
                  onClick={() => setShowForm(true)}
                  className="relative group overflow-hidden bg-gradient-to-r from-purple-600/80 to-indigo-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 hover:scale-105 border border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-indigo-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <Plus size={20} className="mr-3 relative z-10" /> 
                  <span className="relative z-10">Add Product</span>
                  <Sparkles size={16} className="ml-2 relative z-10 opacity-75" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Statistics Cards - Aero Glass */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Products</p>
                  <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-blue-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <Package className="w-8 h-8 text-white" />
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
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Active</p>
                  <p className="text-4xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Inactive</p>
                  <p className="text-4xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <EyeOff className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Categories</p>
                  <p className="text-4xl font-bold text-purple-600">{stats.categories}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/30 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Value</p>
                  <p className="text-3xl font-bold text-indigo-600">Mixed</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/80 to-blue-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Advanced Filters - Aero Glass */}
        {showFilters && (
          <div className="relative bg-white/25 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-gray-500/20 border border-white/50 mb-12">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={() => setFilters({
                    search: '',
                    category: '',
                    priceRange: { min: 0, max: 10000 },
                    tags: [],
                    isActive: true,
                  })}
                  className="px-6 py-3 bg-white/40 backdrop-blur-sm hover:bg-white/50 text-gray-700 rounded-2xl transition-all duration-300 flex items-center text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <X size={16} className="mr-2 relative z-10" />
                  <span className="relative z-10">Clear All</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Category</label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Price Range</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <input
                        type="number"
                        placeholder="Min price"
                        value={filters.priceRange.min}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                        })}
                        className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <input
                        type="number"
                        placeholder="Max price"
                        value={filters.priceRange.max}
                        onChange={(e) => setFilters({
                          ...filters,
                          priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                        })}
                        className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Status</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFilters({ ...filters, isActive: true })}
                      className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                        filters.isActive
                          ? 'bg-green-600/80 backdrop-blur-sm text-white shadow-green-500/30 border-white/30'
                          : 'bg-white/40 backdrop-blur-sm text-gray-700 hover:bg-white/50 shadow-gray-500/20 border-white/50'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <span className="relative z-10">Active</span>
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, isActive: false })}
                      className={`relative px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border ${
                        !filters.isActive
                          ? 'bg-red-600/80 backdrop-blur-sm text-white shadow-red-500/30 border-white/30'
                          : 'bg-white/40 backdrop-blur-sm text-gray-700 hover:bg-white/50 shadow-gray-500/20 border-white/50'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <span className="relative z-10">Inactive</span>
                    </button>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Tags</label>
                  <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
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
              </div>
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <p className="text-gray-700 font-semibold text-lg">
              Showing <span className="text-purple-600 font-bold">{filteredProducts.length}</span> of <span className="font-bold">{products.length}</span> products
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-2 border border-white/50 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
              <button
                onClick={() => setViewMode('quick')}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'quick' ? 'bg-purple-600/80 backdrop-blur-sm text-white shadow-lg' : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                }`}
                title="Quick Add Table"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <Table size={20} className="relative z-10" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-purple-600/80 backdrop-blur-sm text-white shadow-lg' : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                }`}
                title="Grid View"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <Grid size={20} className="relative z-10" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`relative p-3 rounded-xl transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-purple-600/80 backdrop-blur-sm text-white shadow-lg' : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                }`}
                title="List View"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                <List size={20} className="relative z-10" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="relative bg-red-50/60 backdrop-blur-md border border-red-200/50 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
            <div className="relative z-10 flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === 'quick' ? (
          <div className="space-y-8">
            {/* Quick Add Table */}
            <QuickAddTable />
            
            {/* Existing Products Summary - Only show if there are products */}
            {products.length > 0 && (
              <div className="relative bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 p-8">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Existing Products</h3>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setViewMode('grid')}
                        className="relative px-6 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-purple-700/90 transition-all duration-300 text-sm font-semibold flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                        <Grid size={16} className="mr-2 relative z-10" />
                        <span className="relative z-10">View All</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.slice(0, 6).map((product) => (
                      <div key={product.id} className="relative p-6 border border-white/50 rounded-2xl hover:border-purple-300/50 transition-all duration-300 bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.isActive ? 'bg-green-100/60 backdrop-blur-sm text-green-800 border border-white/50' : 'bg-red-100/60 backdrop-blur-sm text-red-800 border border-white/50'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{product.category}</p>
                          <p className="text-xl font-bold text-gray-900">
                            {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {products.length > 6 && (
                    <div className="text-center mt-6">
                      <button
                        onClick={() => setViewMode('grid')}
                        className="text-purple-600 hover:text-purple-800 font-semibold text-lg transition-colors"
                      >
                        View all {products.length} products →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="relative bg-white/25 backdrop-blur-md rounded-3xl p-20 text-center shadow-2xl shadow-gray-500/20 border border-white/50">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl"></div>
            <div className="relative z-10 max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 w-32 h-32 rounded-full blur-2xl mx-auto"></div>
                <div className="relative bg-gradient-to-br from-purple-100/60 to-blue-100/60 backdrop-blur-sm w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-xl border border-white/50">
                  <Package size={64} className="text-purple-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {filters.search || filters.category || filters.tags.length > 0
                  ? 'No products match your filters'
                  : 'No products yet'
                }
              </h2>
              <p className="text-gray-700 mb-10 text-xl leading-relaxed">
                {filters.search || filters.category || filters.tags.length > 0
                  ? 'Try adjusting your search criteria or clear filters'
                  : 'Create your first product to start building your database'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setViewMode('quick')}
                  className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:from-purple-700/90 hover:to-blue-700/90 hover:scale-105 transform shadow-xl hover:shadow-2xl border border-white/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <Zap size={20} className="mr-3 relative z-10" /> 
                  <span className="relative z-10">Quick Add Products</span>
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="relative inline-flex items-center px-8 py-4 bg-white/40 backdrop-blur-sm border-2 border-purple-600/50 text-purple-600 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-purple-50/60 hover:scale-105 transform shadow-lg hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                  <Plus size={20} className="mr-3 relative z-10" /> 
                  <span className="relative z-10">Detailed Form</span>
                </button>
              </div>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white/30 backdrop-blur-md rounded-3xl shadow-xl shadow-gray-500/20 border border-white/50 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      {product.sku && (
                        <p className="text-xs text-gray-500 font-mono">SKU: {product.sku}</p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/50 ${
                      product.isActive 
                        ? 'bg-green-100/60 text-green-800' 
                        : 'bg-red-100/60 text-red-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-6 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600">per {product.unit}</p>
                    </div>
                    {product.stock !== undefined && (
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{product.stock}</p>
                        <p className="text-xs text-gray-600">in stock</p>
                      </div>
                    )}
                  </div>

                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-100/60 backdrop-blur-sm text-purple-700 rounded-full text-xs font-semibold border border-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100/60 backdrop-blur-sm text-gray-600 rounded-full text-xs border border-white/50">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="relative flex-1 px-4 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-purple-700/90 transition-all duration-300 text-sm font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <Edit size={16} className="mr-2 relative z-10" />
                      <span className="relative z-10">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="relative px-4 py-3 bg-red-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-red-700/90 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <Trash2 size={16} className="relative z-10" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
            <div className="relative z-10 overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50/60 to-purple-50/60 backdrop-blur-sm border-b border-white/30">
                  <tr>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-8 py-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-6 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/30">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gradient-to-r hover:from-purple-50/30 hover:to-blue-50/30 transition-all duration-300 group">
                      <td className="px-8 py-8">
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.description}</div>
                          {product.sku && (
                            <div className="text-xs text-gray-500 font-mono">SKU: {product.sku}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="px-4 py-2 bg-purple-100/60 backdrop-blur-sm text-purple-800 rounded-full text-sm font-semibold border border-white/50">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="font-bold text-gray-900 text-lg">
                          {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">per {product.unit}</div>
                      </td>
                      <td className="px-8 py-8">
                        {product.stock !== undefined ? (
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/50 ${
                            product.stock > 10 
                              ? 'bg-green-100/60 text-green-800'
                              : product.stock > 0
                              ? 'bg-yellow-100/60 text-yellow-800'
                              : 'bg-red-100/60 text-red-800'
                          }`}>
                            {product.stock}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-8 py-8">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/50 ${
                          product.isActive 
                            ? 'bg-green-100/60 text-green-800' 
                            : 'bg-red-100/60 text-red-800'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="relative p-3 text-purple-600 hover:text-purple-800 hover:bg-purple-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                            title="Edit"
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                            <Edit size={18} className="relative z-10" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="relative p-3 text-red-600 hover:text-red-800 hover:bg-red-100/60 backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                            title="Delete"
                          >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                            <Trash2 size={18} className="relative z-10" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default ProductManager;