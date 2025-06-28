import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

// Font family mapping for proper CSS application
const fontFamilyMap: { [key: string]: string } = {
  inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  roboto: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  montserrat: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  playfair: '"Playfair Display", Georgia, "Times New Roman", serif',
  opensans: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  lato: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  poppins: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  sourcesans: '"Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  nunito: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  merriweather: '"Merriweather", Georgia, "Times New Roman", serif',
  raleway: '"Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  crimson: '"Crimson Text", Georgia, "Times New Roman", serif',
  georgia: 'Georgia, "Times New Roman", serif',
  times: '"Times New Roman", Georgia, serif',
  arial: 'Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  verdana: 'Verdana, Geneva, sans-serif',
  trebuchet: '"Trebuchet MS", Arial, sans-serif',
  tahoma: 'Tahoma, Geneva, sans-serif',
  palatino: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
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

  // Get the selected font family
  const selectedFontFamily = fontFamilyMap[invoice.font] || fontFamilyMap.inter;

  // Base styles that apply to the entire invoice
  const invoiceStyles = {
    fontFamily: selectedFontFamily,
    color: '#374151', // Default text color
  };

  // Accent color styles for headings and highlights
  const accentStyles = {
    color: invoice.accentColor,
  };

  const accentBorderStyles = {
    borderColor: invoice.accentColor,
  };

  const accentBackgroundStyles = {
    backgroundColor: invoice.accentColor,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white" style={invoiceStyles}>
      {/* Header */}
      <div className="border-b-2 pb-8 mb-8" style={accentBorderStyles}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            {invoice.company.logo && (
              <img
                src={invoice.company.logo}
                alt="Company Logo"
                className="h-16 w-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2" style={accentStyles}>
                {invoice.company.name}
              </h1>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-bold mb-2" style={accentStyles}>
              INVOICE
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              #{invoice.number}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3" style={accentStyles}>
            Bill To:
          </h3>
          <div className="text-gray-700">
            <p className="font-semibold text-lg">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">Issue Date: </span>
              <span className="font-semibold">{formatDate(invoice.issueDate)}</span>
            </div>
            <div>
              <span className="text-gray-600">Due Date: </span>
              <span className="font-semibold">{formatDate(invoice.dueDate)}</span>
            </div>
            <div>
              <span className="text-gray-600">Status: </span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                style={accentBackgroundStyles}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="text-white" style={accentBackgroundStyles}>
              <th className="text-left py-3 px-4 font-semibold">Description</th>
              <th className="text-center py-3 px-4 font-semibold">Qty</th>
              <th className="text-right py-3 px-4 font-semibold">Rate</th>
              <th className="text-right py-3 px-4 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-4 border-b border-gray-200">
                  {item.description}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-center">
                  {item.quantity}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-right">
                  {getCurrencySymbol()}{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-right font-semibold">
                  {getCurrencySymbol()}{(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">
                {getCurrencySymbol()}{subtotal.toFixed(2)}
              </span>
            </div>
            
            {discountAmount > 0 && (
              <div className="flex justify-between py-2 text-red-600">
                <span>
                  Discount ({invoice.discountType === 'percentage' ? `${invoice.discountValue}%` : 'Fixed'}):
                </span>
                <span className="font-semibold">
                  -{getCurrencySymbol()}{discountAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            {invoice.taxRates.map((tax) => (
              <div key={tax.id} className="flex justify-between py-2">
                <span className="text-gray-600">{tax.name} ({tax.rate}%):</span>
                <span className="font-semibold">
                  {getCurrencySymbol()}{((afterDiscount * tax.rate) / 100).toFixed(2)}
                </span>
              </div>
            ))}
            
            <div 
              className="flex justify-between py-3 border-t-2 text-lg font-bold text-white px-4"
              style={accentBackgroundStyles}
            >
              <span>Total:</span>
              <span>{getCurrencySymbol()}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={accentStyles}>
            Notes:
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="mb-8 text-center">
          <h3 className="text-lg font-semibold mb-3" style={accentStyles}>
            Payment QR Code:
          </h3>
          <div className="inline-block p-4 border-2 rounded-lg" style={accentBorderStyles}>
            <img
              src={invoice.paymentInfo.qrCode}
              alt="Payment QR Code"
              className="w-32 h-32 mx-auto"
            />
            <p className="text-sm text-gray-600 mt-2">
              Scan to pay via {invoice.paymentInfo.method}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {invoice.tags && invoice.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={accentStyles}>
            Tags:
          </h3>
          <div className="flex flex-wrap gap-2">
            {invoice.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={accentBackgroundStyles}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {invoice.showFooter && (
        <div className="text-center text-sm text-gray-500 border-t pt-4">
          <p>Generated by Invoice Beautifier</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;