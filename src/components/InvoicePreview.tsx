import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
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

    return { ...baseStyles };
  };

  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    
    let discountAmount = 0;
    if (invoice.discountValue > 0) {
      if (invoice.discountType === 'percentage') {
        discountAmount = (subtotal * invoice.discountValue) / 100;
      } else {
        discountAmount = invoice.discountValue;
      }
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (invoice.taxRates || []).reduce((sum, tax) => sum + (afterDiscount * tax.rate) / 100, 0);
    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const styles = getTemplateStyles();
  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol();

  const renderTemplate = () => {
    switch (invoice.template) {
      case 'artistic':
        return (
          <div className="p-12 bg-gradient-to-br from-purple-50 via-white to-pink-50\" style={{ fontFamily: styles.fontFamily }}>
            {/* Artistic Header with Creative Elements */}
            <div className="relative mb-12">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -z-10"></div>
              <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 -z-10"></div>
              
              {invoice.company.logo && (
                <div className="flex justify-center mb-6">
                  <img src={invoice.company.logo} alt="Company logo" className="h-20 object-contain" />
                </div>
              )}
              
              <div className="text-center">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <div className="relative inline-block">
                  <h2 className="text-3xl font-light text-gray-700 mb-6">Invoice</h2>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
                <div className="mt-8 inline-block px-6 py-3 bg-white rounded-full shadow-lg border-2 border-purple-100">
                  <span className="text-xl font-semibold text-gray-800">#{invoice.number}</span>
                </div>
              </div>
            </div>

            {/* Content with Creative Layout */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
                <h3 className="text-lg font-semibold text-purple-600 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                  Billed To
                </h3>
                <div className="text-gray-800 space-y-2">
                  {invoice.client.name && <p className="font-medium text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-purple-600">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
                <h3 className="text-lg font-semibold text-pink-600 mb-4 flex items-center">
                  <div className="w-3 h-3 bg-pink-400 rounded-full mr-3"></div>
                  Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table with Artistic Styling */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="grid grid-cols-4 gap-4 text-white font-semibold">
                  <div>Description</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Rate</div>
                  <div className="text-right">Amount</div>
                </div>
              </div>
              <div className="p-4">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className={`grid grid-cols-4 gap-4 py-4 ${index !== invoice.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <div className="font-medium text-gray-800">{item.description || 'Item description'}</div>
                    <div className="text-center text-gray-600">{item.quantity}</div>
                    <div className="text-right text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</div>
                    <div className="text-right font-semibold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals with Artistic Design */}
            <div className="flex justify-end mb-8">
              <div className="w-80 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-red-500">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax) => (
                    <div key={tax.id} className="flex justify-between text-gray-600">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 border-gradient-to-r from-purple-200 to-pink-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-purple-600">{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Notes</h3>
                <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
              </div>
            )}

            {invoice.showFooter && (
              <div className="text-center text-gray-400 text-sm mt-12 pt-6 border-t border-gray-200">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'professional':
        return (
          <div className="bg-white" style={{ fontFamily: styles.fontFamily }}>
            {/* Executive Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-12">
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Company logo" className="h-16 object-contain mb-6 filter brightness-0 invert" />
                  )}
                  <h1 className="text-4xl font-bold mb-2">{invoice.company.name || 'Your Company'}</h1>
                  <p className="text-gray-300 text-lg">Professional Invoice</p>
                </div>
                <div className="text-right">
                  <div className="bg-white text-gray-900 px-6 py-3 rounded-lg">
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Invoice</div>
                    <div className="text-2xl font-bold">#{invoice.number}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12">
              {/* Business Details */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Bill To
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    {invoice.client.name && <p className="font-semibold text-xl">{invoice.client.name}</p>}
                    {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                    {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-gray-900 pb-2">
                    Invoice Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Issue Date:</span>
                      <span className="text-gray-900">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">Due Date:</span>
                      <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="text-left py-4 px-6 font-bold uppercase tracking-wide">Description</th>
                      <th className="text-center py-4 px-6 font-bold uppercase tracking-wide">Qty</th>
                      <th className="text-right py-4 px-6 font-bold uppercase tracking-wide">Rate</th>
                      <th className="text-right py-4 px-6 font-bold uppercase tracking-wide">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="py-4 px-6 font-medium text-gray-900">{item.description || 'Item description'}</td>
                        <td className="py-4 px-6 text-center text-gray-700">{item.quantity}</td>
                        <td className="py-4 px-6 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-semibold text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Executive Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-96 bg-gray-50 border-2 border-gray-900 p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Subtotal</span>
                      <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span className="font-semibold">Discount</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-gray-700">
                        <span className="font-semibold">{tax.name} ({tax.rate}%)</span>
                        <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-gray-900 pt-3">
                      <div className="flex justify-between text-2xl font-bold text-gray-900">
                        <span>TOTAL</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-gray-50 p-6 border-l-4 border-gray-900 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-gray-500 text-sm mt-12 pt-6 border-t border-gray-300">
                  Generated by Invoice Beautifier
                </div>
              )}
            </div>
          </div>
        );

      case 'startup':
        return (
          <div className="bg-white" style={{ fontFamily: styles.fontFamily }}>
            {/* Modern Startup Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 opacity-10"></div>
              <div className="relative p-12">
                <div className="flex justify-between items-start mb-8">
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Company logo" className="h-16 object-contain" />
                  )}
                  <div className="text-right">
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full">
                      <span className="text-sm font-medium">Invoice #{invoice.number}</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <p className="text-xl text-gray-600 font-light">Let's make business beautiful</p>
              </div>
            </div>

            <div className="p-12">
              {/* Casual Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-700 mb-4">👋 Billing Details</h3>
                  <div className="space-y-3">
                    {invoice.client.name && <p className="font-semibold text-gray-900 text-lg">{invoice.client.name}</p>}
                    {invoice.client.email && <p className="text-blue-600 font-medium">{invoice.client.email}</p>}
                    {invoice.client.address && <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-3xl border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-700 mb-4">📅 Timeline</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 block">Issued on</span>
                      <span className="font-semibold text-gray-900">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Due by</span>
                      <span className="font-semibold text-gray-900">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modern Items List */}
              <div className="bg-gray-50 rounded-3xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">What we're billing for</h3>
                <div className="space-y-4">
                  {invoice.items.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-lg mb-2">{item.description || 'Item description'}</h4>
                          <p className="text-gray-500">Quantity: {item.quantity} × {currencySymbol}{item.rate.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friendly Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-96 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-6">💰 Total Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Subtotal</span>
                      <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-gray-300">
                        <span>{tax.name} ({tax.rate}%)</span>
                        <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between text-2xl font-bold">
                        <span>Total</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl mb-8">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">📝 Additional Notes</h3>
                  <p className="text-yellow-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-gray-400 text-sm mt-12 pt-6 border-t border-gray-200">
                  Made with ❤️ by Invoice Beautifier
                </div>
              )}
            </div>
          </div>
        );

      case 'boutique':
        return (
          <div className="bg-cream-50" style={{ fontFamily: styles.fontFamily, backgroundColor: '#fefdf8' }}>
            {/* Luxury Header */}
            <div className="relative p-12 bg-gradient-to-b from-amber-50 to-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
              
              <div className="text-center mb-12">
                {invoice.company.logo && (
                  <div className="mb-8">
                    <img src={invoice.company.logo} alt="Company logo" className="h-20 object-contain mx-auto" />
                  </div>
                )}
                
                <h1 className="text-6xl font-light text-gray-800 mb-4 tracking-wide">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-px bg-amber-400"></div>
                  <span className="mx-4 text-2xl font-light text-amber-600 italic">Invoice</span>
                  <div className="w-16 h-px bg-amber-400"></div>
                </div>
                <div className="inline-block border-2 border-amber-400 px-8 py-3 bg-white">
                  <span className="text-xl font-medium text-gray-800">#{invoice.number}</span>
                </div>
              </div>
            </div>

            <div className="p-12">
              {/* Elegant Details */}
              <div className="grid grid-cols-2 gap-16 mb-16">
                <div className="bg-white p-8 shadow-lg border border-amber-100">
                  <h3 className="text-xl font-medium text-amber-700 mb-6 border-b border-amber-200 pb-3">
                    Billed To
                  </h3>
                  <div className="space-y-3">
                    {invoice.client.name && <p className="font-medium text-xl text-gray-800">{invoice.client.name}</p>}
                    {invoice.client.email && <p className="text-amber-600 italic">{invoice.client.email}</p>}
                    {invoice.client.address && <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
                  </div>
                </div>

                <div className="bg-white p-8 shadow-lg border border-amber-100">
                  <h3 className="text-xl font-medium text-amber-700 mb-6 border-b border-amber-200 pb-3">
                    Invoice Details
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
                  </div>
                </div>
              </div>

              {/* Luxury Items Table */}
              <div className="bg-white shadow-lg border border-amber-100 mb-12">
                <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-6">
                  <div className="grid grid-cols-4 gap-6 text-amber-800 font-medium">
                    <div>Description</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-right">Rate</div>
                    <div className="text-right">Amount</div>
                  </div>
                </div>
                <div className="p-6">
                  {invoice.items.map((item, index) => (
                    <div key={item.id} className={`grid grid-cols-4 gap-6 py-6 ${index !== invoice.items.length - 1 ? 'border-b border-amber-100' : ''}`}>
                      <div className="font-medium text-gray-800">{item.description || 'Item description'}</div>
                      <div className="text-center text-gray-600">{item.quantity}</div>
                      <div className="text-right text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</div>
                      <div className="text-right font-semibold text-gray-800">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-96 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-medium">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span className="font-medium">Discount</span>
                        <span className="font-medium">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-gray-700">
                        <span className="font-medium">{tax.name} ({tax.rate}%)</span>
                        <span className="font-medium">{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t-2 border-amber-300 pt-4">
                      <div className="flex justify-between text-2xl font-bold text-amber-800">
                        <span>Total</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-white p-8 shadow-lg border border-amber-100 mb-8">
                  <h3 className="text-xl font-medium text-amber-700 mb-4 border-b border-amber-200 pb-3">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed italic">{invoice.notes}</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-amber-600 text-sm mt-12 pt-6 border-t border-amber-200 italic">
                  Crafted with care by Invoice Beautifier
                </div>
              )}
            </div>
          </div>
        );

      case 'minimal':
        return (
          <div className="p-16 bg-white" style={{ fontFamily: styles.fontFamily }}>
            {/* Ultra Clean Header */}
            <div className="mb-20">
              {invoice.company.logo && (
                <div className="mb-12">
                  <img src={invoice.company.logo} alt="Company logo" className="h-12 object-contain" />
                </div>
              )}
              
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h1 className="text-4xl font-light text-gray-900 mb-2">
                    {invoice.company.name || 'Your Company'}
                  </h1>
                  <p className="text-lg text-gray-500 font-light">Invoice</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-gray-900">#{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Clean Information */}
            <div className="grid grid-cols-2 gap-20 mb-20">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Bill To</h3>
                <div className="space-y-2">
                  {invoice.client.name && <p className="text-lg text-gray-900">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="text-gray-600">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date</span>
                    <span className="text-gray-900">{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date</span>
                    <span className="text-gray-900">{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Minimal Table */}
            <div className="mb-16">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 text-sm uppercase tracking-wider text-gray-500 font-normal">Description</th>
                    <th className="text-center py-4 text-sm uppercase tracking-wider text-gray-500 font-normal">Qty</th>
                    <th className="text-right py-4 text-sm uppercase tracking-wider text-gray-500 font-normal">Rate</th>
                    <th className="text-right py-4 text-sm uppercase tracking-wider text-gray-500 font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-6 text-gray-900">{item.description || 'Item description'}</td>
                      <td className="py-6 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-6 text-right text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-6 text-right text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clean Totals */}
            <div className="flex justify-end mb-16">
              <div className="w-80">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax) => (
                    <div key={tax.id} className="flex justify-between text-gray-600">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl text-gray-900">
                      <span>Total</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-16">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
              </div>
            )}

            {invoice.showFooter && (
              <div className="text-center text-gray-400 text-sm mt-20 pt-8 border-t border-gray-100">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'tech':
        return (
          <div className="bg-gray-900 text-white" style={{ fontFamily: styles.fontFamily }}>
            {/* Futuristic Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 opacity-20"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400"></div>
              
              <div className="relative p-12">
                <div className="flex justify-between items-start mb-8">
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Company logo" className="h-16 object-contain filter brightness-0 invert" />
                  )}
                  <div className="text-right">
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-lg">
                      <span className="text-sm font-mono uppercase tracking-wider">Invoice #{invoice.number}</span>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <p className="text-xl text-gray-300 font-mono">// Digital Invoice System</p>
              </div>
            </div>

            <div className="p-12">
              {/* Tech Info Panels */}
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="bg-gray-800 border border-blue-500 p-6 rounded-lg">
                  <h3 className="text-lg font-mono text-blue-400 mb-4 uppercase tracking-wide">
                    &gt; Client_Data
                  </h3>
                  <div className="space-y-2 font-mono">
                    {invoice.client.name && <p className="text-white"><span className="text-cyan-400">name:</span> "{invoice.client.name}"</p>}
                    {invoice.client.email && <p className="text-white"><span className="text-cyan-400">email:</span> "{invoice.client.email}"</p>}
                    {invoice.client.address && <p className="text-white"><span className="text-cyan-400">address:</span> "{invoice.client.address.replace(/\n/g, '\\n')}"</p>}
                  </div>
                </div>

                <div className="bg-gray-800 border border-purple-500 p-6 rounded-lg">
                  <h3 className="text-lg font-mono text-purple-400 mb-4 uppercase tracking-wide">
                    &gt; Invoice_Meta
                  </h3>
                  <div className="space-y-2 font-mono">
                    <p className="text-white"><span className="text-cyan-400">issued:</span> "{formatDate(invoice.issueDate)}"</p>
                    <p className="text-white"><span className="text-cyan-400">due:</span> "{formatDate(invoice.dueDate)}"</p>
                    <p className="text-white"><span className="text-cyan-400">status:</span> "pending"</p>
                  </div>
                </div>
              </div>

              {/* Futuristic Items Display */}
              <div className="bg-gray-800 border border-gray-600 rounded-lg mb-8 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4">
                  <h3 className="text-lg font-mono text-cyan-400 uppercase tracking-wide">&gt; Line_Items.execute()</h3>
                </div>
                <div className="p-6">
                  {invoice.items.map((item, index) => (
                    <div key={item.id} className={`flex justify-between items-center py-4 font-mono ${index !== invoice.items.length - 1 ? 'border-b border-gray-700' : ''}`}>
                      <div className="flex-1">
                        <span className="text-blue-400">item[{index}]:</span>
                        <span className="text-white ml-2">"{item.description || 'Item description'}"</span>
                      </div>
                      <div className="text-right space-x-6">
                        <span className="text-cyan-400">{item.quantity}x</span>
                        <span className="text-purple-400">{currencySymbol}{item.rate.toFixed(2)}</span>
                        <span className="text-green-400 font-bold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-96 bg-gray-800 border border-green-500 p-6 rounded-lg">
                  <h3 className="text-lg font-mono text-green-400 mb-4 uppercase tracking-wide">&gt; Calculate_Total()</h3>
                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>subtotal =</span>
                      <span className="text-white">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>discount =</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-gray-300">
                        <span>{tax.name.toLowerCase().replace(' ', '_')} =</span>
                        <span className="text-white">{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-green-500 pt-3">
                      <div className="flex justify-between text-xl font-bold text-green-400">
                        <span>return total;</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-gray-800 border border-yellow-500 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-mono text-yellow-400 mb-4 uppercase tracking-wide">&gt; Additional_Notes</h3>
                  <p className="text-gray-300 whitespace-pre-line leading-relaxed font-mono">/* {invoice.notes} */</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-gray-500 text-sm mt-12 pt-6 border-t border-gray-700 font-mono">
                  // Generated by Invoice Beautifier v2.0
                </div>
              )}
            </div>
          </div>
        );

      case 'vintage':
        return (
          <div className="bg-amber-50" style={{ fontFamily: styles.fontFamily, backgroundColor: '#fefcf3' }}>
            {/* Vintage Header */}
            <div className="relative p-12 bg-gradient-to-b from-amber-100 to-amber-50">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600"></div>
              <div className="absolute top-4 left-0 w-full h-1 bg-amber-800"></div>
              
              <div className="text-center mb-12 mt-8">
                {invoice.company.logo && (
                  <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-amber-200 rounded-full blur-xl opacity-30"></div>
                    <img src={invoice.company.logo} alt="Company logo" className="h-24 object-contain mx-auto relative z-10" />
                  </div>
                )}
                
                <div className="border-4 border-amber-800 p-8 bg-white shadow-lg">
                  <h1 className="text-5xl font-bold text-amber-900 mb-4 tracking-wide">
                    {invoice.company.name || 'Your Company'}
                  </h1>
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-px bg-amber-600"></div>
                    <span className="mx-6 text-3xl font-serif text-amber-700 italic">Invoice</span>
                    <div className="w-20 h-px bg-amber-600"></div>
                  </div>
                  <div className="inline-block border-2 border-amber-600 px-6 py-2 bg-amber-100">
                    <span className="text-xl font-bold text-amber-900">No. {invoice.number}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12">
              {/* Vintage Details */}
              <div className="grid grid-cols-2 gap-12 mb-16">
                <div className="bg-white p-8 border-4 border-amber-800 shadow-lg">
                  <h3 className="text-2xl font-serif text-amber-800 mb-6 text-center border-b-2 border-amber-600 pb-3">
                    Bill To
                  </h3>
                  <div className="space-y-3 text-center">
                    {invoice.client.name && <p className="font-bold text-2xl text-amber-900">{invoice.client.name}</p>}
                    {invoice.client.email && <p className="text-amber-700 italic text-lg">{invoice.client.email}</p>}
                    {invoice.client.address && <p className="text-amber-800 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>}
                  </div>
                </div>

                <div className="bg-white p-8 border-4 border-amber-800 shadow-lg">
                  <h3 className="text-2xl font-serif text-amber-800 mb-6 text-center border-b-2 border-amber-600 pb-3">
                    Particulars
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-amber-300 pb-2">
                      <span className="text-amber-700 font-serif text-lg">Date of Issue:</span>
                      <span className="text-amber-900 font-bold">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-amber-300 pb-2">
                      <span className="text-amber-700 font-serif text-lg">Date Due:</span>
                      <span className="text-amber-900 font-bold">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vintage Items Table */}
              <div className="bg-white border-4 border-amber-800 shadow-lg mb-12">
                <div className="bg-amber-200 p-6 border-b-2 border-amber-800">
                  <div className="grid grid-cols-4 gap-6 text-amber-900 font-bold text-lg">
                    <div className="text-center">Description of Services</div>
                    <div className="text-center">Quantity</div>
                    <div className="text-center">Rate</div>
                    <div className="text-center">Amount</div>
                  </div>
                </div>
                <div className="p-6">
                  {invoice.items.map((item, index) => (
                    <div key={item.id} className={`grid grid-cols-4 gap-6 py-6 text-center ${index !== invoice.items.length - 1 ? 'border-b-2 border-amber-200' : ''}`}>
                      <div className="font-serif text-amber-900 text-lg">{item.description || 'Item description'}</div>
                      <div className="text-amber-800 font-bold text-lg">{item.quantity}</div>
                      <div className="text-amber-800 font-bold text-lg">{currencySymbol}{item.rate.toFixed(2)}</div>
                      <div className="font-bold text-amber-900 text-xl">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vintage Totals */}
              <div className="flex justify-end mb-12">
                <div className="w-96 bg-white border-4 border-amber-800 p-8 shadow-lg">
                  <h3 className="text-2xl font-serif text-amber-800 mb-6 text-center border-b-2 border-amber-600 pb-3">
                    Total Amount
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-amber-700 text-lg border-b border-amber-300 pb-2">
                      <span className="font-serif">Subtotal:</span>
                      <span className="font-bold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-700 text-lg border-b border-amber-300 pb-2">
                        <span className="font-serif">Discount:</span>
                        <span className="font-bold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between text-amber-700 text-lg border-b border-amber-300 pb-2">
                        <span className="font-serif">{tax.name} ({tax.rate}%):</span>
                        <span className="font-bold">{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t-4 border-amber-800 pt-4">
                      <div className="flex justify-between text-3xl font-bold text-amber-900">
                        <span className="font-serif">Grand Total:</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-white border-4 border-amber-800 p-8 shadow-lg mb-8">
                  <h3 className="text-2xl font-serif text-amber-800 mb-6 text-center border-b-2 border-amber-600 pb-3">
                    Additional Remarks
                  </h3>
                  <p className="text-amber-800 whitespace-pre-line leading-relaxed text-lg font-serif italic text-center">{invoice.notes}</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-amber-600 text-sm mt-12 pt-6 border-t-2 border-amber-400 font-serif italic">
                  Respectfully prepared by Invoice Beautifier
                </div>
              )}
            </div>
          </div>
        );

      // Default templates (elegant, modern, corporate, creative, dynamic)
      default:
        return (
          <div className="p-12 bg-white" style={{ 
            fontFamily: styles.fontFamily,
            minHeight: '297mm',
            width: '210mm',
            margin: '0 auto',
          }}>
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
              <div className="text-center mb-6">
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
                  {invoice.taxRates.map((tax) => (
                    <div key={tax.id} className="flex justify-between py-3 border-b border-gray-200">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span className="font-medium">{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                    </div>
                  ))}
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
    }
  };

  return renderTemplate();
};

export default InvoicePreview;