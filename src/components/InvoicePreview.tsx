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

  // ELEGANT TEMPLATE - Luxurious serif design with ornate elements
  if (invoice.template === 'elegant') {
    return (
      <div className="bg-white relative overflow-hidden" style={{
        fontFamily: 'Playfair Display, serif',
        minHeight: '297mm',
        width: '210mm',
        maxWidth: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #f7f4f1 100%)',
        boxSizing: 'border-box',
      }}>
        {/* Ornate Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 p-6">
          {/* Ornate Header with Gold Accents */}
          <div className="text-center pb-8 mb-8 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
            
            {invoice.company.logo && (
              <div className="mb-6 flex justify-center">
                <div className="p-4 border-4 border-amber-200 rounded-full bg-white shadow-2xl relative">
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-300 rounded-full"></div>
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-16 object-contain"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl font-bold mb-4 text-gray-800 tracking-wide" style={{
              fontFamily: 'Playfair Display, serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              {invoice.company.name || 'Your Company'}
            </h1>

            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400 to-amber-600 flex-1 max-w-24"></div>
              <div className="mx-6 relative">
                <h2 className="text-3xl italic text-amber-700 font-light relative z-10">INVOICE</h2>
                <div className="absolute inset-0 bg-amber-100 rounded-full transform scale-150 opacity-30"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-amber-600 via-amber-400 to-transparent flex-1 max-w-24"></div>
            </div>

            <div className="inline-block px-6 py-3 border-3 border-amber-300 rounded-2xl bg-gradient-to-r from-amber-50 to-white shadow-xl relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-400 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-300 rounded-full"></div>
              <span className="text-xl font-bold text-gray-700 tracking-wider">#{invoice.number}</span>
            </div>
          </div>

          {/* Elegant Content Layout with Decorative Elements */}
          <div className="grid grid-cols-2 gap-6 mb-8" style={{ minWidth: 0 }}>
            <div className="relative" style={{ minWidth: 0 }}>
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-amber-300"></div>
              <div className="bg-white p-5 rounded-2xl shadow-xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-full transform translate-x-10 -translate-y-10"></div>
                <h3 className="text-xl font-bold mb-4 text-amber-700 border-b-2 border-amber-200 pb-2">
                  Billed To
                </h3>
                <div className="text-gray-800 space-y-2 relative z-10">
                  {invoice.client.name && <p className="font-bold text-lg text-gray-900 break-words">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 italic text-sm break-words">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed text-sm break-words">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="relative" style={{ minWidth: 0 }}>
              <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-amber-300"></div>
              <div className="bg-white p-5 rounded-2xl shadow-xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-20 h-20 bg-amber-50 rounded-full transform -translate-x-10 -translate-y-10"></div>
                <h3 className="text-xl font-bold mb-4 text-amber-700 border-b-2 border-amber-200 pb-2">
                  Invoice Details
                </h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Issue Date:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-sm">Due Date:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Luxurious Table Design */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-amber-100 overflow-hidden mb-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300"></div>
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-amber-50 via-amber-100 to-amber-50">
                <tr>
                  <th className="text-left py-4 px-4 font-bold text-amber-800" style={{ width: '45%' }}>Description</th>
                  <th className="text-center py-4 px-2 font-bold text-amber-800" style={{ width: '15%' }}>Qty</th>
                  <th className="text-right py-4 px-2 font-bold text-amber-800" style={{ width: '20%' }}>Rate</th>
                  <th className="text-right py-4 px-4 font-bold text-amber-800" style={{ width: '20%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-amber-25'} border-b border-amber-100`}>
                    <td className="py-4 px-4 text-gray-800 font-medium break-words">{item.description || 'Item description'}</td>
                    <td className="py-4 px-2 text-center text-gray-700 font-semibold">{item.quantity}</td>
                    <td className="py-4 px-2 text-right text-gray-700 font-semibold">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ornate Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-80 relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-300 rounded-full"></div>
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-2xl border-2 border-amber-200 p-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Tax</span>
                      <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-3 border-amber-300 pt-3">
                    <div className="flex justify-between text-xl font-bold text-amber-800">
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment QR Code */}
          {invoice.paymentInfo?.qrCode && (
            <div className="flex justify-center mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-amber-200 text-center">
                <h3 className="text-lg font-bold text-amber-700 mb-3">Scan to Pay</h3>
                <img
                  src={invoice.paymentInfo.qrCode}
                  alt="Payment QR Code"
                  className="w-28 h-28 mx-auto mb-3"
                />
                <p className="text-gray-600 text-sm">{invoice.paymentInfo.method}</p>
              </div>
            </div>
          )}

          {invoice.notes && (
            <div className="bg-gradient-to-r from-amber-50 to-white p-5 rounded-2xl shadow-xl border-2 border-amber-100 mb-8 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-amber-400"></div>
              <h3 className="text-xl font-bold mb-4 text-amber-700 border-b-2 border-amber-200 pb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed break-words">{invoice.notes}</p>
            </div>
          )}

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t-2 border-amber-200 pt-8">
              <div className="italic font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MODERN TEMPLATE - Sleek geometric design with bold typography
  if (invoice.template === 'modern') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Modern Geometric Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 transform rotate-45 translate-x-48 -translate-y-48"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5">
            <div className="w-full h-full bg-gradient-to-tr from-green-400 to-blue-500 transform -rotate-12 -translate-x-32 translate-y-32"></div>
          </div>
        </div>

        {/* Ultra-Modern Header */}
        <div className="relative overflow-hidden">
          <div 
            className="h-40 relative"
            style={{ 
              background: `linear-gradient(135deg, ${styles.accentColor} 0%, ${styles.accentColor}dd 50%, ${styles.accentColor}aa 100%)` 
            }}
          >
            {/* Geometric Overlay */}
            <div className="absolute inset-0">
              <div className="absolute top-8 right-8 w-24 h-24 border-4 border-white border-opacity-20 rounded-full"></div>
              <div className="absolute top-12 right-12 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-white border-opacity-30 transform rotate-45"></div>
              <div className="absolute bottom-12 left-12 w-12 h-12 bg-white bg-opacity-20 transform rotate-45"></div>
              
              {/* Diagonal Lines */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-white bg-opacity-20 transform -skew-x-12"></div>
              <div className="absolute top-0 right-1/3 w-px h-full bg-white bg-opacity-20 transform skew-x-12"></div>
            </div>
            
            <div className="relative z-10 p-8 text-white h-full flex items-center">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-6">
                  {invoice.company.logo && (
                    <div className="bg-white bg-opacity-20 p-4 rounded-2xl backdrop-blur-sm">
                      <img
                        src={invoice.company.logo}
                        alt="Company logo"
                        className="h-16 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight">{invoice.company.name || 'Your Company'}</h1>
                    <div className="text-white text-opacity-80 mt-2 space-y-1">
                      {invoice.company.email && <div className="text-sm">{invoice.company.email}</div>}
                      {invoice.company.phone && <div className="text-sm">{invoice.company.phone}</div>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-5xl font-light mb-3 tracking-wider">INVOICE</h2>
                  <div className="bg-white bg-opacity-20 px-6 py-3 rounded-xl backdrop-blur-sm">
                    <span className="text-xl font-bold tracking-wide">#{invoice.number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 relative z-10">
          {/* Modern Grid Layout */}
          <div className="grid grid-cols-12 gap-4 mb-12">
            {/* Left Column - Client Info */}
            <div className="col-span-7 space-y-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-2xl border-l-4" style={{ borderColor: styles.accentColor }}>
                <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                  Bill To
                </h3>
                <div className="space-y-3">
                  {invoice.client.name && <p className="font-bold text-xl text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 font-medium">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed">{invoice.client.address}</p>}
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border-l-4 border-blue-400">
                  <h3 className="text-2xl font-bold mb-6 text-blue-700">
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column - Details & Summary */}
            <div className="col-span-5 space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-2xl">
                <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                  Invoice Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Issue Date:</span>
                    <span className="font-bold text-gray-900">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Due Date:</span>
                    <span className="font-bold text-gray-900">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Currency:</span>
                    <span className="font-bold text-gray-900">{invoice.currency}</span>
                  </div>
                </div>
              </div>

              {/* Modern Summary Card */}
              <div 
                className="p-5 rounded-2xl text-white relative overflow-hidden"
                style={{ backgroundColor: styles.accentColor }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
                
                <h3 className="text-2xl font-bold mb-6 relative z-10">Summary</h3>
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-200">
                      <span>Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90">Tax</span>
                      <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white border-opacity-30 pt-3 mt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border-2" style={{ borderColor: styles.accentColor }}>
                  <h3 className="text-lg font-bold mb-4 text-center" style={{ color: styles.accentColor }}>
                    Scan to Pay
                  </h3>
                  <div className="flex justify-center">
                    <img
                      src={invoice.paymentInfo.qrCode}
                      alt="Payment QR Code"
                      className="w-32 h-32"
                    />
                  </div>
                  <p className="text-center text-gray-600 mt-2 text-sm">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ultra-Modern Table */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl overflow-hidden shadow-xl mb-8">
            <div 
              className="px-8 py-6"
              style={{ backgroundColor: `${styles.accentColor}15` }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold text-lg" style={{ color: styles.accentColor }}>
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 px-8 py-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                >
                  <div className="col-span-6 font-medium text-gray-900">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center text-gray-700 font-semibold">{item.quantity}</div>
                  <div className="col-span-2 text-right text-gray-700 font-semibold">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm border-t border-gray-200 py-6">
            <div className="font-medium">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // CORPORATE TEMPLATE - Professional executive design
  if (invoice.template === 'corporate') {
    return (
      <div className="bg-white" style={{
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        maxWidth: '210mm',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {/* Executive Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-700"></div>
          </div>
          
          <div className="relative z-10 p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center space-x-4 flex-shrink min-w-0">
                {invoice.company.logo && (
                  <div className="bg-white p-3 rounded-xl shadow-lg flex-shrink-0">
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-12 object-contain"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-wide break-words">{invoice.company.name || 'Your Company'}</h1>
                  <div className="text-gray-300 text-xs mt-1 space-y-0.5">
                    {invoice.company.email && <div className="break-words">{invoice.company.email}</div>}
                    {invoice.company.phone && <div>{invoice.company.phone}</div>}
                    {invoice.company.address && <div className="whitespace-pre-line text-xs break-words">{invoice.company.address}</div>}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <h2 className="text-3xl font-bold mb-2 tracking-wider">INVOICE</h2>
                <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
                  #{invoice.number}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Executive Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8" style={{ minWidth: 0 }}>
            <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-gray-900 shadow-sm" style={{ minWidth: 0 }}>
              <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Bill To</h3>
              <div className="space-y-1.5">
                {invoice.client.name && <p className="font-bold text-lg text-gray-900 break-words">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600 text-sm break-words">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm break-words">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="space-y-4" style={{ minWidth: 0 }}>
              <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-gray-900 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Invoice Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-xs font-medium">Issue Date:</span>
                    <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium">Due Date:</span>
                    <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-5 rounded-xl shadow-lg">
                <h3 className="font-bold mb-2 uppercase tracking-wide text-sm">Total Amount</h3>
                <div className="text-3xl font-bold mb-1">
                  {currencySymbol}{totals.total.toFixed(2)}
                </div>
                <div className="text-gray-300 text-xs">
                  {invoice.currency || 'USD'}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Table */}
          <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg mb-8">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <tr>
                  <th className="text-left py-4 px-4 font-bold uppercase tracking-wide" style={{ width: '45%' }}>Description</th>
                  <th className="text-center py-4 px-2 font-bold uppercase tracking-wide" style={{ width: '15%' }}>Qty</th>
                  <th className="text-right py-4 px-2 font-bold uppercase tracking-wide" style={{ width: '20%' }}>Rate</th>
                  <th className="text-right py-4 px-4 font-bold uppercase tracking-wide" style={{ width: '20%' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}>
                    <td className="py-4 px-4 border-r border-gray-200 font-medium text-gray-900 break-words">{item.description || 'Item description'}</td>
                    <td className="py-4 px-2 text-center border-r border-gray-200 font-semibold text-gray-700">{item.quantity}</td>
                    <td className="py-4 px-2 text-right border-r border-gray-200 font-semibold text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Executive Totals & Payment */}
          <div className="grid grid-cols-2 gap-4 mb-8" style={{ minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              {invoice.notes && (
                <div className="bg-gray-50 p-5 rounded-xl border-l-4 border-gray-900 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-wide">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm break-words">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-4" style={{ minWidth: 0 }}>
              <div className="bg-gray-50 p-5 rounded-xl border-2 border-gray-300 shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 text-sm">Subtotal</span>
                    <span className="font-bold text-gray-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="font-medium text-sm">Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 text-sm">Tax</span>
                      <span className="font-bold text-gray-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-3 border-gray-900 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-300 text-center">
                  <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wide">Scan to Pay</h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <p className="text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {invoice.showFooter && (
          <div className="bg-gray-900 text-white text-center py-6">
            <div className="text-sm font-medium">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // CREATIVE TEMPLATE - Artistic design with unique layout
  if (invoice.template === 'creative') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Creative Background Art */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-60 h-60 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 transform rotate-45" style={{ backgroundColor: styles.accentColor }}></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 transform -rotate-12" style={{ backgroundColor: styles.accentColor }}></div>
          
          {/* Artistic Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 1200">
            <path d="M0,300 Q400,100 800,300" stroke={styles.accentColor} strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M0,600 Q400,800 800,600" stroke={styles.accentColor} strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M0,900 Q400,700 800,900" stroke={styles.accentColor} strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>
        </div>

        <div className="relative z-10 p-8">
          {/* Creative Header */}
          <div className="text-center mb-16">
            <div className="relative inline-block">
              {invoice.company.logo && (
                <div className="mb-8">
                  <div 
                    className="inline-block p-6 rounded-full shadow-2xl transform rotate-3"
                    style={{ backgroundColor: `${styles.accentColor}15` }}
                  >
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-20 object-contain"
                    />
                  </div>
                </div>
              )}
              
              <h1 className="text-5xl font-bold mb-6 transform -rotate-1" style={{ color: styles.accentColor }}>
                {invoice.company.name || 'Your Company'}
              </h1>
              
              <div className="relative mb-8">
                <h2 className="text-8xl font-light text-gray-200 absolute -top-12 left-1/2 transform -translate-x-1/2 -z-10">
                  INVOICE
                </h2>
                <div 
                  className="inline-block px-10 py-4 rounded-full text-white font-bold text-2xl shadow-2xl transform rotate-2"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  #{invoice.number}
                </div>
              </div>
            </div>
          </div>

          {/* Creative Asymmetric Layout */}
          <div className="grid grid-cols-12 gap-4 mb-12">
            {/* Diagonal Client Info */}
            <div className="col-span-5">
              <div 
                className="p-5 rounded-3xl text-white transform -rotate-2 shadow-2xl"
                style={{ backgroundColor: styles.accentColor }}
              >
                <h3 className="text-2xl font-bold mb-6">Bill To</h3>
                <div className="space-y-3">
                  {invoice.client.name && <p className="font-bold text-xl">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="opacity-90">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="opacity-90 whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-2xl transform rotate-12"
                style={{ backgroundColor: styles.accentColor }}
              >
                &
              </div>
            </div>

            {/* Diagonal Invoice Details */}
            <div className="col-span-5">
              <div 
                className="p-5 rounded-3xl bg-gray-100 transform rotate-2 shadow-2xl border-4"
                style={{ borderColor: styles.accentColor }}
              >
                <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                  Invoice Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-600 text-sm font-medium">Issue Date</span>
                    <p className="font-bold text-lg text-gray-900">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm font-medium">Due Date</span>
                    <p className="font-bold text-lg text-gray-900">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Creative Curved Table */}
          <div className="mb-12">
            <div 
              className="rounded-t-3xl p-6 text-white"
              style={{ backgroundColor: styles.accentColor }}
            >
              <div className="grid grid-cols-12 gap-4 font-bold text-lg">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            
            <div className="bg-white border-4 border-t-0 rounded-b-3xl overflow-hidden shadow-2xl" style={{ borderColor: styles.accentColor }}>
              {invoice.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`grid grid-cols-12 gap-4 p-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="col-span-6 font-medium text-gray-900">{item.description || 'Item description'}</div>
                  <div className="col-span-2 text-center font-semibold text-gray-700">{item.quantity}</div>
                  <div className="col-span-2 text-right font-semibold text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Creative Totals & Payment */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="col-span-2">
              {invoice.notes && (
                <div 
                  className="p-5 rounded-3xl bg-gray-100 transform -rotate-1 shadow-2xl border-4"
                  style={{ borderColor: styles.accentColor }}
                >
                  <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                    Notes
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div>
              <div 
                className="p-5 rounded-3xl text-white shadow-2xl transform rotate-1 mb-6"
                style={{ backgroundColor: styles.accentColor }}
              >
                <h3 className="text-2xl font-bold mb-6">Summary</h3>
                <div className="space-y-3 min-w-60">
                  <div className="flex justify-between">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-200">
                      <span>Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90">Tax</span>
                      <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white border-opacity-30 pt-3 mt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-3xl shadow-2xl border-4 text-center transform -rotate-1" style={{ borderColor: styles.accentColor }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: styles.accentColor }}>
                    Scan to Pay
                  </h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <p className="text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {invoice.showFooter && (
          <div className="text-center text-gray-500 text-sm py-8">
            <div className="italic font-medium">Generated by Invoice Beautifier</div>
          </div>
        )}
      </div>
    );
  }

  // BOUTIQUE TEMPLATE - Premium luxury design
  if (invoice.template === 'boutique') {
    return (
      <div className="bg-white relative" style={{ 
        fontFamily: 'Playfair Display, serif',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fefefe 0%, #f8f6f3 100%)',
      }}>
        {/* Luxury Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4af37' fill-opacity='0.05'%3E%3Cpath d='M50 50c0-27.614-22.386-50-50-50s-50 22.386-50 50 22.386 50 50 50 50-22.386 50-50zm0 0c0 27.614 22.386 50 50 50s50-22.386 50-50-22.386-50-50-50-50 22.386-50 50z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Luxury Header */}
          <div className="text-center pb-16 mb-16 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            
            {invoice.company.logo && (
              <div className="mb-10 flex justify-center">
                <div className="relative">
                  <div className="p-8 border-3 border-rose-200 rounded-full bg-white shadow-2xl">
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-rose-300 rounded-full"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-rose-200 rounded-full"></div>
                </div>
              </div>
            )}
            
            <h1 className="text-6xl font-bold mb-8 text-gray-800 tracking-wide" style={{ 
              fontFamily: 'Playfair Display, serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="flex items-center justify-center mb-10">
              <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-rose-400 flex-1 max-w-40"></div>
              <div className="mx-8 relative">
                <h2 className="text-4xl italic text-rose-600 font-light relative z-10 px-6">Invoice</h2>
                <div className="absolute inset-0 bg-rose-100 rounded-full transform scale-150 opacity-40"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-rose-400 via-rose-300 to-transparent flex-1 max-w-40"></div>
            </div>
            
            <div className="inline-block px-12 py-5 border-3 border-rose-300 rounded-2xl bg-gradient-to-r from-rose-50 to-white shadow-xl relative">
              <div className="absolute -top-1 -left-1 w-5 h-5 bg-rose-400 rounded-full"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-rose-300 rounded-full"></div>
              <span className="text-3xl font-bold text-gray-700 tracking-wider">#{invoice.number}</span>
            </div>
          </div>

          {/* Boutique Content Layout */}
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-12 h-12 border-l-4 border-t-4 border-rose-300 rounded-tl-lg"></div>
              <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-rose-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full transform translate-x-12 -translate-y-12"></div>
                <h3 className="text-3xl font-bold mb-8 text-rose-600 border-b-3 border-rose-200 pb-4">
                  Billed To
                </h3>
                <div className="text-gray-800 space-y-4 relative z-10">
                  {invoice.client.name && <p className="font-bold text-2xl text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 italic text-lg">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed text-lg">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-12 h-12 border-r-4 border-t-4 border-rose-300 rounded-tr-lg"></div>
              <div className="bg-white p-10 rounded-3xl shadow-2xl border-2 border-rose-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-rose-50 rounded-full transform -translate-x-12 -translate-y-12"></div>
                <h3 className="text-3xl font-bold mb-8 text-rose-600 border-b-3 border-rose-200 pb-4">
                  Invoice Details
                </h3>
                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Issue Date:</span>
                    <span className="text-gray-800 font-bold text-xl">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Due Date:</span>
                    <span className="text-gray-800 font-bold text-xl">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutique Table */}
          <div className="bg-white rounded-3xl shadow-2xl border-3 border-rose-100 overflow-hidden mb-16 relative">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-rose-300 via-rose-400 to-rose-300"></div>
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-rose-50 via-rose-100 to-rose-50">
                <tr>
                  <th className="text-left py-8 px-10 font-bold text-rose-800 text-xl">Description</th>
                  <th className="text-center py-8 px-10 font-bold text-rose-800 text-xl">Qty</th>
                  <th className="text-right py-8 px-10 font-bold text-rose-800 text-xl">Rate</th>
                  <th className="text-right py-8 px-10 font-bold text-rose-800 text-xl">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-rose-25'} border-b border-rose-100`}>
                    <td className="py-8 px-10 text-gray-800 font-medium text-lg">{item.description || 'Item description'}</td>
                    <td className="py-8 px-10 text-center text-gray-700 font-semibold text-lg">{item.quantity}</td>
                    <td className="py-8 px-10 text-right text-gray-700 font-semibold text-lg">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-8 px-10 text-right font-bold text-gray-800 text-xl">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Boutique Totals & Payment */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="col-span-2">
              {invoice.notes && (
                <div className="bg-gradient-to-r from-rose-50 to-white p-10 rounded-3xl shadow-2xl border-3 border-rose-100 relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 to-rose-400"></div>
                  <h3 className="text-3xl font-bold mb-8 text-rose-600 border-b-3 border-rose-200 pb-4">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-rose-400 rounded-full"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-rose-300 rounded-full"></div>
                <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-2xl border-3 border-rose-200 p-10">
                  <div className="space-y-5">
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600 text-lg">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-700 text-lg">
                        <span className="font-medium">Tax</span>
                        <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-4 border-rose-300 pt-5">
                      <div className="flex justify-between text-3xl font-bold text-rose-800">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-5 rounded-3xl shadow-2xl border-3 border-rose-200 text-center">
                  <h3 className="text-xl font-bold text-rose-600 mb-6">Scan to Pay</h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <p className="text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t-3 border-rose-200 pt-10">
              <div className="italic font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // MINIMAL TEMPLATE - Ultra-clean design
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
          <div className="pb-16 mb-16 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                {invoice.company.logo && (
                  <img
                    src={invoice.company.logo}
                    alt="Company logo"
                    className="h-16 object-contain mb-8"
                  />
                )}
                <h1 className="text-4xl font-light mb-4 text-gray-900">{invoice.company.name || 'Your Company'}</h1>
                <div className="text-gray-600 space-y-1">
                  {invoice.company.email && <div>{invoice.company.email}</div>}
                  {invoice.company.phone && <div>{invoice.company.phone}</div>}
                  {invoice.company.address && <div className="whitespace-pre-line">{invoice.company.address}</div>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-6xl font-thin mb-4 text-gray-300">INVOICE</h2>
                <div className="text-2xl font-medium text-gray-900">#{invoice.number}</div>
              </div>
            </div>
          </div>

          {/* Minimal Content */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div>
              <h3 className="text-lg font-medium mb-6 text-gray-900 uppercase tracking-wide">Bill To</h3>
              <div className="space-y-2">
                {invoice.client.name && <p className="font-medium text-xl text-gray-900">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-6 text-gray-900 uppercase tracking-wide">Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date</span>
                  <span className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date</span>
                  <span className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency</span>
                  <span className="font-medium text-gray-900">{invoice.currency}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Table */}
          <div className="mb-16">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-4 font-medium text-gray-900 uppercase tracking-wide">Description</th>
                  <th className="text-center py-4 font-medium text-gray-900 uppercase tracking-wide">Qty</th>
                  <th className="text-right py-4 font-medium text-gray-900 uppercase tracking-wide">Rate</th>
                  <th className="text-right py-4 font-medium text-gray-900 uppercase tracking-wide">Amount</th>
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

          {/* Minimal Totals & Payment */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="col-span-2">
              {invoice.notes && (
                <div>
                  <h3 className="text-lg font-medium mb-6 text-gray-900 uppercase tracking-wide">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount</span>
                      <span className="font-medium">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-gray-900 pt-3">
                    <div className="flex justify-between text-2xl font-medium text-gray-900">
                      <span>Total</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="border border-gray-200 p-6 text-center">
                  <h3 className="text-lg font-medium mb-4 text-gray-900 uppercase tracking-wide">Scan to Pay</h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <p className="text-gray-600">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-400 text-sm border-t border-gray-200 pt-8">
              Generated by Invoice Beautifier
            </div>
          )}
        </div>
      </div>
    );
  }

  // DYNAMIC TEMPLATE - Bold energetic design
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
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400 to-purple-600 opacity-10 transform rotate-45 translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400 to-red-500 opacity-10 transform -rotate-12 -translate-x-40 translate-y-40"></div>
        </div>

        <div className="relative z-10">
          {/* Dynamic Header */}
          <div 
            className="p-12 text-white relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${styles.accentColor} 0%, ${styles.accentColor}dd 50%, ${styles.accentColor}aa 100%)` 
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-8">
                  {invoice.company.logo && (
                    <div className="bg-white bg-opacity-20 p-6 rounded-2xl backdrop-blur-sm transform rotate-3">
                      <img
                        src={invoice.company.logo}
                        alt="Company logo"
                        className="h-20 object-contain filter brightness-0 invert"
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight transform -rotate-1">{invoice.company.name || 'Your Company'}</h1>
                    <div className="text-white text-opacity-90 mt-3 space-y-1">
                      {invoice.company.email && <div>{invoice.company.email}</div>}
                      {invoice.company.phone && <div>{invoice.company.phone}</div>}
                    </div>
                  </div>
                </div>
                <div className="text-right transform rotate-2">
                  <h2 className="text-6xl font-black mb-4 tracking-wider">INVOICE</h2>
                  <div className="bg-white bg-opacity-20 px-8 py-4 rounded-2xl backdrop-blur-sm">
                    <span className="text-2xl font-bold tracking-wide">#{invoice.number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Dynamic Content */}
            <div className="grid grid-cols-12 gap-4 mb-12">
              <div className="col-span-8 space-y-8">
                <div className="bg-white p-5 rounded-3xl shadow-xl border-l-8" style={{ borderColor: styles.accentColor }}>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: styles.accentColor }}>
                    Bill To
                  </h3>
                  <div className="space-y-3">
                    {invoice.client.name && <p className="font-bold text-2xl text-gray-900">{invoice.client.name}</p>}
                    {invoice.client.email && <p className="text-gray-600 text-lg">{invoice.client.email}</p>}
                    {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed">{invoice.client.address}</p>}
                  </div>
                </div>

                {invoice.notes && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-3xl shadow-xl border-l-8 border-blue-400">
                    <h3 className="text-3xl font-bold mb-6 text-blue-700">
                      Notes
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{invoice.notes}</p>
                  </div>
                )}
              </div>

              <div className="col-span-4 space-y-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-3xl shadow-xl">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: styles.accentColor }}>
                    Invoice Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-gray-600 font-medium">Issue Date:</span>
                      <p className="font-bold text-gray-900 text-lg">{formatDate(invoice.issueDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Due Date:</span>
                      <p className="font-bold text-gray-900 text-lg">{formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>

                <div 
                  className="p-5 rounded-3xl text-white shadow-xl transform rotate-2"
                  style={{ backgroundColor: styles.accentColor }}
                >
                  <h3 className="text-2xl font-bold mb-6">Total Amount</h3>
                  <div className="text-4xl font-black">
                    {currencySymbol}{totals.total.toFixed(2)}
                  </div>
                  <div className="text-white text-opacity-80 mt-2">
                    {invoice.currency}
                  </div>
                </div>

                {/* Payment QR Code */}
                {invoice.paymentInfo?.qrCode && (
                  <div className="bg-white p-6 rounded-3xl shadow-xl border-4" style={{ borderColor: styles.accentColor }}>
                    <h3 className="text-lg font-bold mb-4 text-center" style={{ color: styles.accentColor }}>
                      Scan to Pay
                    </h3>
                    <img
                      src={invoice.paymentInfo.qrCode}
                      alt="Payment QR Code"
                      className="w-32 h-32 mx-auto mb-4"
                    />
                    <p className="text-center text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Table */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
              <div 
                className="px-8 py-6"
                style={{ background: `linear-gradient(135deg, ${styles.accentColor} 0%, ${styles.accentColor}dd 100%)` }}
              >
                <div className="grid grid-cols-12 gap-4 font-bold text-white text-lg">
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {invoice.items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-12 gap-4 px-8 py-6 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                  >
                    <div className="col-span-6 font-medium text-gray-900 text-lg">{item.description || 'Item description'}</div>
                    <div className="col-span-2 text-center text-gray-700 font-semibold">{item.quantity}</div>
                    <div className="col-span-2 text-right text-gray-700 font-semibold">{currencySymbol}{item.rate.toFixed(2)}</div>
                    <div className="col-span-2 text-right font-bold text-gray-900 text-lg">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Totals */}
            <div className="flex justify-end">
              <div className="w-96 bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-3xl shadow-xl border-4" style={{ borderColor: styles.accentColor }}>
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-gray-700">Subtotal</span>
                    <span className="font-bold text-gray-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600 text-lg">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-gray-700">Tax</span>
                      <span className="font-bold text-gray-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-4 pt-4" style={{ borderColor: styles.accentColor }}>
                    <div className="flex justify-between text-3xl font-black" style={{ color: styles.accentColor }}>
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t border-gray-200 py-6">
              <div className="font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TECH TEMPLATE - Futuristic design with enhanced elements
  if (invoice.template === 'tech') {
    return (
      <div className="bg-gray-900 text-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Futuristic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
          
          {/* Circuit Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 800 1200">
              <defs>
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <path d="M20,20 L80,20 L80,80 L20,80 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
                  <circle cx="80" cy="80" r="3" fill="currentColor"/>
                  <path d="M50,0 L50,100" stroke="currentColor" strokeWidth="1"/>
                  <path d="M0,50 L100,50" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>
          
          {/* Glowing Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-cyan-400 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-purple-400 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative z-10">
          {/* Futuristic Header */}
          <div className="p-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20"></div>
            <div className="absolute inset-0 border border-cyan-400/30"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-8">
                  {invoice.company.logo && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur opacity-30"></div>
                      <div className="relative bg-gray-800 p-6 rounded-2xl border border-cyan-400/50">
                        <img
                          src={invoice.company.logo}
                          alt="Company logo"
                          className="h-20 object-contain filter brightness-0 invert"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {invoice.company.name || 'Your Company'}
                    </h1>
                    <div className="text-gray-300 mt-3 space-y-1 font-mono text-sm">
                      {invoice.company.email && <div className="flex items-center"><span className="text-cyan-400 mr-2">@</span>{invoice.company.email}</div>}
                      {invoice.company.phone && <div className="flex items-center"><span className="text-cyan-400 mr-2">#</span>{invoice.company.phone}</div>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-6xl font-thin mb-4 text-gray-500 font-mono">INVOICE</h2>
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-xl blur opacity-30"></div>
                    <div className="relative bg-gray-800 px-8 py-4 rounded-xl border border-cyan-400/50 font-mono">
                      <span className="text-2xl font-bold text-cyan-400">#{invoice.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Tech Grid Layout */}
            <div className="grid grid-cols-12 gap-4 mb-12">
              <div className="col-span-8 space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl"></div>
                  <div className="relative bg-gray-800 p-5 rounded-2xl border border-cyan-400/30">
                    <h3 className="text-2xl font-bold mb-6 text-cyan-400 font-mono uppercase tracking-wider">
                      &gt; Bill To
                    </h3>
                    <div className="space-y-3 font-mono">
                      {invoice.client.name && <p className="font-bold text-xl text-white">{invoice.client.name}</p>}
                      {invoice.client.email && <p className="text-gray-300">{invoice.client.email}</p>}
                      {invoice.client.address && <p className="whitespace-pre-line text-gray-300">{invoice.client.address}</p>}
                    </div>
                  </div>
                </div>

                {invoice.notes && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl"></div>
                    <div className="relative bg-gray-800 p-5 rounded-2xl border border-purple-400/30">
                      <h3 className="text-2xl font-bold mb-6 text-purple-400 font-mono uppercase tracking-wider">
                        &gt; Notes
                      </h3>
                      <p className="text-gray-300 whitespace-pre-line font-mono">{invoice.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-4 space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl"></div>
                  <div className="relative bg-gray-800 p-5 rounded-2xl border border-blue-400/30">
                    <h3 className="text-xl font-bold mb-6 text-blue-400 font-mono uppercase tracking-wider">
                      &gt; System Info
                    </h3>
                    <div className="space-y-4 font-mono text-sm">
                      <div>
                        <span className="text-gray-400">ISSUE_DATE:</span>
                        <p className="font-bold text-white">{formatDate(invoice.issueDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">DUE_DATE:</span>
                        <p className="font-bold text-white">{formatDate(invoice.dueDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">CURRENCY:</span>
                        <p className="font-bold text-white">{invoice.currency}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-gray-800 p-5 rounded-2xl border border-cyan-400">
                    <h3 className="text-xl font-bold mb-6 text-cyan-400 font-mono uppercase tracking-wider">
                      &gt; Total_Amount
                    </h3>
                    <div className="text-4xl font-bold text-cyan-400 font-mono">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </div>
                    <div className="text-gray-400 mt-2 font-mono text-sm">
                      CURRENCY: {invoice.currency}
                    </div>
                  </div>
                </div>

                {/* Payment QR Code */}
                {invoice.paymentInfo?.qrCode && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400 rounded-2xl blur opacity-20"></div>
                    <div className="relative bg-gray-800 p-6 rounded-2xl border border-purple-400/50 text-center">
                      <h3 className="text-lg font-bold mb-4 text-purple-400 font-mono uppercase tracking-wider">
                        &gt; Scan_To_Pay
                      </h3>
                      <img
                        src={invoice.paymentInfo.qrCode}
                        alt="Payment QR Code"
                        className="w-32 h-32 mx-auto mb-4 rounded-lg"
                      />
                      <p className="text-gray-300 font-mono text-sm">{invoice.paymentInfo.method}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Futuristic Table */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl"></div>
              <div className="relative bg-gray-800 rounded-2xl border border-cyan-400/30 overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-8 py-6 border-b border-cyan-400/30">
                  <div className="grid grid-cols-12 gap-4 font-bold text-cyan-400 font-mono uppercase tracking-wider">
                    <div className="col-span-6">&gt; Description</div>
                    <div className="col-span-2 text-center">&gt; Qty</div>
                    <div className="col-span-2 text-right">&gt; Rate</div>
                    <div className="col-span-2 text-right">&gt; Amount</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {invoice.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`grid grid-cols-12 gap-4 px-8 py-6 font-mono ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}
                    >
                      <div className="col-span-6 text-white">{item.description || 'Item description'}</div>
                      <div className="col-span-2 text-center text-gray-300">{item.quantity}</div>
                      <div className="col-span-2 text-right text-gray-300">{currencySymbol}{item.rate.toFixed(2)}</div>
                      <div className="col-span-2 text-right font-bold text-cyan-400">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tech Totals */}
            <div className="flex justify-end">
              <div className="w-96 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl"></div>
                <div className="relative bg-gray-800 p-5 rounded-2xl border border-cyan-400/30">
                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>SUBTOTAL:</span>
                      <span className="font-bold text-white">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>DISCOUNT:</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-300">
                        <span>TAX:</span>
                        <span className="font-bold text-white">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-cyan-400 pt-4">
                      <div className="flex justify-between text-2xl font-bold text-cyan-400">
                        <span>TOTAL:</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t border-gray-700 py-6 font-mono">
              <div>&gt; Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // VINTAGE TEMPLATE - Classic retro design
  if (invoice.template === 'vintage') {
    return (
      <div className="bg-white relative" style={{ 
        fontFamily: 'Crimson Text, serif',
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f1eb 100%)',
      }}>
        {/* Vintage Paper Texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d2b48c' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Vintage Header with Ornate Border */}
          <div className="text-center pb-16 mb-16 relative">
            <div className="absolute inset-0 border-4 border-double border-amber-600 rounded-lg"></div>
            <div className="absolute inset-2 border border-amber-400 rounded-lg"></div>
            
            <div className="relative z-10 p-8">
              {invoice.company.logo && (
                <div className="mb-8 flex justify-center">
                  <div className="relative">
                    <div className="p-6 border-4 border-double border-amber-600 rounded-full bg-white shadow-lg">
                      <img
                        src={invoice.company.logo}
                        alt="Company logo"
                        className="h-20 object-contain sepia"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-400 rounded-full"></div>
                  </div>
                </div>
              )}
              
              <h1 className="text-5xl font-bold mb-6 text-amber-800" style={{ 
                fontFamily: 'Crimson Text, serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}>
                {invoice.company.name || 'Your Company'}
              </h1>
              
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-px bg-amber-600"></div>
                <div className="mx-6 relative">
                  <h2 className="text-4xl italic text-amber-700 font-bold">INVOICE</h2>
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-amber-400"></div>
                </div>
                <div className="w-16 h-px bg-amber-600"></div>
              </div>
              
              <div className="inline-block px-8 py-3 border-2 border-amber-600 rounded-lg bg-amber-50 shadow-md">
                <span className="text-2xl font-bold text-amber-800">No. {invoice.number}</span>
              </div>
            </div>
          </div>

          {/* Vintage Content Layout */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 border-l-4 border-t-4 border-amber-600"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-4 border-b-4 border-amber-600"></div>
              <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-amber-200">
                <h3 className="text-2xl font-bold mb-6 text-amber-700 border-b-2 border-amber-300 pb-3">
                  Billed To
                </h3>
                <div className="text-gray-800 space-y-3">
                  {invoice.client.name && <p className="font-bold text-xl text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 italic">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-8 h-8 border-r-4 border-t-4 border-amber-600"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-4 border-b-4 border-amber-600"></div>
              <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-amber-200">
                <h3 className="text-2xl font-bold mb-6 text-amber-700 border-b-2 border-amber-300 pb-3">
                  Invoice Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date Issued:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date Due:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage Table */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-double border-amber-600 overflow-hidden mb-16">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-amber-100 to-amber-200">
                <tr>
                  <th className="text-left py-4 px-4 font-bold text-amber-800 text-lg border-r border-amber-300">Description</th>
                  <th className="text-center py-4 px-4 font-bold text-amber-800 text-lg border-r border-amber-300">Qty</th>
                  <th className="text-right py-4 px-4 font-bold text-amber-800 text-lg border-r border-amber-300">Rate</th>
                  <th className="text-right py-4 px-4 font-bold text-amber-800 text-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-amber-25'} border-b border-amber-200`}>
                    <td className="py-4 px-4 text-gray-800 border-r border-amber-200">{item.description || 'Item description'}</td>
                    <td className="py-4 px-4 text-center text-gray-700 border-r border-amber-200">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-700 border-r border-amber-200">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vintage Totals & Payment */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="col-span-2">
              {invoice.notes && (
                <div className="bg-white p-5 rounded-lg shadow-lg border-2 border-amber-200 relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-300 to-amber-400"></div>
                  <h3 className="text-2xl font-bold mb-6 text-amber-700 border-b-2 border-amber-300 pb-3">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed italic">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-amber-400 rounded-full"></div>
                <div className="bg-white rounded-lg shadow-lg border-4 border-double border-amber-600 p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Tax</span>
                        <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-amber-600 pt-4">
                      <div className="flex justify-between text-2xl font-bold text-amber-800">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200 text-center">
                  <h3 className="text-lg font-bold text-amber-700 mb-4">Scan to Pay</h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4 sepia"
                  />
                  <p className="text-gray-600 italic">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t-2 border-amber-300 pt-8">
              <div className="italic">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ARTISTIC TEMPLATE - Creative flair design
  if (invoice.template === 'artistic') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #fefefe 0%, #f8f9fa 100%)',
      }}>
        {/* Artistic Background */}
        <div className="absolute inset-0 opacity-8">
          <svg className="w-full h-full" viewBox="0 0 800 1200">
            <defs>
              <linearGradient id="artisticGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: styles.accentColor, stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: styles.accentColor, stopOpacity: 0.05 }} />
              </linearGradient>
            </defs>
            <path d="M0,200 Q200,100 400,200 T800,200 L800,400 Q600,300 400,400 T0,400 Z" fill="url(#artisticGrad1)"/>
            <path d="M0,600 Q200,500 400,600 T800,600 L800,800 Q600,700 400,800 T0,800 Z" fill="url(#artisticGrad1)"/>
            <circle cx="150" cy="300" r="50" fill={styles.accentColor} opacity="0.05"/>
            <circle cx="650" cy="700" r="80" fill={styles.accentColor} opacity="0.03"/>
            <polygon points="700,150 750,200 700,250 650,200" fill={styles.accentColor} opacity="0.06"/>
          </svg>
        </div>

        <div className="relative z-10 p-12">
          {/* Artistic Header */}
          <div className="text-center pb-16 mb-16 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-80 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            
            {invoice.company.logo && (
              <div className="mb-10 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full transform rotate-6 scale-110"></div>
                  <div className="relative p-8 bg-white rounded-full shadow-2xl border-4 border-purple-200">
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-24 object-contain"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-400 rounded-full"></div>
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-pink-400 rounded-full"></div>
                </div>
              </div>
            )}
            
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent" style={{ 
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="flex items-center justify-center mb-10">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-400 to-pink-400 flex-1 max-w-48"></div>
              <div className="mx-8 relative">
                <h2 className="text-5xl italic font-light relative z-10 px-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Invoice
                </h2>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full transform scale-150 opacity-50"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-pink-400 via-purple-400 to-transparent flex-1 max-w-48"></div>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl transform rotate-2 scale-105"></div>
              <div className="relative px-12 py-5 bg-white rounded-2xl shadow-xl border-2 border-purple-200">
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  #{invoice.number}
                </span>
              </div>
            </div>
          </div>

          {/* Artistic Content Layout */}
          <div className="grid grid-cols-2 gap-20 mb-20">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-30"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-2xl border-4 border-purple-100 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-pink-100 rounded-full transform translate-x-16 -translate-y-16"></div>
                <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent border-b-3 border-purple-200 pb-4">
                  Billed To
                </h3>
                <div className="text-gray-800 space-y-4 relative z-10">
                  {invoice.client.name && <p className="font-bold text-2xl text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600 italic text-lg">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed text-lg">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-bl from-pink-300 to-purple-300 rounded-full opacity-30"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-2xl border-4 border-pink-100 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full transform -translate-x-16 -translate-y-16"></div>
                <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent border-b-3 border-pink-200 pb-4">
                  Invoice Details
                </h3>
                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Issue Date:</span>
                    <span className="text-gray-800 font-bold text-xl">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium text-lg">Due Date:</span>
                    <span className="text-gray-800 font-bold text-xl">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artistic Table */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl transform rotate-1 scale-105"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-purple-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 p-2"></div>
              <table className="w-full" style={{ tableLayout: 'fixed' }}>
                <thead className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
                  <tr>
                    <th className="text-left py-8 px-10 font-bold text-purple-800 text-xl">Description</th>
                    <th className="text-center py-8 px-10 font-bold text-purple-800 text-xl">Qty</th>
                    <th className="text-right py-8 px-10 font-bold text-purple-800 text-xl">Rate</th>
                    <th className="text-right py-8 px-10 font-bold text-purple-800 text-xl">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'} border-b border-purple-100`}>
                      <td className="py-8 px-10 text-gray-800 font-medium text-lg">{item.description || 'Item description'}</td>
                      <td className="py-8 px-10 text-center text-gray-700 font-semibold text-lg">{item.quantity}</td>
                      <td className="py-8 px-10 text-right text-gray-700 font-semibold text-lg">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-8 px-10 text-right font-bold text-gray-800 text-xl">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Artistic Totals & Payment */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div className="col-span-2">
              {invoice.notes && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl transform -rotate-1 scale-105"></div>
                  <div className="relative bg-white p-10 rounded-3xl shadow-2xl border-4 border-pink-200">
                    <div className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 w-full mb-8 rounded-full"></div>
                    <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent border-b-3 border-pink-200 pb-4">
                      Notes
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{invoice.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="relative">
                <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full"></div>
                <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-4 border-purple-200 p-10">
                  <div className="space-y-5">
                    <div className="flex justify-between text-gray-700 text-lg">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600 text-lg">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-700 text-lg">
                        <span className="font-medium">Tax</span>
                        <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-4 border-purple-400 pt-5">
                      <div className="flex justify-between text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-5 rounded-3xl shadow-2xl border-4 border-purple-200 text-center">
                  <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Scan to Pay
                  </h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4 rounded-2xl"
                  />
                  <p className="text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t-4 border-purple-200 pt-10">
              <div className="italic font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PROFESSIONAL TEMPLATE - Executive style design
  if (invoice.template === 'professional') {
    return (
      <div className="bg-white" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
      }}>
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-indigo-900/20"></div>
          
          <div className="relative z-10 p-12">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-8">
                {invoice.company.logo && (
                  <div className="bg-white p-5 rounded-xl shadow-lg">
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-18 object-contain"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold tracking-wide">{invoice.company.name || 'Your Company'}</h1>
                  <div className="text-gray-300 text-sm mt-3 space-y-1">
                    {invoice.company.email && <div className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>{invoice.company.email}</div>}
                    {invoice.company.phone && <div className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>{invoice.company.phone}</div>}
                    {invoice.company.address && <div className="whitespace-pre-line">{invoice.company.address}</div>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-5xl font-bold mb-4 tracking-wider">INVOICE</h2>
                <div className="bg-white text-slate-800 px-8 py-4 rounded-lg font-bold text-2xl shadow-lg">
                  #{invoice.number}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Professional Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="col-span-2 bg-slate-50 p-5 rounded-xl border-l-4 border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wide text-lg flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                Bill To
              </h3>
              <div className="space-y-2">
                {invoice.client.name && <p className="font-bold text-xl text-slate-900">{invoice.client.name}</p>}
                {invoice.client.email && <p className="text-slate-600">{invoice.client.email}</p>}
                {invoice.client.address && <p className="text-slate-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border-l-4 border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wide text-lg flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                Invoice Details
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-slate-600 text-sm font-medium">Issue Date:</span>
                  <p className="font-bold text-slate-900">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <span className="text-slate-600 text-sm font-medium">Due Date:</span>
                  <p className="font-bold text-slate-900">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white p-5 rounded-xl shadow-lg">
              <h3 className="font-bold mb-4 uppercase tracking-wide text-lg flex items-center">
                <span className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></span>
                Total Amount
              </h3>
              <div className="text-4xl font-bold mb-2">
                {currencySymbol}{totals.total.toFixed(2)}
              </div>
              <div className="text-gray-300 text-sm">
                {invoice.currency || 'USD'}
              </div>
            </div>
          </div>

          {/* Professional Table */}
          <div className="border-2 border-slate-300 rounded-xl overflow-hidden shadow-lg mb-12">
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <tr>
                  <th className="text-left py-4 px-4 font-bold uppercase tracking-wide text-lg">Description</th>
                  <th className="text-center py-4 px-4 font-bold uppercase tracking-wide text-lg">Qty</th>
                  <th className="text-right py-4 px-4 font-bold uppercase tracking-wide text-lg">Rate</th>
                  <th className="text-right py-4 px-4 font-bold uppercase tracking-wide text-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} border-b border-slate-200`}>
                    <td className="py-4 px-4 border-r border-slate-200 font-medium text-slate-900">{item.description || 'Item description'}</td>
                    <td className="py-4 px-4 text-center border-r border-slate-200 font-semibold text-slate-700">{item.quantity}</td>
                    <td className="py-4 px-4 text-right border-r border-slate-200 font-semibold text-slate-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 text-lg">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Professional Totals & Payment */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="col-span-2">
              {invoice.notes && (
                <div className="bg-slate-50 p-5 rounded-xl border-l-4 border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wide text-lg flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
                    Notes
                  </h3>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-xl border-2 border-slate-300 shadow-sm">
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-medium text-slate-700">Subtotal</span>
                    <span className="font-bold text-slate-900">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-600 text-lg">
                      <span className="font-medium">Discount</span>
                      <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-slate-700">Tax</span>
                      <span className="font-bold text-slate-900">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-3 border-slate-700 pt-4">
                    <div className="flex justify-between text-2xl font-bold text-slate-900">
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-slate-300 text-center">
                  <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wide flex items-center justify-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                    Scan to Pay
                  </h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4"
                  />
                  <p className="text-slate-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="bg-slate-800 text-white text-center py-6 rounded-lg">
              <div className="text-sm font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STARTUP TEMPLATE - Modern casual design
  if (invoice.template === 'startup') {
    return (
      <div className="bg-white relative overflow-hidden" style={{ 
        fontFamily: styles.fontFamily,
        minHeight: '297mm',
        width: '210mm',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}>
        {/* Startup Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
          <div className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 transform rotate-45"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-blue-300 transform rotate-12"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 border-4 border-green-300 rounded-full"></div>
        </div>

        <div className="relative z-10 p-10">
          {/* Startup Header */}
          <div className="text-center pb-12 mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            
            {invoice.company.logo && (
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl transform rotate-3 scale-110 opacity-20"></div>
                  <div className="relative p-6 bg-white rounded-2xl shadow-xl border-2 border-blue-200">
                    <img
                      src={invoice.company.logo}
                      alt="Company logo"
                      className="h-20 object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="flex items-center justify-center mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-purple-400 flex-1 max-w-32"></div>
              <div className="mx-6 relative">
                <h2 className="text-4xl font-light text-gray-600">Invoice</h2>
                <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-purple-400 via-blue-400 to-transparent flex-1 max-w-32"></div>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl transform rotate-1 scale-105 opacity-20"></div>
              <div className="relative px-8 py-3 bg-white rounded-xl shadow-lg border-2 border-blue-200">
                <span className="text-2xl font-bold text-gray-800">#{invoice.number}</span>
              </div>
            </div>
          </div>

          {/* Startup Content Layout */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-30"></div>
              <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-full transform translate-x-12 -translate-y-12"></div>
                <h3 className="text-2xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-3">
                  Bill To
                </h3>
                <div className="text-gray-800 space-y-3 relative z-10">
                  {invoice.client.name && <p className="font-bold text-xl text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line text-gray-600 leading-relaxed">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-bl from-purple-400 to-blue-500 rounded-full opacity-30"></div>
              <div className="bg-white p-5 rounded-2xl shadow-xl border-2 border-purple-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full transform -translate-x-12 -translate-y-12"></div>
                <h3 className="text-2xl font-bold mb-6 text-purple-600 border-b-2 border-purple-200 pb-3">
                  Invoice Details
                </h3>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Issue Date:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Due Date:</span>
                    <span className="text-gray-800 font-bold">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Startup Table */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1"></div>
            <table className="w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="text-left py-4 px-4 font-bold text-gray-800 text-lg">Description</th>
                  <th className="text-center py-4 px-4 font-bold text-gray-800 text-lg">Qty</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-800 text-lg">Rate</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-800 text-lg">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'} border-b border-gray-100`}>
                    <td className="py-4 px-4 text-gray-800 font-medium">{item.description || 'Item description'}</td>
                    <td className="py-4 px-4 text-center text-gray-700 font-semibold">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-gray-700 font-semibold">{currencySymbol}{item.rate.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right font-bold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Startup Totals & Payment */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="col-span-2">
              {invoice.notes && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl shadow-xl border-2 border-blue-100">
                  <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-1 w-full mb-6 rounded-full"></div>
                  <h3 className="text-2xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-3">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full"></div>
                <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span className="font-medium">Discount</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-700">
                        <span className="font-medium">Tax</span>
                        <span className="font-bold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-300 pt-4">
                      <div className="flex justify-between text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment QR Code */}
              {invoice.paymentInfo?.qrCode && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-200 text-center">
                  <h3 className="text-lg font-bold text-blue-600 mb-4">Scan to Pay</h3>
                  <img
                    src={invoice.paymentInfo.qrCode}
                    alt="Payment QR Code"
                    className="w-32 h-32 mx-auto mb-4 rounded-lg"
                  />
                  <p className="text-gray-600 font-medium">{invoice.paymentInfo.method}</p>
                </div>
              )}
            </div>
          </div>

          {invoice.showFooter && (
            <div className="text-center text-gray-500 text-sm border-t-2 border-gray-200 pt-8">
              <div className="font-medium">Generated by Invoice Beautifier</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // FALLBACK - Default template for any other cases
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

      <div className="grid grid-cols-2 gap-4 mb-12">
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
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
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

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="flex justify-center mb-8">
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-4" style={{ color: styles.accentColor }}>
              Scan to Pay
            </h3>
            <img
              src={invoice.paymentInfo.qrCode}
              alt="Payment QR Code"
              className="w-32 h-32 mx-auto mb-4"
            />
            <p className="text-gray-600">{invoice.paymentInfo.method}</p>
          </div>
        </div>
      )}

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