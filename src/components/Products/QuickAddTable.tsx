import React, { useState, useRef, useEffect } from 'react';
import { Plus, Save, X, Check, Edit3, Package, Zap, ArrowRight, Archive } from 'lucide-react';
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
    if (stock === undefined) return { color: 'text-gray-400', bg: 'bg-gray-100', text: 'N/A' };
    if (stock === 0) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Out of Stock' };
    if (stock <= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'In Stock' };
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quick Add Products</h3>
              <p className="text-gray-600 text-sm">Add multiple products quickly with inventory tracking</p>
            </div>
          </div>
          <button
            onClick={addNewRow}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transform shadow-lg"
          >
            <Plus size={18} className="mr-2" />
            Add Row
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <div className="flex items-center text-sm text-blue-800">
          <Package className="w-4 h-4 mr-2" />
          <span className="font-medium">Quick Tips:</span>
          <span className="ml-2">Fill in Name & Category (required) • Add Stock quantity to track inventory • Use Ctrl+Enter to save • Click ✓ to save individual rows</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Product Name *
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                Currency
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Category *
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                Unit
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                <div className="flex items-center">
                  <Archive size={14} className="mr-1" />
                  Stock
                </div>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quickProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Package size={32} className="text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to add products?</h4>
                    <p className="text-gray-600 mb-4">Click "Add Row" to start adding products with inventory tracking</p>
                    <button
                      onClick={addNewRow}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Add First Product
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              quickProducts.map((product, index) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors">
                    {/* Product Name */}
                    <td className="px-4 py-3">
                      <input
                        ref={index === quickProducts.length - 1 ? nameInputRef : undefined}
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Enter product name"
                      />
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={product.description}
                        onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Brief description"
                      />
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.price}
                        onChange={(e) => updateProduct(product.id, 'price', Number(e.target.value))}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </td>

                    {/* Currency */}
                    <td className="px-4 py-3">
                      <select
                        value={product.currency}
                        onChange={(e) => updateProduct(product.id, 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.code}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <select
                        value={product.category}
                        onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Unit */}
                    <td className="px-4 py-3">
                      <select
                        value={product.unit}
                        onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <input
                          type="number"
                          value={product.stock || ''}
                          onChange={(e) => updateProduct(product.id, 'stock', e.target.value ? Number(e.target.value) : undefined)}
                          onKeyPress={(e) => handleKeyPress(e, product)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="0"
                          min="0"
                        />
                        {product.stock !== undefined && (
                          <div className={`text-xs px-2 py-1 rounded-full text-center ${stockStatus.bg} ${stockStatus.color}`}>
                            {product.stock === 0 ? 'Out' : product.stock <= 5 ? 'Low' : 'OK'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => saveProduct(product)}
                          disabled={saving.includes(product.id)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Save product (Ctrl+Enter)"
                        >
                          {saving.includes(product.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => cancelEdit(product.id)}
                          disabled={saving.includes(product.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancel"
                        >
                          <X size={16} />
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

      {/* Footer with bulk actions */}
      {quickProducts.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {quickProducts.length} product{quickProducts.length !== 1 ? 's' : ''} ready to save
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuickProducts([])}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                Clear All
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save All Valid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Legend */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
            <span className="text-gray-600">{'In Stock (>5)'}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></div>
            <span className="text-gray-600">Low Stock (1-5)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
            <span className="text-gray-600">Out of Stock (0)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded-full mr-2"></div>
            <span className="text-gray-600">No Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAddTable;