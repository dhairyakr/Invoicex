import React from 'react';
import { Invoice } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  // Calculate totals
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

  const taxAmount = invoice.taxRates.reduce(
    (sum, tax) => sum + (afterDiscount * tax.rate) / 100,
    0
  );

  const total = afterDiscount + taxAmount;

  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const getFontFamily = () => {
    const fontMap = {
      inter: 'Inter, sans-serif',
      roboto: 'Roboto, sans-serif',
      montserrat: 'Montserrat, sans-serif',
      playfair: 'Playfair Display, serif',
      opensans: 'Open Sans, sans-serif',
      lato: 'Lato, sans-serif',
      poppins: 'Poppins, sans-serif',
      sourcesans: 'Source Sans Pro, sans-serif',
      nunito: 'Nunito, sans-serif',
      merriweather: 'Merriweather, serif',
      raleway: 'Raleway, sans-serif',
      crimson: 'Crimson Text, serif',
    };
    return fontMap[invoice.font as keyof typeof fontMap] || 'Inter, sans-serif';
  };

  // Template-specific rendering
  const renderTemplate = () => {
    switch (invoice.template) {
      case 'modern':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Left Column - Company Info */}
              <div>
                {invoice.company.logo && (
                  <img 
                    src={invoice.company.logo} 
                    alt="Company Logo" 
                    className="h-16 w-auto mb-6 object-contain"
                  />
                )}
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold" style={{ color: invoice.accentColor }}>
                    {invoice.company.name}
                  </h1>
                  <p className="text-gray-600">{invoice.company.email}</p>
                  <p className="text-gray-600">{invoice.company.phone}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.company.address}</p>
                </div>
              </div>

              {/* Right Column - Invoice Info */}
              <div className="text-right">
                <h2 className="text-4xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  INVOICE
                </h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">Invoice #:</span> {invoice.number}</p>
                  <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
                  <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                Bill To:
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{invoice.client.name}</p>
                <p className="text-gray-600">{invoice.client.email}</p>
                <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold w-20">Qty</th>
                    <th className="text-right py-3 font-semibold w-24">Rate</th>
                    <th className="text-right py-3 font-semibold w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{tax.name} ({tax.rate}%):</span>
                      <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 pt-2 flex justify-between font-bold text-lg" style={{ borderColor: invoice.accentColor }}>
                    <span>Total:</span>
                    <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                  Notes:
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                  Payment QR Code:
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'corporate':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Header */}
            <div className="border-b-4 pb-6 mb-8" style={{ borderColor: invoice.accentColor }}>
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img 
                      src={invoice.company.logo} 
                      alt="Company Logo" 
                      className="h-20 w-auto mb-4 object-contain"
                    />
                  )}
                  <h1 className="text-3xl font-bold" style={{ color: invoice.accentColor }}>
                    {invoice.company.name}
                  </h1>
                </div>
                <div className="text-right">
                  <h2 className="text-5xl font-bold" style={{ color: invoice.accentColor }}>
                    INVOICE
                  </h2>
                  <p className="text-xl font-semibold mt-2">{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                  FROM:
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold">{invoice.company.name}</p>
                  <p>{invoice.company.email}</p>
                  <p>{invoice.company.phone}</p>
                  <p className="whitespace-pre-line">{invoice.company.address}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                  TO:
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p className="whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-600">ISSUE DATE</p>
                <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">DUE DATE</p>
                <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">AMOUNT DUE</p>
                <p className="font-semibold text-xl" style={{ color: invoice.accentColor }}>
                  {getCurrencySymbol()}{total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-4 px-4 font-bold">DESCRIPTION</th>
                    <th className="text-center py-4 px-4 font-bold w-20">QTY</th>
                    <th className="text-right py-4 px-4 font-bold w-24">RATE</th>
                    <th className="text-right py-4 px-4 font-bold w-24">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-4 px-4">{item.description}</td>
                      <td className="py-4 px-4 text-center">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span className="font-semibold">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-semibold">{tax.name} ({tax.rate}%):</span>
                      <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 pt-3 flex justify-between font-bold text-xl" style={{ borderColor: invoice.accentColor }}>
                    <span>TOTAL:</span>
                    <span style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                  NOTES:
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                  PAYMENT QR CODE:
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'creative':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Creative Header with Diagonal Design */}
            <div className="relative mb-8 overflow-hidden">
              <div 
                className="absolute inset-0 transform -skew-y-1 origin-top-left"
                style={{ backgroundColor: invoice.accentColor }}
              ></div>
              <div className="relative z-10 p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img 
                        src={invoice.company.logo} 
                        alt="Company Logo" 
                        className="h-16 w-auto mb-4 object-contain filter brightness-0 invert"
                      />
                    )}
                    <h1 className="text-3xl font-bold">{invoice.company.name}</h1>
                    <p className="opacity-90">{invoice.company.email}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-6xl font-bold opacity-90">INVOICE</h2>
                    <p className="text-xl">{invoice.number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info with Creative Layout */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: invoice.accentColor }}
                ></div>
                <h3 className="text-xl font-bold">Bill To</h3>
              </div>
              <div className="ml-7 space-y-1">
                <p className="text-xl font-semibold">{invoice.client.name}</p>
                <p className="text-gray-600">{invoice.client.email}</p>
                <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>

            {/* Invoice Details in Creative Boxes */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 border-2 rounded-lg" style={{ borderColor: invoice.accentColor }}>
                <p className="text-sm font-semibold text-gray-600 mb-1">ISSUE DATE</p>
                <p className="font-bold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div className="text-center p-4 border-2 rounded-lg" style={{ borderColor: invoice.accentColor }}>
                <p className="text-sm font-semibold text-gray-600 mb-1">DUE DATE</p>
                <p className="font-bold">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="text-center p-4 border-2 rounded-lg" style={{ borderColor: invoice.accentColor, backgroundColor: `${invoice.accentColor}10` }}>
                <p className="text-sm font-semibold text-gray-600 mb-1">TOTAL</p>
                <p className="font-bold text-xl" style={{ color: invoice.accentColor }}>
                  {getCurrencySymbol()}{total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items with Creative Styling */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: invoice.accentColor }}
                ></div>
                <h3 className="text-xl font-bold">Services & Products</h3>
              </div>
              
              <div className="space-y-3">
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
                    <div className="flex-1">
                      <p className="font-semibold">{item.description}</p>
                      <p className="text-sm text-gray-600">{item.quantity} × {getCurrencySymbol()}{item.rate.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creative Totals Section */}
            <div className="mb-8">
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between p-3 bg-red-50 rounded text-red-600">
                      <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span className="font-semibold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded">
                      <span>{tax.name} ({tax.rate}%):</span>
                      <span className="font-semibold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div 
                    className="flex justify-between p-4 rounded text-white font-bold text-xl"
                    style={{ backgroundColor: invoice.accentColor }}
                  >
                    <span>TOTAL:</span>
                    <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: invoice.accentColor }}
                  ></div>
                  <h3 className="text-xl font-bold">Notes</h3>
                </div>
                <div className="ml-7 p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: invoice.accentColor }}
                  ></div>
                  <h3 className="text-xl font-bold">Payment QR Code</h3>
                </div>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'boutique':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Elegant Header */}
            <div className="text-center mb-12 border-b border-gray-200 pb-8">
              {invoice.company.logo && (
                <img 
                  src={invoice.company.logo} 
                  alt="Company Logo" 
                  className="h-20 w-auto mx-auto mb-6 object-contain"
                />
              )}
              <h1 className="text-4xl font-light mb-2" style={{ color: invoice.accentColor }}>
                {invoice.company.name}
              </h1>
              <p className="text-gray-600 italic">{invoice.company.email}</p>
              <div className="mt-8">
                <h2 className="text-5xl font-light tracking-wider" style={{ color: invoice.accentColor }}>
                  INVOICE
                </h2>
                <p className="text-xl font-light mt-2">{invoice.number}</p>
              </div>
            </div>

            {/* Elegant Info Layout */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4 tracking-wide" style={{ color: invoice.accentColor }}>
                  BILLED TO
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-light">{invoice.client.name}</p>
                  <p className="text-gray-600">{invoice.client.email}</p>
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-4 tracking-wide" style={{ color: invoice.accentColor }}>
                  INVOICE DETAILS
                </h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Issue Date:</span> <span className="font-light">{formatDate(invoice.issueDate)}</span></p>
                  <p><span className="text-gray-600">Due Date:</span> <span className="font-light">{formatDate(invoice.dueDate)}</span></p>
                  <p><span className="text-gray-600">Amount Due:</span> <span className="font-semibold text-xl" style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span></p>
                </div>
              </div>
            </div>

            {/* Elegant Items Table */}
            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                    <th className="text-left py-4 font-semibold tracking-wide">DESCRIPTION</th>
                    <th className="text-center py-4 font-semibold tracking-wide w-20">QTY</th>
                    <th className="text-right py-4 font-semibold tracking-wide w-32">RATE</th>
                    <th className="text-right py-4 font-semibold tracking-wide w-32">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-6 font-light">{item.description}</td>
                      <td className="py-6 text-center font-light">{item.quantity}</td>
                      <td className="py-6 text-right font-light">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-6 text-right font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Elegant Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-80">
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="font-light">Subtotal</span>
                    <span className="font-light">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span className="font-light">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})</span>
                      <span className="font-light">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span className="font-light">{tax.name} ({tax.rate}%)</span>
                      <span className="font-light">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 pt-4 flex justify-between" style={{ borderColor: invoice.accentColor }}>
                    <span className="font-semibold text-xl tracking-wide">TOTAL</span>
                    <span className="font-bold text-2xl" style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-12">
                <h3 className="text-lg font-semibold mb-4 tracking-wide" style={{ color: invoice.accentColor }}>
                  NOTES
                </h3>
                <p className="text-gray-700 font-light leading-relaxed whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold mb-4 tracking-wide" style={{ color: invoice.accentColor }}>
                  PAYMENT QR CODE
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2 font-light">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'minimal':
        return (
          <div className="bg-white p-12 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Minimal Header */}
            <div className="flex justify-between items-start mb-16">
              <div>
                {invoice.company.logo && (
                  <img 
                    src={invoice.company.logo} 
                    alt="Company Logo" 
                    className="h-12 w-auto mb-8 object-contain"
                  />
                )}
                <h1 className="text-2xl font-medium text-gray-900">{invoice.company.name}</h1>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-light text-gray-900 mb-2">Invoice</h2>
                <p className="text-gray-600">{invoice.number}</p>
              </div>
            </div>

            {/* Minimal Info */}
            <div className="grid grid-cols-2 gap-16 mb-16">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">From</h3>
                <div className="space-y-1 text-gray-900">
                  <p>{invoice.company.name}</p>
                  <p>{invoice.company.email}</p>
                  <p>{invoice.company.phone}</p>
                  <p className="whitespace-pre-line">{invoice.company.address}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">To</h3>
                <div className="space-y-1 text-gray-900">
                  <p className="font-medium">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p className="whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>
            </div>

            {/* Minimal Dates */}
            <div className="grid grid-cols-2 gap-16 mb-16">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Issue Date</h3>
                <p className="text-gray-900">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Due Date</h3>
                <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>

            {/* Minimal Items */}
            <div className="mb-16">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="text-right py-4 text-sm font-medium text-gray-500 uppercase tracking-wider w-20">Qty</th>
                    <th className="text-right py-4 text-sm font-medium text-gray-500 uppercase tracking-wider w-32">Rate</th>
                    <th className="text-right py-4 text-sm font-medium text-gray-500 uppercase tracking-wider w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-6 text-gray-900">{item.description}</td>
                      <td className="py-6 text-right text-gray-900">{item.quantity}</td>
                      <td className="py-6 text-right text-gray-900">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-6 text-right text-gray-900 font-medium">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
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
                    <span className="text-gray-900">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})</span>
                      <span className="text-gray-900">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <span className="text-gray-600">{tax.name} ({tax.rate}%)</span>
                      <span className="text-gray-900">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-medium text-gray-900">Total</span>
                    <span className="text-lg font-medium text-gray-900">{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-16">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Notes</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Payment QR Code</h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'dynamic':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Dynamic Header with Bold Design */}
            <div className="relative mb-8">
              <div 
                className="absolute inset-0 transform rotate-1"
                style={{ backgroundColor: `${invoice.accentColor}20` }}
              ></div>
              <div className="relative p-8">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img 
                        src={invoice.company.logo} 
                        alt="Company Logo" 
                        className="h-16 w-auto mb-4 object-contain"
                      />
                    )}
                    <h1 className="text-4xl font-black" style={{ color: invoice.accentColor }}>
                      {invoice.company.name}
                    </h1>
                    <p className="text-lg font-medium text-gray-700">{invoice.company.email}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-7xl font-black" style={{ color: invoice.accentColor }}>
                      INVOICE
                    </h2>
                    <p className="text-2xl font-bold">{invoice.number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Client Section */}
            <div className="mb-8">
              <div 
                className="inline-block px-6 py-2 text-white font-bold text-lg mb-4"
                style={{ backgroundColor: invoice.accentColor }}
              >
                BILL TO
              </div>
              <div className="ml-4 space-y-2">
                <p className="text-2xl font-bold">{invoice.client.name}</p>
                <p className="text-lg text-gray-600">{invoice.client.email}</p>
                <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>

            {/* Dynamic Date Boxes */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-6 border-4 border-gray-200 transform -rotate-1">
                <p className="text-sm font-bold text-gray-600 mb-2">ISSUE DATE</p>
                <p className="text-xl font-black">{formatDate(invoice.issueDate)}</p>
              </div>
              <div className="text-center p-6 border-4 border-gray-200 transform rotate-1">
                <p className="text-sm font-bold text-gray-600 mb-2">DUE DATE</p>
                <p className="text-xl font-black">{formatDate(invoice.dueDate)}</p>
              </div>
              <div 
                className="text-center p-6 border-4 text-white transform -rotate-1"
                style={{ backgroundColor: invoice.accentColor, borderColor: invoice.accentColor }}
              >
                <p className="text-sm font-bold mb-2">TOTAL DUE</p>
                <p className="text-2xl font-black">{getCurrencySymbol()}{total.toFixed(2)}</p>
              </div>
            </div>

            {/* Dynamic Items */}
            <div className="mb-8">
              <div 
                className="inline-block px-6 py-2 text-white font-bold text-lg mb-4"
                style={{ backgroundColor: invoice.accentColor }}
              >
                SERVICES & PRODUCTS
              </div>
              
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-6 border-l-8 bg-gray-50" style={{ borderColor: invoice.accentColor }}>
                    <div className="flex-1">
                      <p className="text-xl font-bold">{item.description}</p>
                      <p className="text-lg text-gray-600">{item.quantity} × {getCurrencySymbol()}{item.rate.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black" style={{ color: invoice.accentColor }}>
                        {getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-96">
                <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-gray-100 border-l-4" style={{ borderColor: invoice.accentColor }}>
                    <span className="font-bold text-lg">Subtotal:</span>
                    <span className="font-bold text-lg">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between p-4 bg-red-50 border-l-4 border-red-500 text-red-600">
                      <span className="font-bold text-lg">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span className="font-bold text-lg">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between p-4 bg-gray-100 border-l-4" style={{ borderColor: invoice.accentColor }}>
                      <span className="font-bold text-lg">{tax.name} ({tax.rate}%):</span>
                      <span className="font-bold text-lg">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div 
                    className="flex justify-between p-6 text-white border-4"
                    style={{ backgroundColor: invoice.accentColor, borderColor: invoice.accentColor }}
                  >
                    <span className="font-black text-xl">TOTAL:</span>
                    <span className="font-black text-2xl">{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <div 
                  className="inline-block px-6 py-2 text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: invoice.accentColor }}
                >
                  NOTES
                </div>
                <div className="ml-4 p-6 bg-gray-50 border-l-8" style={{ borderColor: invoice.accentColor }}>
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <div 
                  className="inline-block px-6 py-2 text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: invoice.accentColor }}
                >
                  PAYMENT QR CODE
                </div>
                <div className="mt-4">
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32 mx-auto"
                  />
                  <p className="text-lg text-gray-600 mt-2 font-medium">{invoice.paymentInfo.details}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'tech':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Tech Header with Grid Pattern */}
            <div className="relative mb-8 p-8 bg-gray-900 text-white overflow-hidden">
              {/* Grid Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-12 gap-1 h-full">
                  {Array.from({ length: 144 }, (_, i) => (
                    <div key={i} className="bg-white"></div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img 
                      src={invoice.company.logo} 
                      alt="Company Logo" 
                      className="h-16 w-auto mb-4 object-contain filter brightness-0 invert"
                    />
                  )}
                  <h1 className="text-3xl font-mono font-bold">{invoice.company.name}</h1>
                  <p className="text-green-400 font-mono">{invoice.company.email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-6xl font-mono font-bold text-green-400">INVOICE</h2>
                  <p className="text-xl font-mono">{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Tech Client Info */}
            <div className="mb-8 p-6 border-2 border-gray-200 bg-gray-50">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-green-400 mr-3"></div>
                <h3 className="text-xl font-mono font-bold">CLIENT_INFO</h3>
              </div>
              <div className="grid grid-cols-2 gap-8 font-mono">
                <div>
                  <p className="text-sm text-gray-600">NAME:</p>
                  <p className="font-bold">{invoice.client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">EMAIL:</p>
                  <p className="font-bold">{invoice.client.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">ADDRESS:</p>
                  <p className="font-bold whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>
            </div>

            {/* Tech Invoice Details */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 border-2 border-gray-200 bg-gray-50">
                <p className="text-xs font-mono text-gray-600 mb-1">ISSUE_DATE</p>
                <p className="font-mono font-bold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div className="p-4 border-2 border-gray-200 bg-gray-50">
                <p className="text-xs font-mono text-gray-600 mb-1">DUE_DATE</p>
                <p className="font-mono font-bold">{formatDate(invoice.dueDate)}</p>
              </div>
              <div className="p-4 border-2 border-green-400 bg-green-50">
                <p className="text-xs font-mono text-gray-600 mb-1">TOTAL_AMOUNT</p>
                <p className="font-mono font-bold text-xl text-green-600">{getCurrencySymbol()}{total.toFixed(2)}</p>
              </div>
            </div>

            {/* Tech Items Table */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 bg-green-400 mr-3"></div>
                <h3 className="text-xl font-mono font-bold">SERVICES_RENDERED</h3>
              </div>
              
              <table className="w-full border-2 border-gray-200 font-mono">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="text-left py-3 px-4 font-mono">DESCRIPTION</th>
                    <th className="text-center py-3 px-4 font-mono w-20">QTY</th>
                    <th className="text-right py-3 px-4 font-mono w-32">RATE</th>
                    <th className="text-right py-3 px-4 font-mono w-32">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-bold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tech Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80 font-mono">
                <div className="space-y-2">
                  <div className="flex justify-between p-3 bg-gray-100 border border-gray-200">
                    <span>SUBTOTAL:</span>
                    <span className="font-bold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between p-3 bg-red-100 border border-red-200 text-red-600">
                      <span>DISCOUNT ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'FIXED'}):</span>
                      <span className="font-bold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-100 border border-gray-200">
                      <span>{tax.name.toUpperCase()} ({tax.rate}%):</span>
                      <span className="font-bold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between p-4 bg-gray-900 text-white border-2 border-gray-900">
                    <span className="font-bold">TOTAL_DUE:</span>
                    <span className="font-bold text-xl text-green-400">{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-green-400 mr-3"></div>
                  <h3 className="text-xl font-mono font-bold">ADDITIONAL_NOTES</h3>
                </div>
                <div className="p-4 border-2 border-gray-200 bg-gray-50 font-mono">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-4 h-4 bg-green-400 mr-3"></div>
                  <h3 className="text-xl font-mono font-bold">PAYMENT_QR_CODE</h3>
                </div>
                <div className="p-4 border-2 border-gray-200 bg-gray-50 inline-block">
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-sm text-gray-600 mt-2 font-mono">{invoice.paymentInfo.details}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'vintage':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Vintage Header with Ornate Border */}
            <div className="text-center mb-12 border-8 border-double border-gray-800 p-8">
              {invoice.company.logo && (
                <img 
                  src={invoice.company.logo} 
                  alt="Company Logo" 
                  className="h-20 w-auto mx-auto mb-6 object-contain"
                />
              )}
              <div className="border-4 border-gray-600 p-6">
                <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: invoice.accentColor }}>
                  {invoice.company.name}
                </h1>
                <p className="text-lg italic text-gray-700">{invoice.company.email}</p>
                <div className="mt-6">
                  <h2 className="text-6xl font-serif font-bold tracking-wider" style={{ color: invoice.accentColor }}>
                    INVOICE
                  </h2>
                  <p className="text-2xl font-serif mt-2">{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Vintage Info Layout */}
            <div className="grid grid-cols-2 gap-12 mb-12">
              <div className="border-4 border-gray-600 p-6">
                <h3 className="text-xl font-serif font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
                  ~ BILLED TO ~
                </h3>
                <div className="space-y-3 text-center">
                  <p className="text-2xl font-serif font-bold">{invoice.client.name}</p>
                  <p className="text-lg italic">{invoice.client.email}</p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>
                </div>
              </div>
              <div className="border-4 border-gray-600 p-6">
                <h3 className="text-xl font-serif font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
                  ~ INVOICE DETAILS ~
                </h3>
                <div className="space-y-3 text-center">
                  <div>
                    <p className="text-sm font-serif text-gray-600">Issue Date</p>
                    <p className="text-lg font-serif font-bold">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-serif text-gray-600">Due Date</p>
                    <p className="text-lg font-serif font-bold">{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-serif text-gray-600">Amount Due</p>
                    <p className="text-2xl font-serif font-bold" style={{ color: invoice.accentColor }}>
                      {getCurrencySymbol()}{total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vintage Items */}
            <div className="mb-12 border-4 border-gray-600 p-6">
              <h3 className="text-2xl font-serif font-bold mb-6 text-center" style={{ color: invoice.accentColor }}>
                ~ SERVICES RENDERED ~
              </h3>
              
              <table className="w-full">
                <thead>
                  <tr className="border-b-4 border-double border-gray-600">
                    <th className="text-left py-4 font-serif font-bold">DESCRIPTION</th>
                    <th className="text-center py-4 font-serif font-bold w-20">QTY</th>
                    <th className="text-right py-4 font-serif font-bold w-32">RATE</th>
                    <th className="text-right py-4 font-serif font-bold w-32">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-4 font-serif">{item.description}</td>
                      <td className="py-4 text-center font-serif">{item.quantity}</td>
                      <td className="py-4 text-right font-serif">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-4 text-right font-serif font-bold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vintage Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-96 border-4 border-gray-600 p-6">
                <h3 className="text-xl font-serif font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
                  ~ TOTAL CALCULATION ~
                </h3>
                <div className="space-y-3 font-serif">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span>Subtotal</span>
                    <span className="font-bold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between border-b border-gray-300 pb-2 text-red-600">
                      <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})</span>
                      <span className="font-bold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-300 pb-2">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span className="font-bold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-4 border-double border-gray-600 pt-4 flex justify-between">
                    <span className="font-bold text-xl">GRAND TOTAL</span>
                    <span className="font-bold text-2xl" style={{ color: invoice.accentColor }}>
                      {getCurrencySymbol()}{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-12 border-4 border-gray-600 p-6">
                <h3 className="text-xl font-serif font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
                  ~ ADDITIONAL NOTES ~
                </h3>
                <p className="text-gray-700 font-serif leading-relaxed text-center whitespace-pre-line italic">
                  {invoice.notes}
                </p>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center border-4 border-gray-600 p-6">
                <h3 className="text-xl font-serif font-bold mb-4" style={{ color: invoice.accentColor }}>
                  ~ PAYMENT QR CODE ~
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto border-2 border-gray-400"
                />
                <p className="text-sm text-gray-600 mt-2 font-serif italic">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );

      case 'artistic':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Artistic Header with Creative Layout */}
            <div className="relative mb-12 overflow-hidden">
              <div className="absolute inset-0">
                <div 
                  className="w-full h-32 transform -skew-y-2 origin-top-left"
                  style={{ backgroundColor: `${invoice.accentColor}20` }}
                ></div>
              </div>
              <div className="relative z-10 pt-8">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img 
                        src={invoice.company.logo} 
                        alt="Company Logo" 
                        className="h-16 w-auto mb-6 object-contain"
                      />
                    )}
                    <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                      {invoice.company.name}
                    </h1>
                    <p className="text-lg text-gray-600 italic">{invoice.company.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="relative">
                      <h2 className="text-7xl font-bold opacity-20 absolute -top-4 -right-4 text-gray-300">
                        INVOICE
                      </h2>
                      <h2 className="text-5xl font-bold relative z-10" style={{ color: invoice.accentColor }}>
                        INVOICE
                      </h2>
                    </div>
                    <p className="text-xl font-semibold mt-4">{invoice.number}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Artistic Client Section */}
            <div className="mb-12">
              <div className="relative">
                <div 
                  className="absolute left-0 top-0 w-2 h-full"
                  style={{ backgroundColor: invoice.accentColor }}
                ></div>
                <div className="pl-8">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: invoice.accentColor }}>
                    Client Information
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-2xl font-bold mb-2">{invoice.client.name}</p>
                      <p className="text-lg text-gray-600 mb-2">{invoice.client.email}</p>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.client.address}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Issue Date</p>
                        <p className="text-lg font-semibold">{formatDate(invoice.issueDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Due Date</p>
                        <p className="text-lg font-semibold">{formatDate(invoice.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Artistic Items */}
            <div className="mb-12">
              <div className="relative">
                <div 
                  className="absolute left-0 top-0 w-2 h-full"
                  style={{ backgroundColor: invoice.accentColor }}
                ></div>
                <div className="pl-8">
                  <h3 className="text-2xl font-bold mb-6" style={{ color: invoice.accentColor }}>
                    Services & Products
                  </h3>
                  
                  <div className="space-y-6">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-start p-6 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold mb-2">{item.description}</h4>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <span>Quantity: {item.quantity}</span>
                              <span>•</span>
                              <span>Rate: {getCurrencySymbol()}{item.rate.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold" style={{ color: invoice.accentColor }}>
                              {getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Artistic Totals */}
            <div className="mb-12">
              <div className="flex justify-end">
                <div className="w-96">
                  <div className="relative">
                    <div 
                      className="absolute right-0 top-0 w-2 h-full"
                      style={{ backgroundColor: invoice.accentColor }}
                    ></div>
                    <div className="pr-8">
                      <h3 className="text-2xl font-bold mb-6 text-right" style={{ color: invoice.accentColor }}>
                        Total Calculation
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between p-4 bg-gray-50 rounded">
                          <span className="font-semibold">Subtotal</span>
                          <span className="font-semibold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between p-4 bg-red-50 rounded text-red-600">
                            <span className="font-semibold">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})</span>
                            <span className="font-semibold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {invoice.taxRates.map((tax, index) => (
                          <div key={index} className="flex justify-between p-4 bg-gray-50 rounded">
                            <span className="font-semibold">{tax.name} ({tax.rate}%)</span>
                            <span className="font-semibold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                          </div>
                        ))}
                        <div 
                          className="flex justify-between p-6 rounded text-white"
                          style={{ backgroundColor: invoice.accentColor }}
                        >
                          <span className="font-bold text-xl">TOTAL</span>
                          <span className="font-bold text-2xl">{getCurrencySymbol()}{total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-12">
                <div className="relative">
                  <div 
                    className="absolute left-0 top-0 w-2 h-full"
                    style={{ backgroundColor: invoice.accentColor }}
                  ></div>
                  <div className="pl-8">
                    <h3 className="text-2xl font-bold mb-6" style={{ color: invoice.accentColor }}>
                      Additional Notes
                    </h3>
                    <div className="p-6 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">{invoice.notes}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold mb-6" style={{ color: invoice.accentColor }}>
                  Payment QR Code
                </h3>
                <div className="inline-block p-6 bg-gray-50 rounded-lg border-4" style={{ borderColor: invoice.accentColor }}>
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-sm text-gray-600 mt-4 font-medium">{invoice.paymentInfo.details}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'professional':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Professional Header */}
            <div className="border-b-4 border-gray-800 pb-8 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img 
                      src={invoice.company.logo} 
                      alt="Company Logo" 
                      className="h-20 w-auto mb-6 object-contain"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.company.name}</h1>
                  <div className="space-y-1 text-gray-600">
                    <p>{invoice.company.email}</p>
                    <p>{invoice.company.phone}</p>
                    <p className="whitespace-pre-line">{invoice.company.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-5xl font-bold text-gray-900 mb-4">INVOICE</h2>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Invoice Number:</span> {invoice.number}</p>
                    <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
                    <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Client Info */}
            <div className="grid grid-cols-2 gap-12 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Bill To:
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-gray-900">{invoice.client.name}</p>
                  <p className="text-gray-600">{invoice.client.email}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Amount Due</h3>
                  <p className="text-4xl font-bold" style={{ color: invoice.accentColor }}>
                    {getCurrencySymbol()}{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="text-left py-4 px-6 font-bold uppercase tracking-wide">Description</th>
                    <th className="text-center py-4 px-6 font-bold uppercase tracking-wide w-20">Qty</th>
                    <th className="text-right py-4 px-6 font-bold uppercase tracking-wide w-32">Rate</th>
                    <th className="text-right py-4 px-6 font-bold uppercase tracking-wide w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-4 px-6 border-b border-gray-200">{item.description}</td>
                      <td className="py-4 px-6 text-center border-b border-gray-200">{item.quantity}</td>
                      <td className="py-4 px-6 text-right border-b border-gray-200">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right border-b border-gray-200 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Professional Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-96">
                <div className="space-y-3">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-semibold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between py-3 border-b border-gray-200 text-red-600">
                      <span className="font-semibold">Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span className="font-semibold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold">{tax.name} ({tax.rate}%):</span>
                      <span className="font-semibold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-4 border-t-4 border-gray-800">
                    <span className="font-bold text-xl uppercase tracking-wide">Total:</span>
                    <span className="font-bold text-2xl" style={{ color: invoice.accentColor }}>
                      {getCurrencySymbol()}{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Notes:
                </h3>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  Payment QR Code:
                </h3>
                <div className="bg-gray-100 p-6 rounded-lg inline-block">
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'startup':
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Startup Header with Modern Gradient */}
            <div className="relative mb-8 p-8 rounded-2xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${invoice.accentColor}20, ${invoice.accentColor}10)` }}>
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img 
                      src={invoice.company.logo} 
                      alt="Company Logo" 
                      className="h-16 w-auto mb-4 object-contain"
                    />
                  )}
                  <h1 className="text-3xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                    {invoice.company.name}
                  </h1>
                  <p className="text-lg text-gray-600">{invoice.company.email}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-5xl font-bold" style={{ color: invoice.accentColor }}>
                    Invoice
                  </h2>
                  <p className="text-xl font-semibold mt-2">{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Startup Client Info Cards */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl border-2 border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Client Details
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-semibold">{invoice.client.name}</p>
                  <p className="text-gray-600">{invoice.client.email}</p>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>
              <div className="p-6 rounded-xl border-2 border-gray-100 bg-gray-50">
                <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Invoice Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Issue Date</p>
                    <p className="font-semibold">{formatDate(invoice.issueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-semibold">{formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Startup Items with Modern Cards */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6" style={{ color: invoice.accentColor }}>
                Services & Products
              </h3>
              
              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div key={index} className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2">{item.description}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-gray-100 rounded-full">
                            Qty: {item.quantity}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 rounded-full">
                            Rate: {getCurrencySymbol()}{item.rate.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: invoice.accentColor }}>
                          {getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Startup Totals with Modern Design */}
            <div className="flex justify-end mb-8">
              <div className="w-96 p-6 rounded-xl border-2 border-gray-100 bg-gray-50">
                <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Summary
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'})</span>
                      <span className="font-semibold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span className="font-semibold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 pt-3 flex justify-between" style={{ borderColor: invoice.accentColor }}>
                    <span className="font-bold text-xl">Total</span>
                    <span className="font-bold text-2xl" style={{ color: invoice.accentColor }}>
                      {getCurrencySymbol()}{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Notes
                </h3>
                <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Payment QR Code
                </h3>
                <div className="inline-block p-6 rounded-xl border border-gray-200 bg-gray-50">
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32"
                  />
                  <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
                </div>
              </div>
            )}
          </div>
        );

      // Default elegant template
      default:
        return (
          <div className="bg-white p-8 min-h-[297mm] w-[210mm]" style={{ fontFamily: getFontFamily() }}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                {invoice.company.logo && (
                  <img 
                    src={invoice.company.logo} 
                    alt="Company Logo" 
                    className="h-16 w-auto mb-4 object-contain"
                  />
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.company.name}</h1>
                <div className="text-gray-600 space-y-1">
                  <p>{invoice.company.email}</p>
                  <p>{invoice.company.phone}</p>
                  <p className="whitespace-pre-line">{invoice.company.address}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-5xl font-serif font-bold mb-4" style={{ color: invoice.accentColor }}>
                  INVOICE
                </h2>
                <div className="text-gray-600 space-y-1">
                  <p><span className="font-semibold">Number:</span> {invoice.number}</p>
                  <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
                  <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                Bill To:
              </h3>
              <div className="text-gray-700">
                <p className="font-semibold text-lg">{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold w-20">Qty</th>
                    <th className="text-right py-3 font-semibold w-24">Rate</th>
                    <th className="text-right py-3 font-semibold w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3">{item.description}</td>
                      <td className="py-3 text-center">{item.quantity}</td>
                      <td className="py-3 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-3 text-right">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                      <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.taxRates.map((tax, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{tax.name} ({tax.rate}%):</span>
                      <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t-2 pt-2 flex justify-between font-bold text-lg" style={{ borderColor: invoice.accentColor }}>
                    <span>Total:</span>
                    <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                  Notes:
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>
                  Payment QR Code:
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.details}</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="invoice-preview">
      {renderTemplate()}
    </div>
  );
};

export default InvoicePreview;