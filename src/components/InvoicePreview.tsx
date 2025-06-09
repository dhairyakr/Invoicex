import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';
import { useInvoice } from '../context/InvoiceContext';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const { calculateTotals } = useInvoice();
  
  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  const getFont = () => {
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

  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol();

  const renderTemplate = () => {
    const baseClasses = "p-12 bg-white min-h-[297mm] w-[210mm] mx-auto";
    const fontFamily = getFont();
    
    switch (invoice.template) {
      case 'elegant':
        return (
          <div className={baseClasses} style={{ fontFamily }}>
            <div className="text-center pb-8 mb-8 border-b-2" style={{ borderColor: invoice.accentColor }}>
              {invoice.company.logo && (
                <img src={invoice.company.logo} alt="Logo" className="h-16 mx-auto mb-6 object-contain" />
              )}
              <h1 className="text-4xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                {invoice.company.name || 'Your Company'}
              </h1>
              <h2 className="text-3xl italic mb-4" style={{ color: invoice.accentColor }}>Invoice</h2>
              <div className="inline-block px-6 py-2 border-2 rounded-full" style={{ borderColor: invoice.accentColor }}>
                #{invoice.number}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: invoice.accentColor }}>Billed To</h3>
                <div className="text-gray-800 space-y-1">
                  {invoice.client.name && <p className="font-medium">{invoice.client.name}</p>}
                  {invoice.client.email && <p>{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: invoice.accentColor }}>Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                    <th className="text-left py-3 font-semibold">Description</th>
                    <th className="text-center py-3 font-semibold">Qty</th>
                    <th className="text-right py-3 font-semibold">Rate</th>
                    <th className="text-right py-3 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4">{item.description || 'Item description'}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-4 text-right">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-end">
                <div className="w-1/2 space-y-2">
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between py-2">
                      <span>Tax</span>
                      <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 font-bold text-lg border-t-2" style={{ borderColor: invoice.accentColor }}>
                    <span>Total</span>
                    <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: invoice.accentColor }}>Notes</h3>
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

      case 'modern':
        return (
          <div className={baseClasses} style={{ fontFamily }}>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                {invoice.company.logo && (
                  <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain" />
                )}
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{invoice.company.name || 'Your Company'}</h1>
                <div className="text-gray-600 space-y-1">
                  {invoice.company.email && <p>{invoice.company.email}</p>}
                  {invoice.company.phone && <p>{invoice.company.phone}</p>}
                  {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block px-4 py-2 rounded-lg mb-4" style={{ backgroundColor: invoice.accentColor }}>
                  <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                </div>
                <div className="text-gray-800">
                  <p className="text-xl font-bold mb-2">#{invoice.number}</p>
                  <p>Issue: {formatDate(invoice.issueDate)}</p>
                  <p>Due: {formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2" style={{ color: invoice.accentColor }}>Bill To:</h3>
              <div className="text-gray-800">
                {invoice.client.name && <p className="font-medium">{invoice.client.name}</p>}
                {invoice.client.email && <p>{invoice.client.email}</p>}
                {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                    <th className="text-center py-3 px-4 font-semibold">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold">Rate</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4">{item.description || 'Item description'}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3 space-y-2">
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between py-2 text-red-600">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between py-2">
                      <span>Tax</span>
                      <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-300">
                    <span>Total</span>
                    <span style={{ color: invoice.accentColor }}>{currencySymbol}{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2" style={{ color: invoice.accentColor }}>Notes</h3>
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

      case 'corporate':
        return (
          <div className={baseClasses} style={{ fontFamily }}>
            <div className="border-b-4 pb-6 mb-8" style={{ borderColor: invoice.accentColor }}>
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                  )}
                  <h1 className="text-2xl font-bold text-gray-800 mb-1">{invoice.company.name || 'Your Company'}</h1>
                  <div className="text-sm text-gray-600 space-y-1">
                    {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                    <div className="flex space-x-4">
                      {invoice.company.email && <span>{invoice.company.email}</span>}
                      {invoice.company.phone && <span>{invoice.company.phone}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold mb-2" style={{ color: invoice.accentColor }}>INVOICE</h2>
                  <div className="text-sm text-gray-600">
                    <p><strong>Invoice #:</strong> {invoice.number}</p>
                    <p><strong>Date:</strong> {formatDate(invoice.issueDate)}</p>
                    <p><strong>Due Date:</strong> {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2 text-gray-800">BILL TO:</h3>
                  <div className="text-gray-700">
                    {invoice.client.name && <p className="font-medium">{invoice.client.name}</p>}
                    {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                    {invoice.client.email && <p>{invoice.client.email}</p>}
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2 text-gray-800">PAYMENT TERMS:</h3>
                  <div className="text-gray-700 text-sm">
                    <p>Payment is due within 30 days</p>
                    <p>Late payments may incur fees</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr style={{ backgroundColor: invoice.accentColor }}>
                    <th className="text-left py-3 px-4 text-white font-semibold">DESCRIPTION</th>
                    <th className="text-center py-3 px-4 text-white font-semibold">QTY</th>
                    <th className="text-right py-3 px-4 text-white font-semibold">RATE</th>
                    <th className="text-right py-3 px-4 text-white font-semibold">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="py-3 px-4">{item.description || 'Item description'}</td>
                      <td className="py-3 px-4 text-center">{item.quantity}</td>
                      <td className="py-3 px-4 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3">
                  <div className="border border-gray-300">
                    <div className="flex justify-between py-2 px-4 border-b border-gray-300">
                      <span>Subtotal</span>
                      <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between py-2 px-4 border-b border-gray-300 text-red-600">
                        <span>Discount</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between py-2 px-4 border-b border-gray-300">
                        <span>Tax</span>
                        <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 px-4 font-bold text-lg text-white" style={{ backgroundColor: invoice.accentColor }}>
                      <span>TOTAL</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-bold mb-2 text-gray-800">NOTES:</h3>
                <div className="bg-gray-100 p-4 rounded">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'creative':
        return (
          <div className={baseClasses} style={{ fontFamily }}>
            <div className="relative mb-12">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: invoice.accentColor }}></div>
              <div className="relative z-10 pt-8">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                    )}
                    <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                      {invoice.company.name || 'Your Company'}
                    </h1>
                    <div className="text-gray-600">
                      {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                      <p>{invoice.company.email} • {invoice.company.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="transform rotate-3 inline-block px-6 py-3 rounded-lg shadow-lg" style={{ backgroundColor: invoice.accentColor }}>
                      <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                    </div>
                    <div className="mt-4 text-gray-800">
                      <p className="text-xl font-bold">#{invoice.number}</p>
                      <p>{formatDate(invoice.issueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: invoice.accentColor + '20', color: invoice.accentColor }}>
                <h3 className="font-bold">Billed To</h3>
              </div>
              <div className="ml-4 text-gray-800">
                {invoice.client.name && <p className="font-bold text-lg">{invoice.client.name}</p>}
                {invoice.client.email && <p>{invoice.client.email}</p>}
                {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
              </div>
            </div>

            <div className="mb-8">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: invoice.accentColor }}>
                      <th className="text-left py-4 px-6 text-white font-bold">Description</th>
                      <th className="text-center py-4 px-6 text-white font-bold">Qty</th>
                      <th className="text-right py-4 px-6 text-white font-bold">Rate</th>
                      <th className="text-right py-4 px-6 text-white font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-4 px-6">{item.description || 'Item description'}</td>
                        <td className="py-4 px-6 text-center">{item.quantity}</td>
                        <td className="py-4 px-6 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3">
                  <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount</span>
                          <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t-2 pt-2">
                        <div className="flex justify-between font-bold text-xl" style={{ color: invoice.accentColor }}>
                          <span>Total</span>
                          <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <div className="inline-block px-4 py-2 rounded-full mb-4" style={{ backgroundColor: invoice.accentColor + '20', color: invoice.accentColor }}>
                  <h3 className="font-bold">Notes</h3>
                </div>
                <div className="ml-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'boutique':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Playfair Display, serif' }}>
            <div className="text-center mb-12">
              <div className="border-4 border-double p-8 mb-8" style={{ borderColor: invoice.accentColor }}>
                {invoice.company.logo && (
                  <img src={invoice.company.logo} alt="Logo" className="h-20 mx-auto mb-6 object-contain" />
                )}
                <h1 className="text-5xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                  {invoice.company.name || 'Your Company'}
                </h1>
                <div className="text-gray-600 italic">
                  {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                  <p>{invoice.company.email} • {invoice.company.phone}</p>
                </div>
              </div>
              
              <div className="inline-block">
                <h2 className="text-4xl font-bold italic mb-2" style={{ color: invoice.accentColor }}>Invoice</h2>
                <div className="w-24 h-1 mx-auto mb-4" style={{ backgroundColor: invoice.accentColor }}></div>
                <p className="text-xl">#{invoice.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4 italic" style={{ color: invoice.accentColor }}>Billed To</h3>
                <div className="text-gray-800 leading-relaxed">
                  {invoice.client.name && <p className="font-semibold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="italic">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 italic" style={{ color: invoice.accentColor }}>Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="italic">Issue Date:</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="italic">Due Date:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 border-b-2 font-bold italic" style={{ borderColor: invoice.accentColor }}>Description</th>
                    <th className="text-center py-4 border-b-2 font-bold italic" style={{ borderColor: invoice.accentColor }}>Quantity</th>
                    <th className="text-right py-4 border-b-2 font-bold italic" style={{ borderColor: invoice.accentColor }}>Rate</th>
                    <th className="text-right py-4 border-b-2 font-bold italic" style={{ borderColor: invoice.accentColor }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 border-b border-gray-200">{item.description || 'Item description'}</td>
                      <td className="py-4 border-b border-gray-200 text-center">{item.quantity}</td>
                      <td className="py-4 border-b border-gray-200 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-4 border-b border-gray-200 text-right">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-end">
                <div className="w-1/2">
                  <div className="border-2 border-double p-6" style={{ borderColor: invoice.accentColor }}>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="italic">Subtotal</span>
                        <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span className="italic">Discount</span>
                          <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="italic">Tax</span>
                          <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t-2 pt-3" style={{ borderColor: invoice.accentColor }}>
                        <div className="flex justify-between font-bold text-xl">
                          <span className="italic">Total</span>
                          <span style={{ color: invoice.accentColor }}>{currencySymbol}{totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 italic" style={{ color: invoice.accentColor }}>Notes</h3>
                <div className="border-l-4 pl-6" style={{ borderColor: invoice.accentColor }}>
                  <p className="text-gray-700 whitespace-pre-line italic">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm italic">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'minimal':
        return (
          <div className={baseClasses} style={{ fontFamily }}>
            <div className="mb-16">
              <div className="flex justify-between items-start mb-8">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain" />
                  )}
                  <h1 className="text-2xl font-light text-gray-800 mb-2">{invoice.company.name || 'Your Company'}</h1>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-light mb-2" style={{ color: invoice.accentColor }}>Invoice</h2>
                  <p className="text-gray-600">#{invoice.number}</p>
                </div>
              </div>
              
              <div className="w-full h-px bg-gray-200 mb-8"></div>
              
              <div className="grid grid-cols-3 gap-8 text-sm">
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">From</h3>
                  <div className="text-gray-600 space-y-1">
                    {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                    {invoice.company.email && <p>{invoice.company.email}</p>}
                    {invoice.company.phone && <p>{invoice.company.phone}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">To</h3>
                  <div className="text-gray-600 space-y-1">
                    {invoice.client.name && <p className="font-medium">{invoice.client.name}</p>}
                    {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                    {invoice.client.email && <p>{invoice.client.email}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 text-gray-800">Details</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Issue: {formatDate(invoice.issueDate)}</p>
                    <p>Due: {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-800">Description</th>
                    <th className="text-center py-3 font-medium text-gray-800">Qty</th>
                    <th className="text-right py-3 font-medium text-gray-800">Rate</th>
                    <th className="text-right py-3 font-medium text-gray-800">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 text-gray-700">{item.description || 'Item description'}</td>
                      <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                      <td className="py-4 text-right text-gray-700">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-4 text-right text-gray-700">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 flex justify-end">
                <div className="w-1/3 space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between py-1 text-red-600">
                      <span>Discount</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-800">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span className="text-gray-800">Total</span>
                      <span style={{ color: invoice.accentColor }}>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-medium mb-3 text-gray-800">Notes</h3>
                <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.notes}</p>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-16 pt-4 border-t border-gray-200 text-center text-gray-400 text-xs">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'dynamic':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <div className="relative mb-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: invoice.accentColor, transform: 'translate(25%, -25%)' }}></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                    )}
                    <h1 className="text-4xl font-bold mb-2 tracking-tight" style={{ color: invoice.accentColor }}>
                      {invoice.company.name || 'YOUR COMPANY'}
                    </h1>
                    <div className="text-gray-600 font-medium">
                      {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                      <p className="uppercase tracking-wide">{invoice.company.email} • {invoice.company.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-8 py-4 transform -rotate-2" style={{ backgroundColor: invoice.accentColor }}>
                      <h2 className="text-3xl font-black text-white tracking-wider">INVOICE</h2>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-gray-800">#{invoice.number}</p>
                      <p className="text-gray-600 font-medium">{formatDate(invoice.issueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: invoice.accentColor }}>Bill To</h3>
                <div className="text-gray-800">
                  {invoice.client.name && <p className="font-bold text-xl">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="font-medium">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}dd)` }}>
                      <th className="text-left py-4 px-6 text-white font-bold uppercase tracking-wide">Description</th>
                      <th className="text-center py-4 px-6 text-white font-bold uppercase tracking-wide">Qty</th>
                      <th className="text-right py-4 px-6 text-white font-bold uppercase tracking-wide">Rate</th>
                      <th className="text-right py-4 px-6 text-white font-bold uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-4 px-6 font-medium">{item.description || 'Item description'}</td>
                        <td className="py-4 px-6 text-center font-bold">{item.quantity}</td>
                        <td className="py-4 px-6 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-bold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3">
                  <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderColor: invoice.accentColor }}>
                    <div className="space-y-3">
                      <div className="flex justify-between font-medium">
                        <span>SUBTOTAL</span>
                        <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between font-medium text-red-600">
                          <span>DISCOUNT</span>
                          <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.taxAmount > 0 && (
                        <div className="flex justify-between font-medium">
                          <span>TAX</span>
                          <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t-2 pt-3" style={{ borderColor: invoice.accentColor }}>
                        <div className="flex justify-between font-black text-2xl" style={{ color: invoice.accentColor }}>
                          <span>TOTAL</span>
                          <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3 uppercase tracking-wide" style={{ color: invoice.accentColor }}>Notes</h3>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4" style={{ borderColor: invoice.accentColor }}>
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm font-medium">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'tech':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Source Sans Pro, sans-serif', backgroundColor: '#0a0a0a', color: '#ffffff' }}>
            <div className="mb-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain filter brightness-0 invert" />
                  )}
                  <h1 className="text-3xl font-bold mb-2 text-green-400 font-mono">
                    {invoice.company.name || 'YOUR_COMPANY'}
                  </h1>
                  <div className="text-gray-400 font-mono text-sm">
                    {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                    <p>{invoice.company.email} | {invoice.company.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-4 py-2 bg-green-400 text-black font-mono font-bold">
                    &gt; INVOICE_
                  </div>
                  <div className="mt-4 font-mono">
                    <p className="text-green-400">#{invoice.number}</p>
                    <p className="text-gray-400">{formatDate(invoice.issueDate)}</p>
                  </div>
                </div>
              </div>
              
              <div className="border border-green-400 p-4 mb-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-green-400 font-mono mb-2">[CLIENT_INFO]</h3>
                    <div className="text-gray-300 font-mono text-sm">
                      {invoice.client.name && <p>&gt; {invoice.client.name}</p>}
                      {invoice.client.email && <p>&gt; {invoice.client.email}</p>}
                      {invoice.client.address && <p className="whitespace-pre-line">&gt; {invoice.client.address}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-green-400 font-mono mb-2">[PAYMENT_DUE]</h3>
                    <div className="text-gray-300 font-mono text-sm">
                      <p>&gt; {formatDate(invoice.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="border border-green-400">
                <table className="w-full font-mono">
                  <thead>
                    <tr className="bg-green-400 text-black">
                      <th className="text-left py-3 px-4 font-bold">DESCRIPTION</th>
                      <th className="text-center py-3 px-4 font-bold">QTY</th>
                      <th className="text-right py-3 px-4 font-bold">RATE</th>
                      <th className="text-right py-3 px-4 font-bold">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-900' : 'bg-black'}>
                        <td className="py-3 px-4 text-gray-300">{item.description || 'Item description'}</td>
                        <td className="py-3 px-4 text-center text-green-400">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-gray-300">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-green-400">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3 border border-green-400 p-4 bg-gray-900">
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>SUBTOTAL:</span>
                      <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-400">
                        <span>DISCOUNT:</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-gray-300">
                        <span>TAX:</span>
                        <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-green-400 pt-2">
                      <div className="flex justify-between font-bold text-lg text-green-400">
                        <span>TOTAL:</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-green-400 font-mono mb-2">[NOTES]</h3>
                <div className="border border-green-400 p-4 bg-gray-900">
                  <p className="text-gray-300 font-mono text-sm whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-green-400 text-center text-gray-500 text-sm font-mono">
                // Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'vintage':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Crimson Text, serif', backgroundColor: '#faf7f2' }}>
            <div className="text-center mb-12">
              <div className="border-8 border-double border-amber-800 p-8 mb-8 bg-white">
                {invoice.company.logo && (
                  <img src={invoice.company.logo} alt="Logo" className="h-20 mx-auto mb-6 object-contain sepia" />
                )}
                <div className="mb-4">
                  <div className="w-32 h-1 bg-amber-800 mx-auto mb-2"></div>
                  <div className="w-16 h-1 bg-amber-800 mx-auto"></div>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-amber-900">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <div className="text-amber-700 italic">
                  {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                  <p>{invoice.company.email} • {invoice.company.phone}</p>
                </div>
                <div className="mt-4 mb-4">
                  <div className="w-16 h-1 bg-amber-800 mx-auto mb-2"></div>
                  <div className="w-32 h-1 bg-amber-800 mx-auto"></div>
                </div>
              </div>
              
              <h2 className="text-5xl font-bold text-amber-900 mb-4">Invoice</h2>
              <div className="inline-block border-4 border-amber-800 px-6 py-2 bg-white">
                <p className="text-2xl font-bold text-amber-900">No. {invoice.number}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div className="bg-white p-6 border-4 border-amber-800">
                <h3 className="text-xl font-bold mb-4 text-amber-900 text-center">~ Billed To ~</h3>
                <div className="text-amber-800 text-center">
                  {invoice.client.name && <p className="font-bold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p className="italic">{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
              <div className="bg-white p-6 border-4 border-amber-800">
                <h3 className="text-xl font-bold mb-4 text-amber-900 text-center">~ Details ~</h3>
                <div className="space-y-2 text-amber-800">
                  <div className="flex justify-between">
                    <span className="italic">Issued:</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="italic">Due:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 bg-white border-4 border-amber-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="text-left py-4 px-6 font-bold text-amber-900">Description</th>
                    <th className="text-center py-4 px-6 font-bold text-amber-900">Quantity</th>
                    <th className="text-right py-4 px-6 font-bold text-amber-900">Rate</th>
                    <th className="text-right py-4 px-6 font-bold text-amber-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                      <td className="py-4 px-6 text-amber-800">{item.description || 'Item description'}</td>
                      <td className="py-4 px-6 text-center text-amber-800">{item.quantity}</td>
                      <td className="py-4 px-6 text-right text-amber-800">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-bold text-amber-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-6 bg-amber-100">
                <div className="flex justify-end">
                  <div className="w-1/2 space-y-3">
                    <div className="flex justify-between text-amber-800">
                      <span className="italic">Subtotal</span>
                      <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                    </div>
                    {totals.discountAmount > 0 && (
                      <div className="flex justify-between text-red-700">
                        <span className="italic">Discount</span>
                        <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between text-amber-800">
                        <span className="italic">Tax</span>
                        <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-amber-800 pt-3">
                      <div className="flex justify-between font-bold text-xl text-amber-900">
                        <span>~ Total ~</span>
                        <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8 bg-white p-6 border-4 border-amber-800">
                <h3 className="text-xl font-bold mb-4 text-amber-900 text-center">~ Notes ~</h3>
                <p className="text-amber-800 whitespace-pre-line italic text-center">{invoice.notes}</p>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t-2 border-amber-800 text-center text-amber-700 text-sm italic">
                ~ Generated by Invoice Beautifier ~
              </div>
            )}
          </div>
        );

      case 'artistic':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Nunito, sans-serif' }}>
            <div className="relative mb-12">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r opacity-10" style={{ background: `linear-gradient(45deg, ${invoice.accentColor}, transparent)` }}></div>
              <div className="relative z-10 pt-8">
                <div className="flex justify-between items-start">
                  <div>
                    {invoice.company.logo && (
                      <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                    )}
                    <h1 className="text-4xl font-bold mb-2" style={{ color: invoice.accentColor, textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>
                      {invoice.company.name || 'Your Company'}
                    </h1>
                    <div className="text-gray-600">
                      {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                      <p>{invoice.company.email} • {invoice.company.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-lg transform rotate-3" style={{ backgroundColor: invoice.accentColor }}></div>
                      <div className="relative px-6 py-4 bg-white rounded-lg shadow-lg border-2" style={{ borderColor: invoice.accentColor }}>
                        <h2 className="text-2xl font-bold" style={{ color: invoice.accentColor }}>INVOICE</h2>
                        <p className="text-gray-600">#{invoice.number}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-gray-600">
                      <p>{formatDate(invoice.issueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="relative p-6 rounded-lg shadow-lg bg-white border-l-8" style={{ borderColor: invoice.accentColor }}>
                <div className="absolute top-0 right-0 w-24 h-24 opacity-5 rounded-full" style={{ backgroundColor: invoice.accentColor, transform: 'translate(50%, -50%)' }}></div>
                <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>Billed To</h3>
                <div className="text-gray-800">
                  {invoice.client.name && <p className="font-bold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p>{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="overflow-hidden rounded-lg shadow-lg bg-white">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}cc)` }}>
                      <th className="text-left py-4 px-6 text-white font-bold">Description</th>
                      <th className="text-center py-4 px-6 text-white font-bold">Qty</th>
                      <th className="text-right py-4 px-6 text-white font-bold">Rate</th>
                      <th className="text-right py-4 px-6 text-white font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-4 px-6">{item.description || 'Item description'}</td>
                        <td className="py-4 px-6 text-center font-semibold">{item.quantity}</td>
                        <td className="py-4 px-6 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="p-6 bg-gray-50">
                  <div className="flex justify-end">
                    <div className="w-1/3">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                        </div>
                        {totals.discountAmount > 0 && (
                          <div className="flex justify-between text-red-600">
                            <span>Discount</span>
                            <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {totals.taxAmount > 0 && (
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="border-t-2 pt-3" style={{ borderColor: invoice.accentColor }}>
                          <div className="flex justify-between font-bold text-xl" style={{ color: invoice.accentColor }}>
                            <span>Total</span>
                            <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <div className="relative p-6 rounded-lg shadow-lg bg-white border-l-8" style={{ borderColor: invoice.accentColor }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: invoice.accentColor }}>Notes</h3>
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'professional':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Raleway, sans-serif' }}>
            <div className="bg-gray-900 text-white p-8 mb-8 -mx-12 -mt-12">
              <div className="flex justify-between items-center">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain filter brightness-0 invert" />
                  )}
                  <h1 className="text-3xl font-bold">{invoice.company.name || 'Your Company'}</h1>
                  <div className="text-gray-300 mt-2">
                    {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                    <p>{invoice.company.email} • {invoice.company.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl font-bold mb-2">INVOICE</h2>
                  <div className="text-xl">#{invoice.number}</div>
                  <div className="text-gray-300 mt-2">
                    <p>Date: {formatDate(invoice.issueDate)}</p>
                    <p>Due: {formatDate(invoice.dueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 text-gray-800">CLIENT INFORMATION</h3>
                <div className="text-gray-700">
                  {invoice.client.name && <p className="font-semibold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p>{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="text-left py-4 px-6 font-bold">DESCRIPTION</th>
                    <th className="text-center py-4 px-6 font-bold">QTY</th>
                    <th className="text-right py-4 px-6 font-bold">RATE</th>
                    <th className="text-right py-4 px-6 font-bold">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-4 px-6 border-b border-gray-200">{item.description || 'Item description'}</td>
                      <td className="py-4 px-6 text-center border-b border-gray-200">{item.quantity}</td>
                      <td className="py-4 px-6 text-right border-b border-gray-200">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right border-b border-gray-200 font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 flex justify-end">
                <div className="w-1/3">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Subtotal</span>
                        <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span className="font-medium">Discount</span>
                          <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="font-medium">Tax</span>
                          <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-gray-800 pt-2">
                        <div className="flex justify-between font-bold text-xl text-gray-800">
                          <span>TOTAL</span>
                          <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3 text-gray-800">NOTES</h3>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      case 'startup':
        return (
          <div className={baseClasses} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="mb-12">
              <div className="flex justify-between items-start">
                <div>
                  {invoice.company.logo && (
                    <img src={invoice.company.logo} alt="Logo" className="h-14 mb-4 object-contain" />
                  )}
                  <h1 className="text-3xl font-bold mb-2 text-gray-800">{invoice.company.name || 'Your Company'}</h1>
                  <div className="text-gray-600">
                    {invoice.company.address && <p className="whitespace-pre-line">{invoice.company.address}</p>}
                    <p>{invoice.company.email} • {invoice.company.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block px-6 py-3 rounded-full mb-4" style={{ backgroundColor: invoice.accentColor + '15', border: `2px solid ${invoice.accentColor}` }}>
                    <h2 className="text-2xl font-bold" style={{ color: invoice.accentColor }}>Invoice</h2>
                  </div>
                  <div className="text-gray-800">
                    <p className="text-xl font-bold">#{invoice.number}</p>
                    <p className="text-gray-600">{formatDate(invoice.issueDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="rounded-xl p-6 shadow-sm" style={{ backgroundColor: invoice.accentColor + '08' }}>
                <h3 className="font-bold mb-3" style={{ color: invoice.accentColor }}>Bill To</h3>
                <div className="text-gray-800">
                  {invoice.client.name && <p className="font-semibold text-lg">{invoice.client.name}</p>}
                  {invoice.client.email && <p>{invoice.client.email}</p>}
                  {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-800">Description</th>
                      <th className="text-center py-4 px-6 font-semibold text-gray-800">Qty</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-800">Rate</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-800">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-4 px-6">{item.description || 'Item description'}</td>
                        <td className="py-4 px-6 text-center">{item.quantity}</td>
                        <td className="py-4 px-6 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-gray-50 p-6">
                  <div className="flex justify-end">
                    <div className="w-1/3 space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                      </div>
                      {totals.discountAmount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount</span>
                          <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      {totals.taxAmount > 0 && (
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t-2 pt-3" style={{ borderColor: invoice.accentColor }}>
                        <div className="flex justify-between font-bold text-xl" style={{ color: invoice.accentColor }}>
                          <span>Total</span>
                          <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mb-8">
                <h3 className="font-bold mb-3" style={{ color: invoice.accentColor }}>Notes</h3>
                <div className="rounded-xl p-4 bg-gray-50">
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              </div>
            )}

            {invoice.showFooter && (
              <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
                Generated by Invoice Beautifier
              </div>
            )}
          </div>
        );

      default:
        return renderTemplate(); // Fallback to elegant template
    }
  };

  return renderTemplate();
};

export default InvoicePreview;