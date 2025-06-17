import React, { useState, useEffect } from 'react';
import { Search, Package, Plus, ShoppingCart, X, Filter, Tag, Star, Sparkles, ArrowRight, Zap, Grid, List } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface ProductSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product, quantity: number) => void;
  currency?: string;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  currency = 'USD'
}) => {
  const { products, searchProducts, getProductsByCategory } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = Array.from(new Set(products.filter(p => p.isActive).map(p => p.category)));

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products.filter(p => p.isActive);

    if (searchQuery) {
      filtered = searchProducts(searchQuery);
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by currency if specified
    if (currency) {
      filtered = filtered.filter(p => p.currency === currency);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products, currency, searchProducts]);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToInvoice = () => {
    if (selectedProduct && quantity > 0) {
      onSelectProduct(selectedProduct, quantity);
      setSelectedProduct(null);
      setQuantity(1);
      onClose();
    }
  };

  const getCurrencySymbol = (curr: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[curr as keyof typeof currencies] || '$';
  };

  const getStockStatus = (stock?: number) => {
    if (stock === undefined) return { color: 'text-gray-400', bg: 'bg-gray-100', text: 'N/A', icon: '—' };
    if (stock === 0) return { color: 'text-red-500', bg: 'bg-red-100', text: 'Out of Stock', icon: '⚠️' };
    if (stock <= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Low Stock', icon: '⚡' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'In Stock', icon: '✅' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-25 animate-pulse"></div>
        
        {/* Main Container */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                {/* Animated Icon Container */}
                <div className="relative mr-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Select Product</h2>
                  <p className="text-blue-200 text-lg">Choose from your professional product database</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl group"
              >
                <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="mt-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    placeholder="Search products by name, description, or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300 text-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <option value="" className="bg-gray-800">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white/20 text-white shadow-lg' 
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center space-x-6 text-sm text-blue-200">
                <div className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span>{filteredProducts.length} products available</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span>{categories.length} categories</span>
                </div>
                {currency && (
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    <span>Currency: {currency}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex h-[600px]">
            {/* Product List */}
            <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <Package size={40} className="text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No products found</h3>
                  <p className="text-gray-600 text-lg">
                    {searchQuery || selectedCategory 
                      ? 'Try adjusting your search criteria or filters'
                      : 'Add products to your database to get started'
                    }
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className={`group relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
                          selectedProduct?.id === product.id
                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 ring-4 ring-blue-200 shadow-xl'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
                        }`}
                      >
                        {/* Product Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold">
                                {product.category}
                              </span>
                              {product.sku && (
                                <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                  {product.sku}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Stock Status */}
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color} flex items-center`}>
                            <span className="mr-1">{stockStatus.icon}</span>
                            {product.stock !== undefined ? product.stock : 'N/A'}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {product.description || 'No description available'}
                        </p>

                        {/* Price Section */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">per {product.unit}</p>
                          </div>
                          
                          {selectedProduct?.id === product.id && (
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                              <ArrowRight className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {product.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                +{product.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3">
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleProductSelect(product)}
                        className={`group flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                          selectedProduct?.id === product.id
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 ring-2 ring-blue-200'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {product.description || 'No description'}
                          </div>
                          
                          <div className="text-center">
                            <p className="font-bold text-lg text-gray-900">
                              {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">per {product.unit}</p>
                          </div>
                          
                          <div className="text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.bg} ${stockStatus.color}`}>
                              {stockStatus.icon} {product.stock !== undefined ? product.stock : 'N/A'}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            {selectedProduct?.id === product.id && (
                              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full inline-block">
                                <ArrowRight className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Details & Quantity Selector */}
            {selectedProduct && (
              <div className="w-96 border-l border-gray-200 bg-gradient-to-br from-white to-blue-50">
                <div className="p-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-6 flex-1">
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{selectedProduct.name}</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">{selectedProduct.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-500 font-medium">Category</p>
                          <p className="text-gray-900 font-semibold">{selectedProduct.category}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-500 font-medium">Unit</p>
                          <p className="text-gray-900 font-semibold">{selectedProduct.unit}</p>
                        </div>
                        {selectedProduct.sku && (
                          <div className="col-span-2 bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-500 font-medium">SKU</p>
                            <p className="text-gray-900 font-mono text-sm">{selectedProduct.sku}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-700 font-medium">Price per {selectedProduct.unit}</span>
                        <span className="text-3xl font-bold text-gray-900">
                          {getCurrencySymbol(selectedProduct.currency)}{selectedProduct.price.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          min="1"
                          max={selectedProduct.stock || undefined}
                        />
                        {selectedProduct.stock !== undefined && (
                          <p className="text-sm text-gray-500 mt-2 flex items-center">
                            <span className="mr-1">{getStockStatus(selectedProduct.stock).icon}</span>
                            {selectedProduct.stock} available in stock
                          </p>
                        )}
                      </div>

                      {/* Total Calculation */}
                      <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                        <div className="flex items-center justify-between text-xl font-bold">
                          <span className="text-gray-700">Total Amount</span>
                          <span className="text-blue-600">
                            {getCurrencySymbol(selectedProduct.currency)}{(selectedProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedProduct.tags.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          Product Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs font-semibold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add to Invoice Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleAddToInvoice}
                      className="w-full relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative px-6 py-4 flex items-center justify-center text-white font-bold text-lg">
                        <ShoppingCart className="mr-3 w-6 h-6" />
                        Add to Invoice
                        <Sparkles className="ml-3 w-6 h-6" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductSelector;