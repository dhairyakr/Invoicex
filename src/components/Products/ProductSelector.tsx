import React, { useState, useEffect } from 'react';
import { Search, Package, Plus, ShoppingCart, X, Filter, Tag } from 'lucide-react';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-25"></div>
        
        {/* Modal Content */}
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Select Product</h2>
                  <p className="text-gray-300 text-sm">Choose from your product database</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              >
                <option value="" className="bg-gray-800">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[600px]">
            {/* Product List */}
            <div className="flex-1 p-6 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
                  <p className="text-gray-400">
                    {searchQuery || selectedCategory 
                      ? 'Try adjusting your search or filters'
                      : 'Add products to your database first'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedProduct?.id === product.id
                          ? 'bg-blue-500/20 border-blue-400 ring-2 ring-blue-400/50'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-400">{product.category}</p>
                        </div>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {product.category}
                        </span>
                      </div>

                      <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-white">
                            {getCurrencySymbol(product.currency)}{product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">per {product.unit}</p>
                        </div>
                        {product.stock !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-gray-300">{product.stock}</p>
                            <p className="text-xs text-gray-400">in stock</p>
                          </div>
                        )}
                      </div>

                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {product.tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
                              +{product.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Quantity */}
            {selectedProduct && (
              <div className="w-80 border-l border-white/20 p-6 bg-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Product Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">{selectedProduct.name}</h4>
                    <p className="text-sm text-gray-300">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-white">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Unit</p>
                      <p className="text-white">{selectedProduct.unit}</p>
                    </div>
                    {selectedProduct.sku && (
                      <div className="col-span-2">
                        <p className="text-gray-400">SKU</p>
                        <p className="text-white font-mono text-xs">{selectedProduct.sku}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Price per {selectedProduct.unit}</span>
                      <span className="text-xl font-bold text-white">
                        {getCurrencySymbol(selectedProduct.currency)}{selectedProduct.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max={selectedProduct.stock || undefined}
                      />
                      {selectedProduct.stock !== undefined && (
                        <p className="text-xs text-gray-400 mt-1">
                          {selectedProduct.stock} available
                        </p>
                      )}
                    </div>

                    <div className="border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-300">Total</span>
                        <span className="text-white">
                          {getCurrencySymbol(selectedProduct.currency)}{(selectedProduct.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedProduct.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                          >
                            <Tag size={10} className="inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleAddToInvoice}
                    className="w-full relative group overflow-hidden mt-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative px-4 py-3 flex items-center justify-center text-white font-semibold">
                      <ShoppingCart className="mr-2" size={18} />
                      Add to Invoice
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;