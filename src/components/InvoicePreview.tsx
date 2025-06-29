import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

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

  // Get currency symbol
  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  // Get font family
  const getFontFamily = () => {
    const fonts = {
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
    return fonts[invoice.font as keyof typeof fonts] || 'Inter, sans-serif';
  };

  // Template-specific styles
  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: getFontFamily(),
      color: '#1f2937',
    };

    switch (invoice.template) {
      case 'elegant':
        return {
          ...baseStyles,
          fontFamily: 'Playfair Display, serif',
        };
      case 'modern':
        return {
          ...baseStyles,
          fontFamily: 'Inter, sans-serif',
        };
      case 'corporate':
        return {
          ...baseStyles,
          fontFamily: 'Roboto, sans-serif',
        };
      case 'creative':
        return {
          ...baseStyles,
          fontFamily: 'Poppins, sans-serif',
        };
      case 'boutique':
        return {
          ...baseStyles,
          fontFamily: 'Montserrat, sans-serif',
        };
      case 'minimal':
        return {
          ...baseStyles,
          fontFamily: 'Inter, sans-serif',
        };
      case 'dynamic':
        return {
          ...baseStyles,
          fontFamily: 'Raleway, sans-serif',
        };
      case 'tech':
        return {
          ...baseStyles,
          fontFamily: 'Source Sans Pro, sans-serif',
        };
      case 'vintage':
        return {
          ...baseStyles,
          fontFamily: 'Merriweather, serif',
        };
      case 'artistic':
        return {
          ...baseStyles,
          fontFamily: 'Crimson Text, serif',
        };
      case 'professional':
        return {
          ...baseStyles,
          fontFamily: 'Roboto, sans-serif',
        };
      case 'startup':
        return {
          ...baseStyles,
          fontFamily: 'Nunito, sans-serif',
        };
      default:
        return baseStyles;
    }
  };

  const templateStyles = getTemplateStyles();

  // Render different templates
  const renderTemplate = () => {
    switch (invoice.template) {
      case 'modern':
        return renderModernTemplate();
      case 'corporate':
        return renderCorporateTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'boutique':
        return renderBoutiqueTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'dynamic':
        return renderDynamicTemplate();
      case 'tech':
        return renderTechTemplate();
      case 'vintage':
        return renderVintageTemplate();
      case 'artistic':
        return renderArtisticTemplate();
      case 'professional':
        return renderProfessionalTemplate();
      case 'startup':
        return renderStartupTemplate();
      default:
        return renderElegantTemplate();
    }
  };

  const renderElegantTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="border-b-2 pb-6 mb-8" style={{ borderColor: invoice.accentColor }}>
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-16 mb-4" />
            )}
            <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
            <div className="text-gray-600 space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              INVOICE
            </h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Invoice #:</span> {invoice.number}</p>
              <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
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
              <th className="text-left py-3 font-bold">Description</th>
              <th className="text-center py-3 font-bold">Qty</th>
              <th className="text-right py-3 font-bold">Rate</th>
              <th className="text-right py-3 font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3">{item.description}</td>
                <td className="text-center py-3">{item.quantity}</td>
                <td className="text-right py-3">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                <td className="text-right py-3">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between py-2 text-red-600">
              <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : getCurrencySymbol() + invoice.discountValue}):</span>
              <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          {invoice.taxRates.map((tax, index) => (
            <div key={index} className="flex justify-between py-2">
              <span>{tax.name} ({tax.rate}%):</span>
              <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t-2 pt-2 mt-2 flex justify-between font-bold text-lg" style={{ borderColor: invoice.accentColor }}>
            <span>Total:</span>
            <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-2" style={{ color: invoice.accentColor }}>
            Notes:
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="mb-8 text-center">
          <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
            Payment QR Code
          </h3>
          <img 
            src={invoice.paymentInfo.qrCode} 
            alt="Payment QR Code" 
            className="mx-auto w-32 h-32"
          />
          <p className="text-sm text-gray-600 mt-2">
            Scan to pay via {invoice.paymentInfo.method}
          </p>
        </div>
      )}
    </div>
  );

  const renderModernTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white">
      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Left Column */}
        <div className="col-span-2">
          {/* Header */}
          <div className="mb-8">
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-12 mb-4" />
            )}
            <h1 className="text-3xl font-bold mb-2" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
            <div className="text-gray-600 text-sm space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
              Bill To:
            </h3>
            <div className="text-gray-700">
              <p className="font-semibold">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: invoice.accentColor }}>
                  <th className="text-left py-2 text-sm font-bold">Description</th>
                  <th className="text-center py-2 text-sm font-bold">Qty</th>
                  <th className="text-right py-2 text-sm font-bold">Rate</th>
                  <th className="text-right py-2 text-sm font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 text-sm">{item.description}</td>
                    <td className="text-center py-2 text-sm">{item.quantity}</td>
                    <td className="text-right py-2 text-sm">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                    <td className="text-right py-2 text-sm">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              INVOICE
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Number:</span> {invoice.number}</p>
              <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            {invoice.taxRates.map((tax, index) => (
              <div key={index} className="flex justify-between">
                <span>{tax.name}:</span>
                <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment QR Code */}
          {invoice.paymentInfo?.qrCode && (
            <div className="mt-6 text-center">
              <h4 className="text-sm font-bold mb-2">Quick Pay</h4>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="mx-auto w-24 h-24"
              />
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="px-8 pb-8">
          <h3 className="text-lg font-bold mb-2" style={{ color: invoice.accentColor }}>
            Notes:
          </h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderCorporateTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white p-8">
      {/* Header with accent background */}
      <div className="p-6 mb-8 rounded-lg" style={{ backgroundColor: `${invoice.accentColor}15` }}>
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-14 mb-4" />
            )}
            <h1 className="text-3xl font-bold" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-2" style={{ color: invoice.accentColor }}>
              INVOICE
            </h2>
            <p className="text-lg font-semibold">{invoice.number}</p>
          </div>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
            From:
          </h3>
          <div className="text-gray-700 space-y-1">
            <p>{invoice.company.email}</p>
            <p>{invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
            To:
          </h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm font-semibold text-gray-600">Issue Date</p>
          <p className="font-bold">{formatDate(invoice.issueDate)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">Due Date</p>
          <p className="font-bold">{formatDate(invoice.dueDate)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">Amount Due</p>
          <p className="font-bold text-lg" style={{ color: invoice.accentColor }}>
            {getCurrencySymbol()}{total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: `${invoice.accentColor}15` }}>
              <th className="text-left py-3 px-4 font-bold border">Description</th>
              <th className="text-center py-3 px-4 font-bold border">Quantity</th>
              <th className="text-right py-3 px-4 font-bold border">Rate</th>
              <th className="text-right py-3 px-4 font-bold border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 border">{item.description}</td>
                <td className="text-center py-3 px-4 border">{item.quantity}</td>
                <td className="text-right py-3 px-4 border">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                <td className="text-right py-3 px-4 border">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span>Subtotal:</span>
            <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between py-2 border-b text-red-600">
              <span>Discount:</span>
              <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          {invoice.taxRates.map((tax, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <span>{tax.name} ({tax.rate}%):</span>
              <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between py-3 font-bold text-lg border-t-2" style={{ borderColor: invoice.accentColor }}>
            <span>Total Amount Due:</span>
            <span style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
            Payment Options
          </h3>
          <img 
            src={invoice.paymentInfo.qrCode} 
            alt="Payment QR Code" 
            className="mx-auto w-32 h-32 border rounded-lg"
          />
          <p className="text-sm text-gray-600 mt-2">
            Scan to pay via {invoice.paymentInfo.method}
          </p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-2" style={{ color: invoice.accentColor }}>
            Additional Notes:
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderCreativeTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white relative overflow-hidden">
      {/* Creative background pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: invoice.accentColor }}>
        <div className="w-full h-full transform rotate-45 translate-x-32 -translate-y-32"></div>
      </div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center">
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-16 mr-6" />
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                {invoice.company.name}
              </h1>
              <div className="text-gray-600">
                <p>{invoice.company.email} • {invoice.company.phone}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block p-4 rounded-lg" style={{ backgroundColor: `${invoice.accentColor}15` }}>
              <h2 className="text-2xl font-bold" style={{ color: invoice.accentColor }}>
                INVOICE
              </h2>
              <p className="text-lg font-semibold">{invoice.number}</p>
            </div>
          </div>
        </div>

        {/* Company Address */}
        <div className="mb-8">
          <p className="text-gray-600 whitespace-pre-line">{invoice.company.address}</p>
        </div>

        {/* Client and Dates */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="p-4 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
            <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
              Billed To:
            </h3>
            <div className="text-gray-700">
              <p className="font-semibold text-lg">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Issue Date</p>
                <p className="font-bold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Due Date</p>
                <p className="font-bold">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="mb-8">
          <div className="rounded-lg overflow-hidden border">
            <table className="w-full">
              <thead style={{ backgroundColor: `${invoice.accentColor}15` }}>
                <tr>
                  <th className="text-left py-4 px-6 font-bold">Service</th>
                  <th className="text-center py-4 px-6 font-bold">Qty</th>
                  <th className="text-right py-4 px-6 font-bold">Rate</th>
                  <th className="text-right py-4 px-6 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6">{item.description}</td>
                    <td className="text-center py-4 px-6">{item.quantity}</td>
                    <td className="text-right py-4 px-6">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                    <td className="text-right py-4 px-6 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2 p-4 rounded-lg bg-gray-50">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.name}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-lg font-bold text-xl" style={{ backgroundColor: `${invoice.accentColor}15`, color: invoice.accentColor }}>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Notes */}
        <div className="grid grid-cols-2 gap-8">
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center">
              <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
                Quick Payment
              </h3>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="mx-auto w-32 h-32 rounded-lg border"
              />
              <p className="text-sm text-gray-600 mt-2">
                {invoice.paymentInfo.method}
              </p>
            </div>
          )}
          {invoice.notes && (
            <div>
              <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                Notes:
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBoutiqueTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white p-8">
      {/* Elegant header with decorative elements */}
      <div className="text-center mb-8 pb-6 border-b-2" style={{ borderColor: invoice.accentColor }}>
        {invoice.company.logo && (
          <img src={invoice.company.logo} alt="Company Logo" className="h-16 mx-auto mb-4" />
        )}
        <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
          {invoice.company.name}
        </h1>
        <div className="text-gray-600 space-y-1">
          <p>{invoice.company.email} • {invoice.company.phone}</p>
          <p className="whitespace-pre-line">{invoice.company.address}</p>
        </div>
      </div>

      {/* Invoice title and number */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: invoice.accentColor }}>
          INVOICE
        </h2>
        <p className="text-xl font-semibold">{invoice.number}</p>
      </div>

      {/* Client and dates in elegant layout */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${invoice.accentColor}08` }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
            Billed To
          </h3>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold text-lg">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${invoice.accentColor}08` }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
            Invoice Details
          </h3>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-semibold text-gray-600">Issue Date</p>
              <p className="font-bold">{formatDate(invoice.issueDate)}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Due Date</p>
              <p className="font-bold">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items with elegant styling */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
              <th className="text-left py-4 font-bold">Description</th>
              <th className="text-center py-4 font-bold">Quantity</th>
              <th className="text-right py-4 font-bold">Rate</th>
              <th className="text-right py-4 font-bold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4">{item.description}</td>
                <td className="text-center py-4">{item.quantity}</td>
                <td className="text-right py-4">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                <td className="text-right py-4 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Elegant totals */}
      <div className="flex justify-center mb-8">
        <div className="w-96 p-6 rounded-lg" style={{ backgroundColor: `${invoice.accentColor}08` }}>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            {invoice.taxRates.map((tax, index) => (
              <div key={index} className="flex justify-between">
                <span>{tax.name}:</span>
                <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t-2 pt-3 flex justify-between font-bold text-xl" style={{ borderColor: invoice.accentColor, color: invoice.accentColor }}>
              <span>Total:</span>
              <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
            Payment
          </h3>
          <img 
            src={invoice.paymentInfo.qrCode} 
            alt="Payment QR Code" 
            className="mx-auto w-32 h-32 rounded-lg border"
          />
          <p className="text-sm text-gray-600 mt-2">
            {invoice.paymentInfo.method}
          </p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="text-center">
          <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
            Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-line max-w-2xl mx-auto">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderMinimalTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white p-8">
      {/* Minimal header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {invoice.company.logo && (
            <img src={invoice.company.logo} alt="Company Logo" className="h-12 mb-4" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">{invoice.company.name}</h1>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-light text-gray-900 mb-2">Invoice</h2>
          <p className="text-gray-600">{invoice.number}</p>
        </div>
      </div>

      {/* Clean info layout */}
      <div className="grid grid-cols-3 gap-8 mb-12 text-sm">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">From</h3>
          <div className="text-gray-600 space-y-1">
            <p>{invoice.company.email}</p>
            <p>{invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">To</h3>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
          <div className="text-gray-600 space-y-1">
            <p>Issue: {formatDate(invoice.issueDate)}</p>
            <p>Due: {formatDate(invoice.dueDate)}</p>
            <p className="font-semibold text-gray-900">{getCurrencySymbol()}{total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Minimal items table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 font-medium text-gray-900">Description</th>
              <th className="text-right py-3 font-medium text-gray-900 w-20">Qty</th>
              <th className="text-right py-3 font-medium text-gray-900 w-24">Rate</th>
              <th className="text-right py-3 font-medium text-gray-900 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3 text-gray-900">{item.description}</td>
                <td className="text-right py-3 text-gray-600">{item.quantity}</td>
                <td className="text-right py-3 text-gray-600">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                <td className="text-right py-3 text-gray-900">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clean totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          {invoice.taxRates.map((tax, index) => (
            <div key={index} className="flex justify-between text-gray-600">
              <span>{tax.name}</span>
              <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="flex justify-center mb-8">
          <div className="text-center">
            <img 
              src={invoice.paymentInfo.qrCode} 
              alt="Payment QR Code" 
              className="w-24 h-24 mx-auto mb-2"
            />
            <p className="text-xs text-gray-500">{invoice.paymentInfo.method}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="text-sm">
          <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderDynamicTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ backgroundColor: invoice.accentColor }}>
        <div className="w-full h-full transform rotate-12 translate-x-24 -translate-y-24 rounded-full"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5" style={{ backgroundColor: invoice.accentColor }}>
        <div className="w-full h-full transform -rotate-12 -translate-x-12 translate-y-12 rounded-full"></div>
      </div>
      
      <div className="relative z-10 p-8">
        {/* Bold header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-16" />
            )}
            <div className="text-right">
              <h2 className="text-4xl font-bold" style={{ color: invoice.accentColor }}>
                INVOICE
              </h2>
              <p className="text-xl font-bold">{invoice.number}</p>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: invoice.accentColor }}>
            {invoice.company.name}
          </h1>
          <div className="text-gray-600 text-lg">
            <p>{invoice.company.email} • {invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>

        {/* Dynamic info cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-6 rounded-xl border-l-4" style={{ borderColor: invoice.accentColor, backgroundColor: `${invoice.accentColor}08` }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              CLIENT
            </h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-bold text-lg">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: `${invoice.accentColor}15` }}>
            <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              TIMELINE
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Issued</p>
                <p className="text-lg">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="font-semibold">Due</p>
                <p className="text-lg font-bold" style={{ color: invoice.accentColor }}>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bold items table */}
        <div className="mb-8">
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: `${invoice.accentColor}08` }}>
            <table className="w-full">
              <thead style={{ backgroundColor: invoice.accentColor }}>
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-white">DESCRIPTION</th>
                  <th className="text-center py-4 px-6 font-bold text-white">QTY</th>
                  <th className="text-right py-4 px-6 font-bold text-white">RATE</th>
                  <th className="text-right py-4 px-6 font-bold text-white">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-white">
                    <td className="py-4 px-6 font-semibold">{item.description}</td>
                    <td className="text-center py-4 px-6">{item.quantity}</td>
                    <td className="text-right py-4 px-6">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                    <td className="text-right py-4 px-6 font-bold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic totals */}
        <div className="flex justify-end mb-8">
          <div className="w-96">
            <div className="space-y-3 p-6 rounded-xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-bold">{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-lg text-red-600">
                  <span className="font-semibold">Discount:</span>
                  <span className="font-bold">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between text-lg">
                  <span className="font-semibold">{tax.name}:</span>
                  <span className="font-bold">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-6 rounded-xl font-bold text-2xl text-white" style={{ backgroundColor: invoice.accentColor }}>
              <div className="flex justify-between">
                <span>TOTAL:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Notes */}
        <div className="grid grid-cols-2 gap-8">
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                QUICK PAY
              </h3>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="mx-auto w-32 h-32 rounded-lg"
              />
              <p className="text-sm font-semibold mt-2">
                {invoice.paymentInfo.method}
              </p>
            </div>
          )}
          {invoice.notes && (
            <div className="p-6 rounded-xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                NOTES
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTechTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-gray-50">
      {/* Tech header with grid pattern */}
      <div className="bg-white p-8 border-b-4" style={{ borderColor: invoice.accentColor }}>
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-14 mb-4" />
            )}
            <h1 className="text-3xl font-bold font-mono mb-2" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
            <div className="text-gray-600 font-mono text-sm space-y-1">
              <p>EMAIL: {invoice.company.email}</p>
              <p>PHONE: {invoice.company.phone}</p>
              <p className="whitespace-pre-line">ADDR: {invoice.company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block p-4 border-2 border-gray-300">
              <h2 className="text-2xl font-bold font-mono" style={{ color: invoice.accentColor }}>
                INVOICE
              </h2>
              <p className="font-mono text-lg">{invoice.number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech info grid */}
      <div className="bg-white p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="p-4 border border-gray-300">
            <h3 className="font-bold font-mono mb-3" style={{ color: invoice.accentColor }}>
              CLIENT_INFO
            </h3>
            <div className="text-gray-700 font-mono text-sm space-y-1">
              <p>NAME: {invoice.client.name}</p>
              <p>EMAIL: {invoice.client.email}</p>
              <p className="whitespace-pre-line">ADDR: {invoice.client.address}</p>
            </div>
          </div>
          <div className="p-4 border border-gray-300">
            <h3 className="font-bold font-mono mb-3" style={{ color: invoice.accentColor }}>
              DATES
            </h3>
            <div className="text-gray-700 font-mono text-sm space-y-1">
              <p>ISSUED: {formatDate(invoice.issueDate)}</p>
              <p>DUE: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          <div className="p-4 border border-gray-300">
            <h3 className="font-bold font-mono mb-3" style={{ color: invoice.accentColor }}>
              AMOUNT_DUE
            </h3>
            <div className="text-2xl font-bold font-mono" style={{ color: invoice.accentColor }}>
              {getCurrencySymbol()}{total.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Tech items table */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-300 font-mono">
            <thead style={{ backgroundColor: `${invoice.accentColor}15` }}>
              <tr>
                <th className="border border-gray-300 py-3 px-4 text-left font-bold">DESCRIPTION</th>
                <th className="border border-gray-300 py-3 px-4 text-center font-bold">QTY</th>
                <th className="border border-gray-300 py-3 px-4 text-right font-bold">RATE</th>
                <th className="border border-gray-300 py-3 px-4 text-right font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 py-3 px-4">{item.description}</td>
                  <td className="border border-gray-300 py-3 px-4 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 py-3 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                  <td className="border border-gray-300 py-3 px-4 text-right font-bold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tech totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80 border border-gray-300 p-4 font-mono">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>DISCOUNT:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.name.toUpperCase()}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t-2 pt-2 flex justify-between font-bold text-lg" style={{ borderColor: invoice.accentColor }}>
                <span>TOTAL:</span>
                <span style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment QR Code */}
        {invoice.paymentInfo?.qrCode && (
          <div className="text-center mb-8">
            <div className="inline-block p-4 border border-gray-300">
              <h3 className="font-bold font-mono mb-4" style={{ color: invoice.accentColor }}>
                PAYMENT_QR
              </h3>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="w-32 h-32 mx-auto"
              />
              <p className="text-sm font-mono mt-2">
                METHOD: {invoice.paymentInfo.method.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="p-4 border border-gray-300">
            <h3 className="font-bold font-mono mb-3" style={{ color: invoice.accentColor }}>
              NOTES
            </h3>
            <p className="text-gray-700 font-mono text-sm whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderVintageTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-amber-50 border-8 border-amber-800">
      {/* Vintage header with decorative border */}
      <div className="bg-amber-100 p-8 border-b-4 border-amber-800">
        <div className="text-center">
          {invoice.company.logo && (
            <img src={invoice.company.logo} alt="Company Logo" className="h-16 mx-auto mb-4" />
          )}
          <div className="border-4 border-amber-800 p-6 inline-block">
            <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
            <div className="text-amber-800 space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Vintage invoice title */}
        <div className="text-center mb-8">
          <div className="inline-block border-4 border-amber-800 p-4">
            <h2 className="text-3xl font-bold" style={{ color: invoice.accentColor }}>
              INVOICE
            </h2>
            <p className="text-xl font-bold">{invoice.number}</p>
          </div>
        </div>

        {/* Vintage info layout */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="border-4 border-amber-800 p-6">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
              BILLED TO
            </h3>
            <div className="text-amber-800 text-center space-y-1">
              <p className="font-bold text-lg">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          <div className="border-4 border-amber-800 p-6">
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: invoice.accentColor }}>
              INVOICE DETAILS
            </h3>
            <div className="text-amber-800 text-center space-y-2">
              <div>
                <p className="font-bold">Issue Date</p>
                <p>{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="font-bold">Due Date</p>
                <p>{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vintage items table */}
        <div className="mb-8">
          <table className="w-full border-4 border-amber-800">
            <thead className="bg-amber-200">
              <tr>
                <th className="border-2 border-amber-800 py-4 px-4 font-bold">DESCRIPTION</th>
                <th className="border-2 border-amber-800 py-4 px-4 font-bold">QTY</th>
                <th className="border-2 border-amber-800 py-4 px-4 font-bold">RATE</th>
                <th className="border-2 border-amber-800 py-4 px-4 font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="bg-amber-50">
                  <td className="border-2 border-amber-800 py-3 px-4">{item.description}</td>
                  <td className="border-2 border-amber-800 py-3 px-4 text-center">{item.quantity}</td>
                  <td className="border-2 border-amber-800 py-3 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                  <td className="border-2 border-amber-800 py-3 px-4 text-right font-bold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vintage totals */}
        <div className="flex justify-center mb-8">
          <div className="border-4 border-amber-800 p-6 bg-amber-100">
            <div className="space-y-3 text-center">
              <div className="flex justify-between w-64">
                <span className="font-bold">Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between w-64 text-red-700">
                  <span className="font-bold">Discount:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between w-64">
                  <span className="font-bold">{tax.name}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t-4 border-amber-800 pt-3 flex justify-between w-64 font-bold text-xl" style={{ color: invoice.accentColor }}>
                <span>TOTAL:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment QR Code */}
        {invoice.paymentInfo?.qrCode && (
          <div className="text-center mb-8">
            <div className="inline-block border-4 border-amber-800 p-6 bg-amber-100">
              <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
                PAYMENT
              </h3>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="w-32 h-32 mx-auto border-2 border-amber-800"
              />
              <p className="text-sm font-bold mt-2">
                {invoice.paymentInfo.method}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="text-center">
            <div className="inline-block border-4 border-amber-800 p-6 bg-amber-100 max-w-2xl">
              <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                NOTES
              </h3>
              <p className="text-amber-800 whitespace-pre-line">{invoice.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderArtisticTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white relative overflow-hidden">
      {/* Artistic background elements */}
      <div className="absolute top-0 left-0 w-full h-32 opacity-10" style={{ background: `linear-gradient(45deg, ${invoice.accentColor}, transparent)` }}></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: invoice.accentColor, borderRadius: '50% 0 0 50%' }}></div>
      
      <div className="relative z-10 p-8">
        {/* Artistic header */}
        <div className="text-center mb-8">
          {invoice.company.logo && (
            <img src={invoice.company.logo} alt="Company Logo" className="h-16 mx-auto mb-6" />
          )}
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              {invoice.company.name}
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 rounded-full" style={{ backgroundColor: invoice.accentColor }}></div>
          </div>
          <div className="mt-6 text-gray-600 space-y-1">
            <p>{invoice.company.email} • {invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>

        {/* Artistic invoice title */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h2 className="text-4xl font-bold" style={{ color: invoice.accentColor }}>
              Invoice
            </h2>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-30" style={{ backgroundColor: invoice.accentColor }}></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: invoice.accentColor }}></div>
          </div>
          <p className="text-xl font-semibold mt-2">{invoice.number}</p>
        </div>

        {/* Artistic info cards */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="relative p-6 rounded-2xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
            <div className="absolute top-0 left-0 w-16 h-16 rounded-full opacity-20" style={{ backgroundColor: invoice.accentColor, transform: 'translate(-50%, -50%)' }}></div>
            <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              Client
            </h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-bold text-lg">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          <div className="relative p-6 rounded-2xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
            <div className="absolute bottom-0 right-0 w-12 h-12 rounded-full opacity-15" style={{ backgroundColor: invoice.accentColor, transform: 'translate(50%, 50%)' }}></div>
            <h3 className="text-xl font-bold mb-4" style={{ color: invoice.accentColor }}>
              Timeline
            </h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Issued</p>
                <p className="text-lg">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="font-semibold">Due</p>
                <p className="text-lg font-bold" style={{ color: invoice.accentColor }}>
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Artistic items */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: `${invoice.accentColor}05` }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: `${invoice.accentColor}15` }}>
                  <th className="text-left py-4 px-6 font-bold">Description</th>
                  <th className="text-center py-4 px-6 font-bold">Qty</th>
                  <th className="text-right py-4 px-6 font-bold">Rate</th>
                  <th className="text-right py-4 px-6 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-white">
                    <td className="py-4 px-6">{item.description}</td>
                    <td className="text-center py-4 px-6">{item.quantity}</td>
                    <td className="text-right py-4 px-6">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                    <td className="text-right py-4 px-6 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artistic totals */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96 p-6 rounded-2xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ backgroundColor: invoice.accentColor, transform: 'translate(50%, -50%)' }}></div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.name}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
              <div className="relative pt-3 flex justify-between font-bold text-xl" style={{ color: invoice.accentColor }}>
                <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: invoice.accentColor }}></div>
                <span>Total:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Notes */}
        <div className="grid grid-cols-2 gap-8">
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center">
              <div className="relative inline-block p-6 rounded-2xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
                <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full opacity-30" style={{ backgroundColor: invoice.accentColor }}></div>
                <h3 className="text-lg font-bold mb-4" style={{ color: invoice.accentColor }}>
                  Payment
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="mx-auto w-32 h-32 rounded-lg"
                />
                <p className="text-sm font-semibold mt-2">
                  {invoice.paymentInfo.method}
                </p>
              </div>
            </div>
          )}
          {invoice.notes && (
            <div className="relative p-6 rounded-2xl" style={{ backgroundColor: `${invoice.accentColor}08` }}>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: invoice.accentColor }}></div>
              <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfessionalTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white">
      {/* Professional header */}
      <div className="bg-gray-900 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-14 mb-4 filter brightness-0 invert" />
            )}
            <h1 className="text-3xl font-bold mb-2">{invoice.company.name}</h1>
            <div className="text-gray-300 space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
            <p className="text-xl">{invoice.number}</p>
            <div className="mt-4 text-sm">
              <p>Issue Date: {formatDate(invoice.issueDate)}</p>
              <p>Due Date: {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Professional client info */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-900">
            Bill To:
          </h3>
          <div className="text-gray-700">
            <p className="font-semibold text-lg">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>

        {/* Professional items table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left py-4 px-6 font-bold">DESCRIPTION</th>
                <th className="text-center py-4 px-6 font-bold">QTY</th>
                <th className="text-right py-4 px-6 font-bold">RATE</th>
                <th className="text-right py-4 px-6 font-bold">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-6">{item.description}</td>
                  <td className="text-center py-4 px-6">{item.quantity}</td>
                  <td className="text-right py-4 px-6">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                  <td className="text-right py-4 px-6 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Professional totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.name}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment QR Code */}
        {invoice.paymentInfo?.qrCode && (
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Payment Information
              </h3>
              <img 
                src={invoice.paymentInfo.qrCode} 
                alt="Payment QR Code" 
                className="mx-auto w-32 h-32 border border-gray-300 rounded"
              />
              <p className="text-sm text-gray-600 mt-2">
                {invoice.paymentInfo.method}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-bold mb-3 text-gray-900">
              Additional Notes:
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStartupTemplate = () => (
    <div style={templateStyles} className="max-w-4xl mx-auto bg-white">
      {/* Startup header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Company Logo" className="h-12 mb-4 filter brightness-0 invert" />
            )}
            <h1 className="text-3xl font-bold mb-2">{invoice.company.name}</h1>
            <div className="text-blue-100 space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-2">Invoice</h2>
              <p className="text-lg">{invoice.number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Startup info cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold mb-3 text-blue-600">
              Client Details
            </h3>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold text-lg">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-bold mb-3 text-purple-600">
              Invoice Timeline
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-gray-600">Issue Date</p>
                <p className="font-bold">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Due Date</p>
                <p className="font-bold text-purple-600">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Startup items table */}
        <div className="mb-8">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <tr>
                  <th className="text-left py-4 px-6 font-bold">Description</th>
                  <th className="text-center py-4 px-6 font-bold">Qty</th>
                  <th className="text-right py-4 px-6 font-bold">Rate</th>
                  <th className="text-right py-4 px-6 font-bold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">{item.description}</td>
                    <td className="text-center py-4 px-6">{item.quantity}</td>
                    <td className="text-right py-4 px-6">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                    <td className="text-right py-4 px-6 font-semibold">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Startup totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {invoice.taxRates.map((tax, index) => (
                <div key={index} className="flex justify-between">
                  <span>{tax.name}:</span>
                  <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment and Notes */}
        <div className="grid grid-cols-2 gap-8">
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-bold mb-4 text-blue-600">
                  Quick Payment
                </h3>
                <img 
                  src={invoice.paymentInfo.qrCode} 
                  alt="Payment QR Code" 
                  className="mx-auto w-32 h-32 rounded-lg border border-gray-300"
                />
                <p className="text-sm font-semibold mt-2 text-purple-600">
                  {invoice.paymentInfo.method}
                </p>
              </div>
            </div>
          )}
          {invoice.notes && (
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-bold mb-3 text-purple-600">
                Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div data-invoice-preview="true">
      {renderTemplate()}
    </div>
  );
};

export default InvoicePreview;