import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, X, Check, Edit3, Package, Zap, ArrowRight, Archive, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';

interface QuickProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  unit: string;
  stock?: number;
  isNew?: boolean;
  isEditing?: boolean;
}

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'INR', symbol: '₹' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'JPY', symbol: '¥' },
];

const categories = [
  'Software', 'Hardware', 'Services', 'Consulting', 'Design',
  'Development', 'Marketing', 'Training', 'Support', 'Maintenance',
  'Products', 'Subscriptions', 'Other'
];

const units = [
  'piece', 'hour', 'day', 'week', 'month', 'year',
  'kg', 'gram', 'meter', 'foot', 'liter', 'box', 'pack', 'set'
];

const QuickAddTable: React.FC = () => {
  const { createProduct, products } = useProducts();
  const [quickProducts, setQuickProducts] = useState<QuickProduct[]>([]);
  const [saving, setSaving] = useState<string[]>([]);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Add a new empty row
  const addNewRow = () => {
    const newProduct: QuickProduct = {
      id: `temp-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      category: '',
      unit: 'piece',
      stock: undefined,
      isNew: true,
      isEditing: true,
    };
    setQuickProducts([...quickProducts, newProduct]);
    
    // Focus on the name input after a short delay
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  };

  // Save a product
  const saveProduct = async (product: QuickProduct) => {
    if (!product.name.trim() || !product.category.trim()) {
      alert('Please fill in at least the product name and category');
      return;
    }

    setSaving([...saving, product.id]);

    try {
      const { error } = await createProduct({
        name: product.name.trim(),
        description: product.description.trim(),
        price: product.price,
        currency: product.currency,
        category: product.category,
        sku: undefined,
        stock: product.stock,
        unit: product.unit,
        taxable: true,
        isActive: true,
        tags: [],
      });

      if (error) {
        alert('Error creating product: ' + error);
      } else {
        // Remove the product from quick add table
        setQuickProducts(quickProducts.filter(p => p.id !== product.id));
      }
    } catch (err) {
      alert('Error creating product');
    } finally {
      setSaving(saving.filter(id => id !== product.id));
    }
  };

  // Cancel editing
  const cancelEdit = (productId: string) => {
    setQuickProducts(quickProducts.filter(p => p.id !== productId));
  };

  // Update product field
  const updateProduct = (productId: string, field: keyof QuickProduct, value: any) => {
    setQuickProducts(quickProducts.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  // Handle Enter key to save
  const handleKeyPress = (e: React.KeyboardEvent, product: QuickProduct) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      saveProduct(product);
    }
  };

  // Get stock status color
  const getStockStatus = (stock?: number) => {
    if (stock === undefined) return { color: 'text-gray-500', bg: 'bg-gray-100/60', text: 'N/A' };
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-100/60', text: 'Out of Stock' };
    if (stock <= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-100/60', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100/60', text: 'In Stock' };
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return currency?.symbol || '$';
  };

  return (
    <div className="relative bg-white/25 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
      
      {/* Enhanced Header - Aero Glass */}
      <div className="relative bg-gradient-to-r from-purple-50/60 to-blue-50/60 backdrop-blur-sm p-8 border-b border-white/30">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/80 to-blue-500/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mr-6 border border-white/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Quick Add Products</h3>
                <p className="text-gray-700 text-lg">Add multiple products quickly with inventory tracking</p>
              </div>
            </div>
            <button
              onClick={addNewRow}
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transform hover:-translate-y-1 hover:scale-105 border border-white/30"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/90 to-blue-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <Plus size={20} className="mr-3 relative z-10" />
              <span className="relative z-10">Add Row</span>
              <Sparkles size={16} className="ml-2 relative z-10 opacity-75" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Tips - Aero Glass */}
      <div className="relative bg-blue-50/40 backdrop-blur-sm border-b border-white/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        <div className="relative z-10 flex items-center text-sm text-blue-800">
          <Package className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-semibold">Quick Tips:</span>
          <span className="ml-2">Fill in Name & Category (required) • Add Stock quantity to track inventory • Use Ctrl+Enter to save • Click ✓ to save individual rows</span>
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="relative z-10 overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50/60 to-purple-50/60 backdrop-blur-sm">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                Product Name *
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/5">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                Price
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                Currency
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                Category *
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-16">
                Unit
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                <div className="flex items-center">
                  <Archive size={14} className="mr-2" />
                  Stock
                </div>
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {quickProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-blue-500/30 w-20 h-20 rounded-full blur-2xl mx-auto"></div>
                      <div className="relative bg-gradient-to-br from-purple-100/60 to-blue-100/60 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl border border-white/50">
                        <Package size={40} className="text-purple-600" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-3">Ready to add products?</h4>
                    <p className="text-gray-700 mb-6 text-lg">Click "Add Row" to start adding products with inventory tracking</p>
                    <button
                      onClick={addNewRow}
                      className="relative inline-flex items-center px-6 py-3 bg-purple-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-purple-700/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                      <Plus size={18} className="mr-2 relative z-10" />
                      <span className="relative z-10">Add First Product</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              quickProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Product Name */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <input
                          ref={index === quickProducts.length - 1 ? nameInputRef : undefined}
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, product)}
                          className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base font-medium bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                          placeholder="Enter product name"
                        />
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <input
                          type="text"
                          value={product.description}
                          onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, product)}
                          className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                          placeholder="Brief description"
                        />
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold text-base z-10">
                            {getCurrencySymbol(product.currency)}
                          </span>
                          <input
                            type="number"
                            value={product.price || ''}
                            onChange={(e) => updateProduct(product.id, 'price', Number(e.target.value) || 0)}
                            onKeyPress={(e) => handleKeyPress(e, product)}
                            className="relative z-10 w-full pl-8 pr-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base font-bold text-gray-900 bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                            placeholder=""
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Currency */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <select
                          value={product.currency}
                          onChange={(e) => updateProduct(product.id, 'currency', e.target.value)}
                          className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <select
                          value={product.category}
                          onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                          className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                        <select
                          value={product.unit}
                          onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                          className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                          <input
                            type="number"
                            value={product.stock || ''}
                            onChange={(e) => updateProduct(product.id, 'stock', e.target.value ? Number(e.target.value) : undefined)}
                            onKeyPress={(e) => handleKeyPress(e, product)}
                            className="relative z-10 w-full px-4 py-3 border border-white/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/50 text-base bg-white/40 backdrop-blur-sm shadow-lg transition-all duration-300"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        {product.stock !== undefined && (
                          <div className={`text-xs px-3 py-1 rounded-full text-center backdrop-blur-sm border border-white/50 ${stockStatus.bg} ${stockStatus.color}`}>
                            {product.stock === 0 ? 'Out' : product.stock <= 5 ? 'Low' : 'OK'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => saveProduct(product)}
                          disabled={saving.includes(product.id)}
                          className="relative p-3 text-green-600 hover:text-green-800 hover:bg-green-100/60 backdrop-blur-sm rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                          title="Save product (Ctrl+Enter)"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                          {saving.includes(product.id) ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 relative z-10"></div>
                          ) : (
                            <Check size={18} className="relative z-10" />
                          )}
                        </button>
                        <button
                          onClick={() => cancelEdit(product.id)}
                          disabled={saving.includes(product.id)}
                          className="relative p-3 text-red-600 hover:text-red-800 hover:bg-red-100/60 backdrop-blur-sm rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
                          title="Cancel"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-xl"></div>
                          <X size={18} className="relative z-10" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Footer with bulk actions - Aero Glass */}
      {quickProducts.length > 0 && (
        <div className="relative bg-gray-50/40 backdrop-blur-sm px-8 py-6 border-t border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-sm text-gray-700 font-semibold">
              {quickProducts.length} product{quickProducts.length !== 1 ? 's' : ''} ready to save
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuickProducts([])}
                className="relative px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-200/60 backdrop-blur-sm rounded-2xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/50"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                <span className="relative z-10">Clear All</span>
              </button>
              <button
                onClick={async () => {
                  for (const product of quickProducts) {
                    if (product.name.trim() && product.category.trim()) {
                      await saveProduct(product);
                    }
                  }
                }}
                disabled={saving.length > 0}
                className="relative px-6 py-3 bg-green-600/80 backdrop-blur-sm text-white rounded-2xl hover:bg-green-700/90 transition-all duration-300 text-sm font-semibold disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-white/30"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
                <Save size={16} className="mr-2 relative z-10" />
                <span className="relative z-10">Save All Valid</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Stock Legend - Aero Glass */}
      <div className="relative bg-gray-50/40 backdrop-blur-sm px-8 py-4 border-t border-white/30">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
        <div className="relative z-10 flex items-center justify-center space-x-8 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100/60 backdrop-blur-sm rounded-full mr-3 border border-white/50"></div>
            <span className="text-gray-700 font-medium">{'In Stock (>5)'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100/60 backdrop-blur-sm rounded-full mr-3 border border-white/50"></div>
            <span className="text-gray-700 font-medium">Low Stock (1-5)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100/60 backdrop-blur-sm rounded-full mr-3 border border-white/50"></div>
            <span className="text-gray-700 font-medium">Out of Stock (0)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100/60 backdrop-blur-sm rounded-full mr-3 border border-white/50"></div>
            <span className="text-gray-700 font-medium">No Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddTable;