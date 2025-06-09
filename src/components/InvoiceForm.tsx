import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { Plus, Trash2, Upload } from 'lucide-react';
import InvoicePreview from './InvoicePreview';
import { v4 as uuidv4 } from 'uuid';
import { FontType } from '../types';
import { handleLogoUpload } from '../utils/fileHandling';
import { exportToPDF } from '../utils/pdfExport';

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
    removeInvoiceItem
  } = useInvoice();

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

  const handleExportPDF = () => {
    if (!currentInvoice) return;
    const fileName = `invoice-${currentInvoice.number}.pdf`;
    exportToPDF('invoice-preview', fileName);
  };

  const handleSave = () => {
    if (!currentInvoice) return;
    saveInvoice(currentInvoice);
    navigate('/');
  };

  if (!currentInvoice) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Section - Company Details */}
      <div className="w-[35%] bg-white border-r border-gray-200 overflow-y-auto">
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
            <div>
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Items
                </label>
                <button
                  type="button"
                  onClick={addInvoiceItem}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none"
                >
                  <Plus size={16} className="mr-1" /> Add Item
                </button>
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
                      <span className="absolute left-3 top-2.5">$</span>
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
      <div className="w-[45%] bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div id="invoice-preview">
              <InvoicePreview invoice={currentInvoice} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Template Selection */}
      <div className="w-[20%] bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Choose Template</h2>
          
          <div className="space-y-2">
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
                className={`p-2 rounded-lg cursor-pointer transition-all ${
                  currentInvoice.template === template.id
                    ? 'bg-black text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => updateInvoiceField('template', template.id)}
              >
                <h3 className="font-medium text-sm">{template.name}</h3>
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

          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentInvoice.accentColor}
                  onChange={(e) => updateInvoiceField('accentColor', e.target.value)}
                  className="h-6 w-6 border-0 p-0 rounded"
                />
                <input
                  type="text"
                  value={currentInvoice.accentColor}
                  onChange={(e) => updateInvoiceField('accentColor', e.target.value)}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md"
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
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md"
              >
                {fonts.map((font) => (
                  <option key={font.id} value={font.id}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleSave}
              className="w-full px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
            >
              Save Invoice
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;