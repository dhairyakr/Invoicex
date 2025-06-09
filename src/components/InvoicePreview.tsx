import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  const calculateTotals = () => {
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

    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol();

  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: invoice.font === 'inter' ? 'Inter, sans-serif' :
                  invoice.font === 'roboto' ? 'Roboto, sans-serif' :
                  invoice.font === 'montserrat' ? 'Montserrat, sans-serif' :
                  invoice.font === 'playfair' ? 'Playfair Display, serif' :
                  invoice.font === 'opensans' ? 'Open Sans, sans-serif' :
                  invoice.font === 'lato' ? 'Lato, sans-serif' :
                  invoice.font === 'poppins' ? 'Poppins, sans-serif' :
                  invoice.font === 'sourcesans' ? 'Source Sans Pro, sans-serif' :
                  invoice.font === 'nunito' ? 'Nunito, sans-serif' :
                  invoice.font === 'merriweather' ? 'Merriweather, serif' :
                  invoice.font === 'raleway' ? 'Raleway, sans-serif' :
                  invoice.font === 'crimson' ? 'Crimson Text, serif' : 'Inter, sans-serif',
      accentColor: invoice.accentColor || '#223141',
    };

    return baseStyles;
  };

  const styles = getTemplateStyles();

  // ELEGANT TEMPLATE - Sophisticated serif design with ornate elements
  if (invoice.template === 'elegant') {
    return (
      <div className="p-12 bg-white" style={{ 
        fontFamily: 'Playfair Display, serif',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      }}>
        {/* Ornate Header */}
        <div className="text-center pb-8 mb-8 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          
          {invoice.company.logo && (
            <div className="mb-6 flex justify-center">
              <div className="p-4 border-2 border-amber-200 rounded-full bg-white shadow-lg">
                <img
                  src={invoice.company.logo}
                  alt="Company logo"
                  className="h-16 object-contain"
                />
              </div>
            </div>
          )}
          
          <h1 className="text-5xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            {invoice.company.name || 'Your Company'}
          </h1>
          
          <div className="flex items-center justify-center mb-6">
            <div className="h-px bg-amber-300 flex-1 max-w-20"></div>
            <h2 className="text-3xl italic mx-6 text-amber-700 font-light">Invoice</h2>
            <div className="h-px bg-amber-300 flex-1 max-w-20"></div>
          </div>
          
          <div className="inline-block px-8 py-3 border-2 border-amber-200 rounded-lg bg-white shadow-sm">
            <span className="text-xl font-semibold text-gray-700">#{invoice.number}</span>
          </div>
        </div>

        {/* Elegant Content Layout */}
        <div className="grid grid-cols-2 gap-12 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-100">
            <h3 className="text-xl font-bold mb-4 text-amber-700 border-b border-amber-200 pb-2">
              Billed To
            </h3>
            <div className="text-gray-800 space-y-2">
              {invoice.client.name && <p className="font-semibold text-lg">{invoice.client.name}</p>}
              {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
              {invoice.client.address && <p className="whitespace-pre-line text-gray-600">{invoice.client.address}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-100">
            <h3 className="text-xl font-bold mb-4 text-amber-700 border-b border-amber-200 pb-2">
              Invoice Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Issue Date:</span>
                <span className="text-gray-800 font-semibold">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Due Date:</span>
                <span className="text-gray-800 font-semibold">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Table */}
        <div className="bg-white rounded-lg shadow-lg border border-amber-100 overflow-hidden mb-8">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
              <tr>
                <th className="text-left py-4 px-6 font-bold text-amber-800">Description</th>
                <th className="text-center py-4 px-6 font-bold text-amber-800">Qty</th>
                <th className="text-right py-4 px-6 font-bold text-amber-800">Rate</th>
                <th className="text-right py-4 px-6 font-bold text-amber-800">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}>
                  <td className="py-4 px-6 text-gray-800">{item.description || 'Item description'}</td>
                  <td className="py-4 px-6 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-6 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Elegant Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80 bg-white rounded-lg shadow-lg border border-amber-100 p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount</span>
                  <span className="font-semibold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {totals.taxAmount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t-2 border-amber-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-amber-800">
                  <span>Total</span>
                  <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-amber-100 mb-8">
            <h3 className="text-xl font-bold mb-4 text-amber-700 border-b border-amber-200 pb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        )}

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm border-t border-amber-200 pt-6">
            <div className="italic">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // MODERN TEMPLATE - Sleek two-column design with geometric elements
  if (invoice.template === 'modern') {
    return (
      <div className="bg-white" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Modern Header with Geometric Design */}
        <div className="relative overflow-hidden">
          <div 
            className="h-32 relative"
            style={{ 
              background: `linear-gradient(135deg, ${styles.accentColor} 0%, ${styles.accentColor}dd 100%)` 
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border border-white transform rotate-45"></div>
            </div>
            
            <div className="relative z-10 p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-12 object-contain mb-4 filter brightness-0 invert"
                    />
                  )}
                  <h1 className="text-3xl font-bold">{invoice.company.name || 'Your Company'}</h1>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-light mb-2">INVOICE</h2>
                  <div className="bg-white bg-opacity-20 px-4 py-2 rounded">
                    <span className="text-lg font-semibold">#{invoice.number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Two-Column Layout */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                  Bill To
                </h3>
                <div className="space-y-2">
                  {invoice.client.name && <p className="font-semibold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600">{invoice.client.address}</p>}
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                  Invoice Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-semibold">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-semibold">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>

              {/* Modern Totals Card */}
              <div 
                className="p-6 rounded-lg text-white"
                style={{ backgroundColor: styles.accentColor }}
              >
                <h3 className="text-lg font-bold mb-4">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-200">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90">Tax</span>
                      <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white border-opacity-30 pt-2 mt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full">
              <thead style={{ backgroundColor: `${styles.accentColor}15` }}>
                <tr>
                  <th className="text-left py-4 px-6 font-bold" style={{ color: styles.accentColor }}>Description</th>
                  <th className="text-center py-4 px-6 font-bold" style={{ color: styles.accentColor }}>Qty</th>
                  <th className="text-right py-4 px-6 font-bold" style={{ color: styles.accentColor }}>Rate</th>
                  <th className="text-right py-4 px-6 font-bold" style={{ color: styles.accentColor }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                    <td className="py-4 px-6">{item.description || 'Item description'}</td>
                    <td className="py-4 px-6 text-center">{item.quantity}</td>
                    <td className="py-4 px-6 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm border-t border-gray-200 py-4">
            Generated by Invoice Beautifier
          </div>
        )}
      </div>
    );
  }

  // CORPORATE TEMPLATE - Professional business design with structured layout
  if (invoice.template === 'corporate') {
    return (
      <div className="bg-white" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Corporate Header */}
        <div className="bg-gray-900 text-white p-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {invoice.company.logo && (
                <div className="bg-white p-3 rounded-lg">
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-12 object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">{invoice.company.name || 'Your Company'}</h1>
                <div className="text-gray-300 text-sm mt-1">
                  {invoice.company.email && <div>{invoice.company.email}</div>}
                  {invoice.company.phone && <div>{invoice.company.phone}</div>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
              <div className="bg-white text-gray-900 px-4 py-2 rounded font-bold">
                #{invoice.number}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Corporate Info Grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-900">
              <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Bill To</h3>
              <div className="space-y-1">
                {invoice.client.name && <p className="font-semibold">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600 text-sm">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-900">
              <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Invoice Details</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 text-sm">Issue Date:</span>
                  <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Due Date:</span>
                  <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-lg">
              <h3 className="font-bold mb-3 uppercase tracking-wide">Total Amount</h3>
              <div className="text-3xl font-bold">
                {currencySymbol}{totals.total.toFixed(2)}
              </div>
              <div className="text-gray-300 text-sm mt-1">
                {invoice.currency || 'USD'}
              </div>
            </div>
          </div>

          {/* Corporate Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wide">Description</th>
                  <th className="text-center py-4 px-6 font-bold uppercase tracking-wide">Qty</th>
                  <th className="text-right py-4 px-6 font-bold uppercase tracking-wide">Rate</th>
                  <th className="text-right py-4 px-6 font-bold uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 border-b border-gray-200">{item.description || 'Item description'}</td>
                    <td className="py-4 px-6 text-center border-b border-gray-200">{item.quantity}</td>
                    <td className="py-4 px-6 text-right border-b border-gray-200">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-semibold border-b border-gray-200">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Corporate Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-semibold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium">Tax</span>
                      <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-900 pt-3">
                    <div className="flex justify-between text-xl font-bold">
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-900">
              <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Notes</h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="bg-gray-900 text-white text-center py-4">
            <div className="text-sm">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // CREATIVE TEMPLATE - Unique artistic layout with creative elements
  if (invoice.template === 'creative') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Creative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 transform rotate-45" style={{ backgroundColor: styles.accentColor }}></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Creative Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              {invoice.company.logo && (
                <div className="mb-6">
                  <div 
                    className="inline-block p-4 rounded-full shadow-lg"
                    style={{ backgroundColor: `${styles.accentColor}15` }}
                  >
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-16 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4" style={{ color: styles.accentColor }}>
                {invoice.company.name || 'Your Company'}
              </h1>
              
              <div className="relative">
                <h2 className="text-6xl font-light text-gray-300 absolute -top-8 left-1/2 transform -translate-x-1/2 -z-10">
                  INVOICE
                </h2>
                <div 
                  className="inline-block px-8 py-3 rounded-full text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  #{invoice.number}
                </div>
              </div>
            </div>
          </div>

          {/* Creative Layout */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            {/* Diagonal Client Info */}
            <div className="col-span-5">
              <div 
                className="p-6 rounded-2xl text-white transform -rotate-2 shadow-lg"
                style={{ backgroundColor: styles.accentColor }}
              >
                <h3 className="text-lg font-bold mb-4">Bill To</h3>
                <div className="space-y-2">
                  {invoice.client.name && <p className="font-semibold">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="opacity-90">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="opacity-90 whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                style={{ backgroundColor: styles.accentColor }}
              >
                &
              </div>
            </div>

            {/* Diagonal Invoice Details */}
            <div className="col-span-5">
              <div 
                className="p-6 rounded-2xl bg-gray-100 transform rotate-2 shadow-lg border-2"
                style={{ borderColor: styles.accentColor }}
              >
                <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                  Invoice Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Issue Date</span>
                    <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Due Date</span>
                    <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Table */}
          <div className="mb-8">
            <div 
              className="rounded-t-2xl p-4 text-white"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-t-0 rounded-b-2xl overflow-hidden" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="col-span-6">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-right">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Totals */}
          <div className="flex justify-end mb-8">
            <div 
              className="p-6 rounded-2xl text-white shadow-lg transform rotate-1"
              style={{ backgroundColor: styles.accentColor }}
            >
              <h3 className="text-lg font-bold mb-4">Summary</h3>
              <div className="space-y-2 min-w-60">
                <div className="flex justify-between">
                  <span className="opacity-90">Subtotal</span>
                  <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-red-200">
                    <span>Discount</span>
                    <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="opacity-90">Tax</span>
                    <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-white border-opacity-30 pt-2 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div 
              className="p-6 rounded-2xl bg-gray-100 transform -rotate-1 shadow-lg border-2"
              style={{ borderColor: styles.accentColor }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="italic">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // FALLBACK - Default template for other cases
  return (
    <div className="p-12 bg-white" style={{ 
      fontFamily: styles.fontFamily,
      minHeight: '297mm',
      width: '210mm',
      margin: '0 auto',
    }}>
      {/* Default template content */}
      <div className="pb-8 mb-8">
        {invoice.company.logo && (
          <img
            src={invoice.company.logo}
            alt="Company logo"
            className="h-16 object-contain mb-6"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{invoice.company.name || 'Your Company'}</h1>
        <h2 className="text-2xl mb-4 text-gray-600">Invoice</h2>
        <div className="mb-6">
          <span className="inline-block px-4 py-1 border-b border-gray-300">
            #{invoice.number}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: styles.accentColor }}>
            Billed To
          </h3>
          <div className="text-gray-800">
            {invoice.client.name && <p className="font-medium mb-2">{invoice.client.name}</p>}
            {invoice.client.email && <p className="mb-2">{invoice.client.email}</p>}
            {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: styles.accentColor }}>
            Details
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">
              <p className="mb-2">Issue Date:</p>
              <p>Due Date:</p>
            </div>
            <div className="text-gray-800">
              <p className="mb-2">{formatDate(invoice.issueDate)}</p>
              <p>{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 pb-2">
              <th className="text-left py-2 w-2/5">Description</th>
              <th className="text-center py-2 w-1/5">Quantity</th>
              <th className="text-right py-2 w-1/5">Rate</th>
              <th className="text-right py-2 w-1/5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 text-left">
                  {item.description || 'Item description'}
                </td>
                <td className="py-3 text-center">
                  {item.quantity}
                </td>
                <td className="py-3 text-right">
                  {currencySymbol}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  {currencySymbol}{(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span>Subtotal</span>
              <span className="font-medium">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-200 text-red-600">
                <span>Discount</span>
                <span className="font-medium">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
              </div>
            )}
            {totals.taxAmount > 0 && (
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span>Tax</span>
                <span className="font-medium">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 font-bold border-t-2 border-gray-200 mt-2">
              <span>Total</span>
              <span>{currencySymbol}{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4" style={{ color: styles.accentColor }}>
            Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {invoice.showFooter && (
        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          Generated by Invoice Beautifier
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;