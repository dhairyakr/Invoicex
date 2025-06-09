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
      <div className="p-12 bg-white\" style={{ 
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

  // BOUTIQUE TEMPLATE - Premium luxury design with sophisticated styling
  if (invoice.template === 'boutique') {
    return (
      <div className="bg-white relative" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}>
        {/* Luxury Border Frame */}
        <div className="absolute inset-4 border-2 border-gray-300 rounded-lg"></div>
        <div className="absolute inset-6 border border-gray-200 rounded-lg"></div>

        <div className="relative z-10 p-12">
          {/* Boutique Header */}
          <div className="text-center mb-12">
            {invoice.company.logo && (
              <div className="mb-8 flex justify-center">
                <div 
                  className="p-6 rounded-full shadow-xl border-4 border-white"
                  style={{ backgroundColor: `${styles.accentColor}10` }}
                >
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-20 object-contain"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl font-light mb-6 tracking-wide" style={{ color: styles.accentColor }}>
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gray-400 flex-1 max-w-24"></div>
              <div 
                className="mx-8 px-6 py-2 rounded-full text-white font-medium tracking-wider"
                style={{ backgroundColor: styles.accentColor }}
              >
                INVOICE
              </div>
              <div className="h-px bg-gray-400 flex-1 max-w-24"></div>
            </div>
            
            <div className="inline-block px-8 py-3 bg-white rounded-lg shadow-md border border-gray-200">
              <span className="text-2xl font-light text-gray-700">#{invoice.number}</span>
            </div>
          </div>

          {/* Boutique Content */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-6 tracking-wide" style={{ color: styles.accentColor }}>
                BILLED TO
              </h3>
              <div className="space-y-3">
                {invoice.client.name && <p className="font-medium text-xl text-gray-800">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-6 tracking-wide" style={{ color: styles.accentColor }}>
                INVOICE DETAILS
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Issue Date</span>
                  <span className="text-gray-800 font-medium">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Due Date</span>
                  <span className="text-gray-800 font-medium">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Currency</span>
                    <span className="text-gray-800 font-medium">{invoice.currency || 'USD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutique Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
            <div 
              className="p-6"
              style={{ backgroundColor: `${styles.accentColor}08` }}
            >
              <div className="grid grid-cols-12 gap-4 font-medium tracking-wide" style={{ color: styles.accentColor }}>
                <div className="col-span-6">DESCRIPTION</div>
                <div className="col-span-2 text-center">QTY</div>
                <div className="col-span-2 text-right">RATE</div>
                <div className="col-span-2 text-right">AMOUNT</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-25 transition-colors">
                  <div className="col-span-6 text-gray-800">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-semibold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Boutique Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-lg font-medium mb-6 tracking-wide" style={{ color: styles.accentColor }}>
                SUMMARY
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span>Discount</span>
                    <span className="font-medium">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium text-gray-800">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-200 pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium tracking-wide" style={{ color: styles.accentColor }}>
                      TOTAL
                    </span>
                    <span className="text-2xl font-bold" style={{ color: styles.accentColor }}>
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-6 tracking-wide" style={{ color: styles.accentColor }}>
                NOTES
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="font-light tracking-wide">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // MINIMAL TEMPLATE - Ultra-clean design with maximum whitespace
  if (invoice.template === 'minimal') {
    return (
      <div className="bg-white" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        <div className="p-16">
          {/* Minimal Header */}
          <div className="mb-16">
            <div className="flex justify-between items-start mb-12">
              <div>
                {invoice.company.logo && (
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-12 object-contain mb-6"
                  />
                )}
                <h1 className="text-2xl font-light text-gray-900 mb-2">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <div className="text-gray-600 space-y-1">
                  {invoice.company.email && <div>{invoice.company.email}</div>}
                  {invoice.company.phone && <div>{invoice.company.phone}</div>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-extralight text-gray-400 mb-4">Invoice</h2>
                <div className="text-2xl font-light text-gray-900">#{invoice.number}</div>
              </div>
            </div>

            <div className="h-px bg-gray-200 mb-12"></div>

            <div className="grid grid-cols-3 gap-12">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Bill To
                </h3>
                <div className="space-y-2">
                  {invoice.client.name && <p className="text-gray-900 font-medium">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Issue Date
                </h3>
                <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Due Date
                </h3>
                <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Minimal Table */}
          <div className="mb-16">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-center py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="text-right py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-6 text-gray-900">{item.description || 'Item description'}</td>
                    <td className="py-6 text-center text-gray-700">{item.quantity}</td>
                    <td className="py-6 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-6 text-right font-medium text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Minimal Totals */}
          <div className="flex justify-end mb-16">
            <div className="w-80">
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between py-2 text-red-600">
                    <span>Discount</span>
                    <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-light text-gray-900">Total</span>
                    <span className="text-2xl font-light text-gray-900">{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-400 text-sm py-8">
            Generated by Invoice Beautifier
          </div>
        )}
      </div>
    );
  }

  // DYNAMIC TEMPLATE - Bold design with striking visual elements
  if (invoice.template === 'dynamic') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-0 right-0 w-1/3 h-full opacity-5 transform skew-x-12"
            style={{ backgroundColor: styles.accentColor }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-1/4 h-1/2 opacity-5 transform -skew-x-12"
            style={{ backgroundColor: styles.accentColor }}
          ></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Dynamic Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-6">
                {invoice.company.logo && (
                  <div 
                    className="p-4 rounded-xl shadow-lg"
                    style={{ backgroundColor: `${styles.accentColor}15` }}
                  >
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{ color: styles.accentColor }}>
                    {invoice.company.name || 'Your Company'}
                  </h1>
                  <div className="text-gray-600">
                    {invoice.company.email && <div>{invoice.company.email}</div>}
                    {invoice.company.phone && <div>{invoice.company.phone}</div>}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div 
                  className="inline-block px-8 py-4 rounded-xl text-white shadow-lg transform -rotate-3"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <div className="text-lg">#{invoice.number}</div>
                </div>
              </div>
            </div>

            {/* Dynamic Info Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div 
                className="p-6 rounded-xl text-white shadow-lg transform rotate-1"
                style={{ backgroundColor: styles.accentColor }}
              >
                <h3 className="font-bold mb-3 uppercase tracking-wide">Bill To</h3>
                <div className="space-y-1">
                  {invoice.client.name && <p className="font-semibold">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="opacity-90 text-sm">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="opacity-90 text-sm whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-xl shadow-lg transform -rotate-1">
                <h3 className="font-bold mb-3 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                  Issue Date
                </h3>
                <p className="text-2xl font-bold text-gray-800">{formatDate(invoice.issueDate)}</p>
              </div>

              <div className="bg-gray-100 p-6 rounded-xl shadow-lg transform rotate-1">
                <h3 className="font-bold mb-3 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                  Due Date
                </h3>
                <p className="text-2xl font-bold text-gray-800">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Dynamic Table */}
          <div className="mb-8">
            <div 
              className="p-6 rounded-t-xl text-white shadow-lg"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold uppercase tracking-wide">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-t-0 rounded-b-xl shadow-lg overflow-hidden" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                >
                  <div className="col-span-6 font-medium text-gray-800">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Totals */}
          <div className="flex justify-end mb-8">
            <div 
              className="p-8 rounded-xl text-white shadow-lg transform -rotate-1"
              style={{ backgroundColor: styles.accentColor }}
            >
              <h3 className="text-xl font-bold mb-6 uppercase tracking-wide">Total Summary</h3>
              <div className="space-y-3 min-w-72">
                <div className="flex justify-between text-lg">
                  <span className="opacity-90">Subtotal</span>
                  <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-lg text-red-200">
                    <span>Discount</span>
                    <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-lg">
                    <span className="opacity-90">Tax</span>
                    <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-white border-opacity-30 pt-4 mt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>TOTAL</span>
                    <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-gray-100 p-8 rounded-xl shadow-lg transform rotate-1">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="font-bold tracking-wide">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // TECH TEMPLATE - Futuristic design with modern tech aesthetics
  if (invoice.template === 'tech') {
    return (
      <div className="bg-gray-900 text-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(${styles.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${styles.accentColor} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Tech Circuit Lines */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-px" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute top-20 left-42 w-px h-16" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-px" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute bottom-36 right-10 w-px h-16" style={{ backgroundColor: styles.accentColor }}></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Tech Header */}
          <div className="mb-12">
            <div 
              className="p-8 rounded-lg border-2 mb-8"
              style={{ 
                borderColor: styles.accentColor,
                background: `linear-gradient(135deg, ${styles.accentColor}20 0%, transparent 100%)`
              }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-6">
                  {invoice.company.logo && (
                    <div 
                      className="p-4 rounded-lg border-2"
                      style={{ borderColor: styles.accentColor }}
                    >
                      <img
                        src={invoice.company.logo}
                        alt="Company logo"
                        className="h-12 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold mb-2 tracking-wide">
                      {invoice.company.name || 'YOUR COMPANY'}
                    </h1>
                    <div className="text-gray-300 font-mono text-sm">
                      {invoice.company.email && <div>EMAIL: {invoice.company.email}</div>}
                      {invoice.company.phone && <div>PHONE: {invoice.company.phone}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div 
                    className="inline-block px-6 py-3 rounded border-2 font-mono"
                    style={{ borderColor: styles.accentColor, backgroundColor: `${styles.accentColor}30` }}
                  >
                    <div className="text-sm opacity-80">INVOICE_ID</div>
                    <div className="text-xl font-bold">#{invoice.number}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Info Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div 
                className="p-6 rounded-lg border-2 bg-gray-800"
                style={{ borderColor: styles.accentColor }}
              >
                <h3 className="font-bold mb-4 uppercase tracking-wider text-sm" style={{ color: styles.accentColor }}>
                  &gt; CLIENT_DATA
                </h3>
                <div className="space-y-2 font-mono text-sm">
                  {invoice.client.name && <p className="text-white">NAME: {invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-300">EMAIL: {invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-gray-300 whitespace-pre-line">ADDR: {invoice.client.address}</p>}
                </div>
              </div>

              <div 
                className="p-6 rounded-lg border-2 bg-gray-800"
                style={{ borderColor: styles.accentColor }}
              >
                <h3 className="font-bold mb-4 uppercase tracking-wider text-sm" style={{ color: styles.accentColor }}>
                  &gt; ISSUE_DATE
                </h3>
                <p className="text-2xl font-mono font-bold">{formatDate(invoice.issueDate)}</p>
              </div>

              <div 
                className="p-6 rounded-lg border-2 bg-gray-800"
                style={{ borderColor: styles.accentColor }}
              >
                <h3 className="font-bold mb-4 uppercase tracking-wider text-sm" style={{ color: styles.accentColor }}>
                  &gt; DUE_DATE
                </h3>
                <p className="text-2xl font-mono font-bold">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Tech Table */}
          <div className="mb-8">
            <div 
              className="p-4 rounded-t-lg border-2 border-b-0"
              style={{ 
                borderColor: styles.accentColor,
                backgroundColor: styles.accentColor
              }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold uppercase tracking-wider text-sm">
                <div className="col-span-6">&gt; DESCRIPTION</div>
                <div className="col-span-2 text-center">&gt; QTY</div>
                <div className="col-span-2 text-right">&gt; RATE</div>
                <div className="col-span-2 text-right">&gt; AMOUNT</div>
              </div>
            </div>
            
            <div 
              className="border-2 border-t-0 rounded-b-lg bg-gray-800"
              style={{ borderColor: styles.accentColor }}
            >
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-4 font-mono ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} ${index < invoice.items.length - 1 ? 'border-b border-gray-700' : ''}`}
                >
                  <div className="col-span-6 text-white">{item.description || 'ITEM_DESCRIPTION'}</div>
                  <div className="col-span-2 text-center text-gray-300">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-300">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-white">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Totals */}
          <div className="flex justify-end mb-8">
            <div 
              className="p-8 rounded-lg border-2"
              style={{ 
                borderColor: styles.accentColor,
                background: `linear-gradient(135deg, ${styles.accentColor}30 0%, transparent 100%)`
              }}
            >
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wider" style={{ color: styles.accentColor }}>
                &gt; CALCULATION_SUMMARY
              </h3>
              <div className="space-y-3 min-w-80 font-mono">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-300">SUBTOTAL:</span>
                  <span className="font-bold text-white">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-lg text-red-400">
                    <span>DISCOUNT:</span>
                    <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">TAX:</span>
                    <span className="font-bold text-white">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div 
                  className="border-t-2 pt-4 mt-4"
                  style={{ borderColor: styles.accentColor }}
                >
                  <div className="flex justify-between text-2xl font-bold">
                    <span style={{ color: styles.accentColor }}>TOTAL:</span>
                    <span style={{ color: styles.accentColor }}>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div 
              className="p-8 rounded-lg border-2 bg-gray-800"
              style={{ borderColor: styles.accentColor }}
            >
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider" style={{ color: styles.accentColor }}>
                &gt; ADDITIONAL_NOTES
              </h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed font-mono">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-6 font-mono">
            <div>&gt; GENERATED_BY: INVOICE_BEAUTIFIER</div>
          </div>
        )}
      </div>
    );
  }

  // VINTAGE TEMPLATE - Classic retro design with nostalgic elements
  if (invoice.template === 'vintage') {
    return (
      <div className="bg-white relative" style={{ 
        fontFamily: 'Merriweather, serif',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #faf7f0 0%, #f4f1e8 100%)',
      }}>
        {/* Vintage Paper Texture */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #d4af37 1px, transparent 1px), radial-gradient(circle at 80% 20%, #d4af37 1px, transparent 1px), radial-gradient(circle at 40% 80%, #d4af37 1px, transparent 1px)`,
          backgroundSize: '100px 100px, 150px 150px, 120px 120px'
        }}></div>

        {/* Vintage Border */}
        <div className="absolute inset-8 border-4 border-double border-amber-600 rounded-lg"></div>
        <div className="absolute inset-12 border border-amber-400 rounded-lg"></div>

        <div className="relative z-10 p-16">
          {/* Vintage Header */}
          <div className="text-center mb-16">
            {invoice.company.logo && (
              <div className="mb-8 flex justify-center">
                <div className="p-6 border-4 border-double border-amber-600 rounded-full bg-white shadow-lg">
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-16 object-contain sepia"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-5xl font-bold mb-6 text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-amber-600 flex-1 max-w-32"></div>
              <div className="mx-8 px-8 py-3 border-4 border-double border-amber-600 rounded-lg bg-white">
                <h2 className="text-3xl font-bold text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  INVOICE
                </h2>
              </div>
              <div className="h-px bg-amber-600 flex-1 max-w-32"></div>
            </div>
            
            <div className="inline-block px-8 py-3 border-2 border-amber-600 rounded-lg bg-amber-50">
              <span className="text-2xl font-bold text-amber-800">No. {invoice.number}</span>
            </div>
          </div>

          {/* Vintage Content */}
          <div className="grid grid-cols-2 gap-16 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
              <h3 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Billed To
              </h3>
              <div className="space-y-3">
                {invoice.client.name && <p className="font-bold text-xl text-gray-800">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-700 italic">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-amber-200">
              <h3 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Invoice Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Issue Date:</span>
                  <span className="text-gray-800 font-bold">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Due Date:</span>
                  <span className="text-gray-800 font-bold">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="pt-4 border-t border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Currency:</span>
                    <span className="text-gray-800 font-bold">{invoice.currency || 'USD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Table */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-double border-amber-600 overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-6">
              <div className="grid grid-cols-12 gap-4 font-bold text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                <div className="col-span-6 text-xl">Description</div>
                <div className="col-span-2 text-center text-xl">Qty</div>
                <div className="col-span-2 text-right text-xl">Rate</div>
                <div className="col-span-2 text-right text-xl">Amount</div>
              </div>
            </div>
            
            <div className="divide-y-2 divide-amber-200">
              {invoice.items.map((item, index) => (
                <div key={item.id} className={`grid grid-cols-12 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-amber-25'}`}>
                  <div className="col-span-6 text-gray-800 font-medium">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700 font-semibold">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700 font-semibold">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vintage Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-96 bg-white rounded-lg shadow-lg border-4 border-double border-amber-600 p-8">
              <h3 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="font-bold text-gray-800">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span className="font-semibold">Discount</span>
                    <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-semibold">Tax</span>
                    <span className="font-bold text-gray-800">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-4 border-double border-amber-600 pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                      TOTAL
                    </span>
                    <span className="text-3xl font-bold text-amber-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-white p-8 rounded-lg shadow-lg border-4 border-double border-amber-600">
              <h3 className="text-2xl font-bold mb-6 text-amber-800 border-b-2 border-amber-200 pb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed italic">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-amber-700 text-sm py-6">
            <div className="italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              Generated by Invoice Beautifier
            </div>
          </div>
        )}
      </div>
    );
  }

  // ARTISTIC TEMPLATE - Creative design with artistic flair
  if (invoice.template === 'artistic') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%)',
      }}>
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ 
            background: `radial-gradient(circle, ${styles.accentColor}40 0%, transparent 70%)`
          }}></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full" style={{ 
            background: `radial-gradient(circle, ${styles.accentColor}30 0%, transparent 70%)`
          }}></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 transform rotate-45" style={{ 
            background: `linear-gradient(45deg, ${styles.accentColor}20 0%, transparent 100%)`
          }}></div>
        </div>

        {/* Artistic Paint Strokes */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute top-20 left-0 w-full h-2 transform -skew-y-1"
            style={{ backgroundColor: styles.accentColor }}
          ></div>
          <div 
            className="absolute bottom-32 right-0 w-2/3 h-1 transform skew-y-1"
            style={{ backgroundColor: styles.accentColor }}
          ></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Artistic Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              {invoice.company.logo && (
                <div className="mb-8">
                  <div 
                    className="inline-block p-6 rounded-full shadow-xl border-4 border-white"
                    style={{ 
                      background: `linear-gradient(135deg, ${styles.accentColor}20 0%, ${styles.accentColor}10 100%)`
                    }}
                  >
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-20 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <h1 className="text-5xl font-bold mb-6" style={{ 
                color: styles.accentColor,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                {invoice.company.name || 'Your Company'}
              </h1>
              
              <div className="relative mb-8">
                <div 
                  className="absolute inset-0 transform rotate-3 rounded-lg opacity-30"
                  style={{ backgroundColor: styles.accentColor }}
                ></div>
                <div 
                  className="relative px-12 py-6 rounded-lg text-white font-bold text-3xl shadow-lg"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  INVOICE
                </div>
              </div>
              
              <div 
                className="inline-block px-8 py-4 rounded-full border-4 bg-white shadow-lg transform -rotate-2"
                style={{ borderColor: styles.accentColor }}
              >
                <span className="text-2xl font-bold" style={{ color: styles.accentColor }}>
                  #{invoice.number}
                </span>
              </div>
            </div>
          </div>

          {/* Artistic Content Layout */}
          <div className="grid grid-cols-2 gap-16 mb-16">
            <div 
              className="p-8 rounded-2xl shadow-xl border-4 bg-white transform -rotate-1"
              style={{ borderColor: `${styles.accentColor}50` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                Client Information
              </h3>
              <div className="space-y-3">
                {invoice.client.name && <p className="font-bold text-xl text-gray-800">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600 italic">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
              </div>
            </div>

            <div 
              className="p-8 rounded-2xl shadow-xl border-4 bg-white transform rotate-1"
              style={{ borderColor: `${styles.accentColor}50` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                Invoice Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Issue Date</span>
                  <span className="text-gray-800 font-bold">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Due Date</span>
                  <span className="text-gray-800 font-bold">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="pt-4 border-t-2" style={{ borderColor: `${styles.accentColor}30` }}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Currency</span>
                    <span className="text-gray-800 font-bold">{invoice.currency || 'USD'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artistic Table */}
          <div className="mb-12">
            <div 
              className="p-6 rounded-t-2xl text-white shadow-lg transform -skew-y-1"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold text-lg transform skew-y-1">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="bg-white border-4 border-t-0 rounded-b-2xl shadow-lg overflow-hidden" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-all duration-300`}
                >
                  <div className="col-span-6 text-gray-800 font-medium">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Artistic Totals */}
          <div className="flex justify-end mb-12">
            <div 
              className="p-8 rounded-2xl shadow-xl border-4 bg-white transform rotate-2"
              style={{ borderColor: styles.accentColor }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                Total Summary
              </h3>
              <div className="space-y-4 min-w-80">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-bold text-gray-800">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-red-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-bold text-gray-800">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-4 pt-4 mt-6" style={{ borderColor: styles.accentColor }}>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: styles.accentColor }}>
                      TOTAL
                    </span>
                    <span className="text-3xl font-bold" style={{ color: styles.accentColor }}>
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div 
              className="p-8 rounded-2xl shadow-xl border-4 bg-white transform -rotate-1"
              style={{ borderColor: `${styles.accentColor}50` }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                Additional Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-8">
            <div className="italic font-medium">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // PROFESSIONAL TEMPLATE - Executive-level design for formal business
  if (invoice.template === 'professional') {
    return (
      <div className="bg-white" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Professional Header */}
        <div 
          className="p-12 text-white"
          style={{ backgroundColor: styles.accentColor }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              {invoice.company.logo && (
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-16 object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-wide">
                  {invoice.company.name || 'YOUR COMPANY'}
                </h1>
                <div className="text-gray-200 space-y-1">
                  {invoice.company.email && <div className="flex items-center"><span className="mr-2">✉</span>{invoice.company.email}</div>}
                  {invoice.company.phone && <div className="flex items-center"><span className="mr-2">☎</span>{invoice.company.phone}</div>}
                  {invoice.company.address && <div className="flex items-center"><span className="mr-2">📍</span>{invoice.company.address}</div>}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <h2 className="text-5xl font-bold mb-4 tracking-wider">INVOICE</h2>
              <div className="bg-white text-gray-900 px-6 py-3 rounded-lg shadow-lg">
                <span className="text-2xl font-bold">#{invoice.number}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12">
          {/* Professional Info Section */}
          <div className="grid grid-cols-4 gap-8 mb-12">
            <div 
              className="col-span-2 p-8 rounded-lg border-l-4"
              style={{ 
                backgroundColor: `${styles.accentColor}05`,
                borderColor: styles.accentColor
              }}
            >
              <h3 className="font-bold text-xl mb-6 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                Bill To
              </h3>
              <div className="space-y-3">
                {invoice.client.name && <p className="font-bold text-2xl text-gray-900">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600 text-lg">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
              </div>
            </div>

            <div 
              className="p-8 rounded-lg border-l-4"
              style={{ 
                backgroundColor: `${styles.accentColor}05`,
                borderColor: styles.accentColor
              }}
            >
              <h3 className="font-bold text-xl mb-6 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                Issue Date
              </h3>
              <p className="text-2xl font-bold text-gray-900">{formatDate(invoice.issueDate)}</p>
            </div>

            <div 
              className="p-8 rounded-lg border-l-4"
              style={{ 
                backgroundColor: `${styles.accentColor}05`,
                borderColor: styles.accentColor
              }}
            >
              <h3 className="font-bold text-xl mb-6 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                Due Date
              </h3>
              <p className="text-2xl font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Professional Table */}
          <div className="mb-12">
            <div 
              className="p-6 text-white"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-6 font-bold text-lg uppercase tracking-wide">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="border-2 border-t-0 rounded-b-lg overflow-hidden" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-6 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 last:border-b-0`}
                >
                  <div className="col-span-6 text-gray-900 font-medium text-lg">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700 text-lg">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700 text-lg">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-900 text-lg">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-96">
              <div 
                className="p-8 rounded-lg border-2"
                style={{ 
                  borderColor: styles.accentColor,
                  backgroundColor: `${styles.accentColor}05`
                }}
              >
                <h3 className="font-bold text-xl mb-6 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                  Invoice Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="font-bold text-gray-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-lg text-red-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium text-gray-700">Tax</span>
                      <span className="font-bold text-gray-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div 
                    className="border-t-2 pt-6 mt-6"
                    style={{ borderColor: styles.accentColor }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold uppercase tracking-wide" style={{ color: styles.accentColor }}>
                        Total
                      </span>
                      <span className="text-3xl font-bold" style={{ color: styles.accentColor }}>
                        {currencySymbol}{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div 
              className="p-8 rounded-lg border-l-4"
              style={{ 
                backgroundColor: `${styles.accentColor}05`,
                borderColor: styles.accentColor
              }}
            >
              <h3 className="font-bold text-xl mb-6 uppercase tracking-wide" style={{ color: styles.accentColor }}>
                Additional Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div 
            className="text-center text-white py-6"
            style={{ backgroundColor: styles.accentColor }}
          >
            <div className="font-medium tracking-wide">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // STARTUP TEMPLATE - Modern casual design for new businesses
  if (invoice.template === 'startup') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Startup Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute bottom-32 left-16 w-24 h-24 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 transform rotate-45" style={{ backgroundColor: styles.accentColor }}></div>
        </div>

        {/* Startup Geometric Shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 rounded-lg transform rotate-12" style={{ borderColor: styles.accentColor }}></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 border-4 rounded-full" style={{ borderColor: styles.accentColor }}></div>
        </div>

        <div className="relative z-10 p-10">
          {/* Startup Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center space-x-6">
                {invoice.company.logo && (
                  <div 
                    className="p-4 rounded-2xl shadow-lg"
                    style={{ backgroundColor: `${styles.accentColor}15` }}
                  >
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-14 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-2" style={{ color: styles.accentColor }}>
                    {invoice.company.name || 'Your Startup'}
                  </h1>
                  <div className="text-gray-600 space-y-1">
                    {invoice.company.email && <div className="flex items-center"><span className="mr-2">📧</span>{invoice.company.email}</div>}
                    {invoice.company.phone && <div className="flex items-center"><span className="mr-2">📱</span>{invoice.company.phone}</div>}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div 
                  className="inline-block px-8 py-4 rounded-2xl text-white shadow-lg"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  <h2 className="text-2xl font-bold mb-1">Invoice</h2>
                  <div className="text-lg opacity-90">#{invoice.number}</div>
                </div>
              </div>
            </div>

            {/* Startup Info Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4 text-lg" style={{ color: styles.accentColor }}>
                  👤 Client
                </h3>
                <div className="space-y-2">
                  {invoice.client.name && <p className="font-semibold text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 text-sm">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4 text-lg" style={{ color: styles.accentColor }}>
                  📅 Issue Date
                </h3>
                <p className="text-xl font-bold text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold mb-4 text-lg" style={{ color: styles.accentColor }}>
                  ⏰ Due Date
                </h3>
                <p className="text-xl font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Startup Table */}
          <div className="mb-10">
            <div 
              className="p-6 rounded-t-2xl text-white shadow-lg"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold text-lg">
                <div className="col-span-6">📝 Description</div>
                <div className="col-span-2 text-center">🔢 Qty</div>
                <div className="col-span-2 text-right">💰 Rate</div>
                <div className="col-span-2 text-right">💵 Amount</div>
              </div>
            </div>
            
            <div className="bg-white border-2 border-t-0 rounded-b-2xl shadow-lg overflow-hidden" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                >
                  <div className="col-span-6 text-gray-800 font-medium">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Startup Totals */}
          <div className="flex justify-end mb-10">
            <div 
              className="p-8 rounded-2xl text-white shadow-lg"
              style={{ backgroundColor: styles.accentColor }}
            >
              <h3 className="text-xl font-bold mb-6">💸 Payment Summary</h3>
              <div className="space-y-3 min-w-72">
                <div className="flex justify-between text-lg">
                  <span className="opacity-90">Subtotal</span>
                  <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-lg text-red-200">
                    <span>Discount</span>
                    <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-lg">
                    <span className="opacity-90">Tax</span>
                    <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-white border-opacity-30 pt-4 mt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>🎯 Total</span>
                    <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-4" style={{ color: styles.accentColor }}>
                📝 Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-6">
            <div className="font-medium">🚀 Generated by Invoice Beautifier</div>
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