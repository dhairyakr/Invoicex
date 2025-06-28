import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';
import DOMPurify from 'dompurify';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const getFontFamily = (fontId: string) => {
    const fontMap: { [key: string]: string } = {
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
    return fontMap[fontId] || 'Inter, sans-serif';
  };

  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

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

  // Sanitize HTML content for notes
  const sanitizedNotes = DOMPurify.sanitize(invoice.notes || '');

  const baseStyle = {
    fontFamily: getFontFamily(invoice.font),
    color: '#1f2937',
  };

  const renderElegantTemplate = () => {
    return (
      <div style={baseStyle} className="p-8 bg-white min-h-[297mm] w-[210mm] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center">
            {invoice.company.logo && (
              <img
                src={invoice.company.logo}
                alt="Company Logo"
                className="h-16 w-16 object-contain mr-6"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold" style={{ color: invoice.accentColor }}>
                {invoice.company.name}
              </h1>
              <div className="text-sm text-gray-600 mt-2">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
              INVOICE
            </h2>
            <p className="text-lg font-semibold">{invoice.number}</p>
          </div>
        </div>

        {/* Company and Client Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
              From:
            </h3>
            <div className="text-sm">
              <p className="font-semibold">{invoice.company.name}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
              To:
            </h3>
            <div className="text-sm">
              <p className="font-semibold">{invoice.client.name}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
              <p>{invoice.client.email}</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-sm">
              <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
              <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: invoice.accentColor + '20' }}>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-center py-3 px-4 font-semibold">Qty</th>
                <th className="text-right py-3 px-4 font-semibold">Rate</th>
                <th className="text-right py-3 px-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
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
                <span>Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):</span>
                <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
              </div>
            )}
            {invoice.taxRates.map((tax) => (
              <div key={tax.id} className="flex justify-between py-2">
                <span>{tax.name} ({tax.rate}%):</span>
                <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {sanitizedNotes && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
              Notes:
            </h3>
            <div 
              className="text-sm prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedNotes }}
            />
          </div>
        )}

        {/* Payment QR Code */}
        {invoice.paymentInfo?.qrCode && (
          <div className="mb-8 text-center">
            <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
              Payment QR Code:
            </h3>
            <img
              src={invoice.paymentInfo.qrCode}
              alt="Payment QR Code"
              className="w-32 h-32 mx-auto"
            />
            <p className="text-sm text-gray-600 mt-2">
              Scan to pay via {invoice.paymentInfo.method}
            </p>
          </div>
        )}

        {/* Footer */}
        {invoice.showFooter && (
          <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t">
            Generated by Invoice Beautifier
          </div>
        )}
      </div>
    );
  };

  const renderTemplate = () => {
    switch (invoice.template) {
      case 'elegant':
        return renderElegantTemplate();

      case 'modern':
        return (
          <div style={baseStyle} className="p-8 bg-white min-h-[297mm] w-[210mm] mx-auto">
            {/* Header */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  {invoice.company.logo && (
                    <img
                      src={invoice.company.logo}
                      alt="Company Logo"
                      className="h-12 w-12 object-contain mr-4"
                    />
                  )}
                  <h1 className="text-2xl font-bold" style={{ color: invoice.accentColor }}>
                    {invoice.company.name}
                  </h1>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="whitespace-pre-line">{invoice.company.address}</p>
                  <p>{invoice.company.email}</p>
                  <p>{invoice.company.phone}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  INVOICE
                </h2>
                <div className="text-sm">
                  <p><span className="font-semibold">Number:</span> {invoice.number}</p>
                  <p><span className="font-semibold">Date:</span> {formatDate(invoice.issueDate)}</p>
                  <p><span className="font-semibold">Due:</span> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2" style={{ color: invoice.accentColor }}>
                Bill To:
              </h3>
              <div className="text-sm">
                <p className="font-semibold">{invoice.client.name}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
                <p>{invoice.client.email}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ backgroundColor: invoice.accentColor, color: 'white' }}>
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-center py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4">{item.description}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-1">
                  <span>Subtotal:</span>
                  <span>{getCurrencySymbol()}{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-red-600">
                    <span>Discount:</span>
                    <span>-{getCurrencySymbol()}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.taxRates.map((tax) => (
                  <div key={tax.id} className="flex justify-between py-1">
                    <span>{tax.name}:</span>
                    <span>{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span style={{ color: invoice.accentColor }}>{getCurrencySymbol()}{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {sanitizedNotes && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
                  Notes:
                </h3>
                <div 
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedNotes }}
                />
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="font-semibold text-lg mb-3" style={{ color: invoice.accentColor }}>
                  Payment QR Code:
                </h3>
                <img
                  src={invoice.paymentInfo.qrCode}
                  alt="Payment QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Scan to pay via {invoice.paymentInfo.method}
                </p>
              </div>
            )}

            {/* Footer */}
            {invoice.showFooter && (
              <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'corporate':
        return (
          <div style={baseStyle} className="p-8 bg-white min-h-[297mm] w-[210mm] mx-auto">
            {/* Header with accent bar */}
            <div className="mb-8">
              <div className="h-2 w-full mb-6" style={{ backgroundColor: invoice.accentColor }}></div>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {invoice.company.logo && (
                    <img
                      src={invoice.company.logo}
                      alt="Company Logo"
                      className="h-16 w-16 object-contain mr-6"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {invoice.company.name}
                    </h1>
                    <div className="text-sm text-gray-600 mt-2">
                      <p>{invoice.company.email} | {invoice.company.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold" style={{ color: invoice.accentColor }}>
                    INVOICE
                  </h2>
                  <p className="text-lg font-semibold mt-2">{invoice.number}</p>
                </div>
              </div>
            </div>

            {/* Invoice and Client Info */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
                  Company Address
                </h3>
                <div className="text-sm">
                  <p className="whitespace-pre-line">{invoice.company.address}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
                  Bill To
                </h3>
                <div className="text-sm">
                  <p className="font-semibold">{invoice.client.name}</p>
                  <p className="whitespace-pre-line">{invoice.client.address}</p>
                  <p>{invoice.client.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
                  Invoice Details
                </h3>
                <div className="text-sm">
                  <p><span className="font-semibold">Issue Date:</span> {formatDate(invoice.issueDate)}</p>
                  <p><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr style={{ backgroundColor: invoice.accentColor, color: 'white' }}>
                    <th className="text-left py-4 px-4 font-semibold border border-gray-300">Description</th>
                    <th className="text-center py-4 px-4 font-semibold border border-gray-300">Quantity</th>
                    <th className="text-right py-4 px-4 font-semibold border border-gray-300">Rate</th>
                    <th className="text-right py-4 px-4 font-semibold border border-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border border-gray-300">{item.description}</td>
                      <td className="py-3 px-4 text-center border border-gray-300">{item.quantity}</td>
                      <td className="py-3 px-4 text-right border border-gray-300">{getCurrencySymbol()}{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right border border-gray-300">{getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 font-semibold border border-gray-300 bg-gray-50">Subtotal:</td>
                      <td className="py-2 px-4 text-right border border-gray-300">{getCurrencySymbol()}{subtotal.toFixed(2)}</td>
                    </tr>
                    {discountAmount > 0 && (
                      <tr>
                        <td className="py-2 px-4 font-semibold border border-gray-300 bg-gray-50">Discount:</td>
                        <td className="py-2 px-4 text-right border border-gray-300 text-red-600">-{getCurrencySymbol()}{discountAmount.toFixed(2)}</td>
                      </tr>
                    )}
                    {invoice.taxRates.map((tax) => (
                      <tr key={tax.id}>
                        <td className="py-2 px-4 font-semibold border border-gray-300 bg-gray-50">{tax.name}:</td>
                        <td className="py-2 px-4 text-right border border-gray-300">{getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: invoice.accentColor, color: 'white' }}>
                      <td className="py-3 px-4 font-bold border border-gray-300">TOTAL:</td>
                      <td className="py-3 px-4 text-right font-bold border border-gray-300">{getCurrencySymbol()}{total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {sanitizedNotes && (
              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
                  Notes
                </h3>
                <div 
                  className="text-sm prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizedNotes }}
                />
              </div>
            )}

            {/* Payment QR Code */}
            {invoice.paymentInfo?.qrCode && (
              <div className="mb-8 text-center">
                <h3 className="font-semibold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
                  Payment QR Code
                </h3>
                <img
                  src={invoice.paymentInfo.qrCode}
                  alt="Payment QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Scan to pay via {invoice.paymentInfo.method}
                </p>
              </div>
            )}

            {/* Footer */}
            {invoice.showFooter && (
              <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      // Add more template cases here for creative, boutique, minimal, etc.
      default:
        return renderElegantTemplate(); // Use the extracted function instead of recursive call
    }
  };

  return renderTemplate();
};

export default InvoicePreview;