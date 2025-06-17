import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Tag, BarChart3, Save, AlertCircle, Sparkles, Zap, Star, Crown, Shield } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const units = [
  'piece', 'hour', 'day', 'week', 'month', 'year',
  'kg', 'gram', 'pound', 'meter', 'foot', 'inch',
  'liter', 'gallon', 'box', 'pack', 'set', 'license'
];

const categories = [
  'Software', 'Hardware', 'Services', 'Consulting', 'Design',
  'Development', 'Marketing', 'Training', 'Support', 'Maintenance',
  'Products', 'Subscriptions', 'Other'
];

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { createProduct, updateProduct } = useProducts();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: '',
    sku: '',
    stock: undefined as number | undefined,
    unit: 'piece',
    taxable: true,
    isActive: true,
    tags: [] as string[],
  });
  
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        sku: product.sku || '',
        stock: product.stock,
        unit: product.unit,
        taxable: product.taxable,
        isActive: product.isActive,
        tags: [...product.tags],
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }

    if (!formData.category.trim()) {
      setError('Category is required');
      setLoading(false);
      return;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        sku: formData.sku.trim() || undefined,
      };

      const { error } = product
        ? await updateProduct(product.id, productData)
        : await createProduct(productData);

      if (error) {
        setError(error);
      } else {
        onClose();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === formData.currency);
    return currency?.symbol || '$';
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name.trim() || !formData.category.trim())) {
      setError('Please fill in the product name and category before continuing');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Outer Glow Effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
        
        {/* Main Container */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Animated Header */}
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8">
            {/* Header Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-20 animate-float">
              <Star className="w-4 h-4 text-yellow-400 opacity-60" />
            </div>
            <div className="absolute bottom-4 left-20 animate-float" style={{ animationDelay: '1s' }}>
              <Sparkles className="w-5 h-5 text-blue-400 opacity-60" />
            </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center">
                {/* Animated Icon Container */}
                <div className="relative mr-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  {/* Premium Badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {product ? 'Edit Product' : 'Create New Product'}
                  </h2>
                  <p className="text-blue-200 text-lg">
                    {product ? 'Update your product information' : 'Add a new product to your professional database'}
                  </p>
                  
                  {/* Step Indicator */}
                  <div className="flex items-center mt-4 space-x-2">
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
                    <div className={`w-8 h-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-blue-400' : 'bg-white/30'}`}></div>
                    <span className="text-blue-200 text-sm ml-3">
                      Step {step} of 2
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl group"
              >
                <X size={28} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 max-h-[60vh] overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg mr-3">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg font-medium"
                          placeholder="Enter an amazing product name"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                          placeholder="Describe what makes this product special..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                          required
                        >
                          <option value="">Choose a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          SKU (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                          placeholder="Product SKU"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  {/* Pricing Section */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg mr-3">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Pricing & Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Price *
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold">
                            {getCurrencySymbol()}
                          </span>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg font-semibold"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Currency
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                        >
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Unit
                        </label>
                        <select
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Inventory & Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Stock Quantity
                        </label>
                        <input
                          type="number"
                          value={formData.stock || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            stock: e.target.value ? Number(e.target.value) : undefined 
                          })}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                          placeholder="Enter stock quantity (optional)"
                          min="0"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200">
                          <input
                            type="checkbox"
                            id="taxable"
                            checked={formData.taxable}
                            onChange={(e) => setFormData({ ...formData, taxable: e.target.checked })}
                            className="h-5 w-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <label htmlFor="taxable" className="ml-3 text-sm font-semibold text-gray-700 flex items-center">
                            <Shield className="w-4 h-4 mr-2 text-purple-600" />
                            Taxable product
                          </label>
                        </div>

                        <div className="flex items-center p-4 bg-white rounded-xl border-2 border-gray-200">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="h-5 w-5 text-green-600 border-2 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                          />
                          <label htmlFor="isActive" className="ml-3 text-sm font-semibold text-gray-700 flex items-center">
                            <Zap className="w-4 h-4 mr-2 text-green-600" />
                            Active product
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-2 rounded-lg mr-3">
                        <Tag className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Tags & Labels</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      {formData.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg"
                        >
                          <Tag size={14} className="mr-2" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-white/80 hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                        placeholder="Add a tag..."
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-semibold shadow-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="relative group overflow-hidden px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center">
                        Continue
                        <Sparkles className="ml-2 w-5 h-5" />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group overflow-hidden px-8 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center">
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            {product ? 'Updating...' : 'Creating...'}
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 w-5 h-5" />
                            {product ? 'Update Product' : 'Create Product'}
                          </>
                        )}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductForm;