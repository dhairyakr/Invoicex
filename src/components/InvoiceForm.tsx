import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Plus, Trash2, Upload, Percent, DollarSign, QrCode, Mail, MessageCircle, Tag, X, Package, Search } from 'lucide-react';
import InvoicePreview from './InvoicePreview';
import PaymentQRGenerator from './PaymentQRGenerator';
import ProductSelector from './Products/ProductSelector';
import { v4 as uuidv4 } from 'uuid';
import { FontType, Product } from '../types';
import { handleLogoUpload } from '../utils/fileHandling';
import { exportToPDF } from '../utils/pdfExport';
import { sendEmailInvoice, sendMessageInvoice } from '../utils/communication';

const fonts: FontType[] = [
  { id: 'inter', name: 'Inter' },
  { id: 'roboto', name: 'Roboto' },
  { id: 'montserrat', name: 'Montserrat' },
  { id: 'playfair', name: 'Playfair Display' },
  { id: 'opensans', name: 'Open Sans' },
  { id: 'lato', name: 'Lato' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'sourcesans', name: 'Source Sans Pro' },
  { id: 'nunito', name: 'Nunito' },
  { id: 'merriweather', name: 'Merriweather' },
  { id: 'raleway', name: 'Raleway' },
  { id: 'crimson', name: 'Crimson Text' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
];

const InvoiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    invoices, 
    currentInvoice, 
    setCurrentInvoice, 
    createInvoice, 
    saveInvoice, 
    updateInvoiceField,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    addTaxRate,
    updateTaxRate,
    removeTaxRate,
    calculateTotals
  } = useInvoice();

  const [newTag, setNewTag] = useState('');
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);

  useEffect(() => {
    if (id) {
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        setCurrentInvoice(invoice);
      } else {
        navigate('/');
      }
    } else if (!currentInvoice) {
      createInvoice();
    }
  }, [id, invoices, currentInvoice, setCurrentInvoice, createInvoice, navigate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const logoData = await handleLogoUpload(file);
      updateInvoiceField('company.logo', logoData);
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  };

  const handleQRGenerated = (qrCode: string, provider: string) => {
    updateInvoiceField('paymentInfo', {
      method: provider,
      details: `Payment via ${provider}`,
      qrCode: qrCode
    });
    setShowQRGenerator(false);
  };

  const handleProductSelect = (product: Product, quantity: number) => {
    const newItem = {
      id: uuidv4(),
      description: product.name,
      quantity: quantity,
      rate: product.price,
    };
    
    // Add the item to the invoice
    if (currentInvoice) {
      const updatedItems = [...currentInvoice.items, newItem];
      updateInvoiceField('items', updatedItems);
    }
  };

  const handleExportPDF = async () => {
    if (!currentInvoice) return;
    try {
      const fileName = `invoice-${currentInvoice.number}.pdf`;
      await exportToPDF('invoice-preview', fileName);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('❌ Error generating PDF. Please try again.');
    }
  };

  const handleSave = () => {
    if (!currentInvoice) return;
    saveInvoice(currentInvoice);
    navigate('/');
  };

  const handleEmailSend = async () => {
    if (!currentInvoice) return;
    if (!currentInvoice.client.email) {
      alert('❌ No email address found for this client. Please add an email address first.');
      return;
    }
    try {
      await sendEmailInvoice(currentInvoice, currentInvoice.client.email);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('❌ Error sending email. Please try again.');
    }
  };

  const handleMessageSend = async () => {
    if (!currentInvoice) return;
    try {
      await sendMessageInvoice(currentInvoice);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Error preparing message. Please try again.');
    }
  };

  const addTag = () => {
    if (!currentInvoice || !newTag.trim()) return;
    
    const tags = [...(currentInvoice.tags || [])];
    if (!tags.includes(newTag.trim())) {
      tags.push(newTag.trim());
      updateInvoiceField('tags', tags);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!currentInvoice) return;
    
    const tags = (currentInvoice.tags || []).filter(tag => tag !== tagToRemove);
    updateInvoiceField('tags', tags);
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === currentInvoice?.currency);
    return currency?.symbol || '$';
  };

  if (!currentInvoice) return <div className="p-8 text-center">Loading...</div>;

  const totals = calculateTotals();

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Section - Company Details */}
      <div className="w-[30%] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Company Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={currentInvoice.company.name}
                onChange={(e) => updateInvoiceField('company.name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Company Name"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentInvoice.company.email}
                  onChange={(e) => updateInvoiceField('company.email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="company@example.com"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={currentInvoice.company.phone}
                  onChange={(e) => updateInvoiceField('company.phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={currentInvoice.company.address}
                onChange={(e) => updateInvoiceField('company.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Business St, City, State, ZIP"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                {currentInvoice.company.logo && (
                  <img
                    src={currentInvoice.company.logo}
                    alt="Company logo"
                    className="h-12 w-12 object-contain"
                  />
                )}
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  <Upload size={16} className="mr-2" />
                  {currentInvoice.company.logo ? 'Change Logo' : 'Add Logo'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
                {currentInvoice.company.logo && (
                  <button
                    type="button"
                    onClick={() => updateInvoiceField('company.logo', '')}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6 mt-8">Client Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                value={currentInvoice.client.name}
                onChange={(e) => updateInvoiceField('client.name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={currentInvoice.client.email}
                onChange={(e) => updateInvoiceField('client.email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={currentInvoice.client.address}
                onChange={(e) => updateInvoiceField('client.address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Client's billing address"
                rows={3}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-6 mt-8">Invoice Details</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={currentInvoice.number}
                  onChange={(e) => updateInvoiceField('number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={currentInvoice.status}
                  onChange={(e) => updateInvoiceField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currentInvoice.currency}
                  onChange={(e) => updateInvoiceField('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={currentInvoice.issueDate}
                  onChange={(e) => updateInvoiceField('issueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={currentInvoice.dueDate}
                  onChange={(e) => updateInvoiceField('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(currentInvoice.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Items
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProductSelector(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none"
                  >
                    <Package size={16} className="mr-1" /> Select Product
                  </button>
                  <button
                    type="button"
                    onClick={addInvoiceItem}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                  >
                    <Plus size={16} className="mr-1" /> Add Item
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {currentInvoice.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Item description"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">{getCurrencySymbol()}</span>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateInvoiceItem(item.id, 'rate', Number(e.target.value))}
                        className="w-24 pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeInvoiceItem(item.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Discount Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Discount
                </label>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={currentInvoice.discountType}
                  onChange={(e) => updateInvoiceField('discountType', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5">
                    {currentInvoice.discountType === 'percentage' ? '%' : getCurrencySymbol()}
                  </span>
                  <input
                    type="number"
                    value={currentInvoice.discountValue}
                    onChange={(e) => updateInvoiceField('discountValue', Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Tax Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tax Rates
                </label>
                <button
                  type="button"
                  onClick={addTaxRate}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none"
                >
                  <Plus size={16} className="mr-1" /> Add Tax
                </button>
              </div>
              
              <div className="space-y-2">
                {currentInvoice.taxRates.map((tax) => (
                  <div key={tax.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={tax.name}
                      onChange={(e) => updateTaxRate(tax.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tax name (e.g., VAT, Sales Tax)"
                    />
                    <div className="relative">
                      <span className="absolute right-3 top-2.5">%</span>
                      <input
                        type="number"
                        value={tax.rate}
                        onChange={(e) => updateTaxRate(tax.id, 'rate', Number(e.target.value))}
                        className="w-20 px-3 pr-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTaxRate(tax.id)}
                      className="text-red-600 hover:text-red-900 p-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment QR Code Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment QR Code
                </label>
                <button
                  type="button"
                  onClick={() => setShowQRGenerator(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none"
                >
                  <QrCode size={16} className="mr-1" /> Generate QR
                </button>
              </div>
              {currentInvoice.paymentInfo?.qrCode && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-md">
                  <div className="text-center">
                    <img
                      src={currentInvoice.paymentInfo.qrCode}
                      alt="Payment QR Code"
                      className="w-32 h-32 mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      {currentInvoice.paymentInfo.method} Payment
                    </p>
                    <button
                      type="button"
                      onClick={() => updateInvoiceField('paymentInfo', null)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Totals Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{getCurrencySymbol()}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{getCurrencySymbol()}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{getCurrencySymbol()}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{getCurrencySymbol()}{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={currentInvoice.notes}
                onChange={(e) => updateInvoiceField('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes..."
                rows={4}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showFooter"
                checked={currentInvoice.showFooter}
                onChange={(e) => updateInvoiceField('showFooter', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="showFooter" className="ml-2 text-sm text-gray-700">
                Show "Generated by Invoice Beautifier" footer
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section - Preview */}
      <div className="w-[55%] bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div id="invoice-preview">
              <InvoicePreview invoice={currentInvoice} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Template Selection */}
      <div className="w-[15%] bg-white overflow-y-auto">
        <div className="p-3">
          <h2 className="text-sm font-semibold mb-3">Choose Template</h2>
          
          <div className="space-y-1">
            {[
              { id: 'elegant', name: 'Elegant', description: 'Serif typography' },
              { id: 'modern', name: 'Modern', description: 'Two-column layout' },
              { id: 'corporate', name: 'Corporate', description: 'Business style' },
              { id: 'creative', name: 'Creative', description: 'Unique layout' },
              { id: 'boutique', name: 'Boutique', description: 'Premium feel' },
              { id: 'minimal', name: 'Minimal', description: 'Clean design' },
              { id: 'dynamic', name: 'Dynamic', description: 'Bold style' },
              { id: 'tech', name: 'Tech', description: 'Futuristic design' },
              { id: 'vintage', name: 'Vintage', description: 'Classic retro' },
              { id: 'artistic', name: 'Artistic', description: 'Creative flair' },
              { id: 'professional', name: 'Professional', description: 'Executive style' },
              { id: 'startup', name: 'Startup', description: 'Modern casual' }
            ].map((template) => (
              <div
                key={template.id}
                className={`p-1.5 rounded cursor-pointer transition-all ${
                  currentInvoice.template === template.id
                    ? 'bg-black text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => updateInvoiceField('template', template.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-xs">{template.name}</h3>
                </div>
                <p className={`text-xs ${
                  currentInvoice.template === template.id
                    ? 'text-gray-300'
                    : 'text-gray-500'
                }`}>
                  {template.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="color"
                  value={currentInvoice.accentColor}
                  onChange={(e) => updateInvoiceField('accentColor', e.target.value)}
                  className="h-5 w-5 border-0 p-0 rounded"
                />
                <input
                  type="text"
                  value={currentInvoice.accentColor}
                  onChange={(e) => updateInvoiceField('accentColor', e.target.value)}
                  className="flex-1 px-1 py-1 text-xs border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Font
              </label>
              <select
                value={currentInvoice.font}
                onChange={(e) => updateInvoiceField('font', e.target.value)}
                className="w-full px-1 py-1 text-xs border border-gray-300 rounded-md"
              >
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <button
              type="button"
              onClick={handleSave}
              className="w-full px-2 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-xs"
            >
              Save Invoice
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs"
            >
              Export PDF
            </button>
            <button
              type="button"
              onClick={handleEmailSend}
              className="w-full px-2 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-xs flex items-center justify-center"
            >
              <Mail size={12} className="mr-1" />
              📧 Email
            </button>
            <button
              type="button"
              onClick={handleMessageSend}
              className="w-full px-2 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs flex items-center justify-center"
            >
              <MessageCircle size={12} className="mr-1" />
              💬 Message
            </button>
          </div>
        </div>
      </div>

      {/* QR Generator Modal */}
      {showQRGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Generate Payment QR Code</h3>
              <button
                onClick={() => setShowQRGenerator(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <PaymentQRGenerator
              amount={totals.total}
              currency={currentInvoice.currency}
              recipient={currentInvoice.company.name}
              reference={currentInvoice.number}
              onQRGenerated={handleQRGenerated}
            />
          </div>
        </div>
      )}

      {/* Product Selector Modal */}
      <ProductSelector
        isOpen={showProductSelector}
        onClose={() => setShowProductSelector(false)}
        onSelectProduct={handleProductSelect}
        currency={currentInvoice.currency}
      />
    </div>
  );
};

export default InvoiceForm;