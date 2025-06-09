import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  const getFontFamily = () => {
    switch (invoice.font) {
      case 'inter': return 'Inter, sans-serif';
      case 'roboto': return 'Roboto, sans-serif';
      case 'montserrat': return 'Montserrat, sans-serif';
      case 'playfair': return 'Playfair Display, serif';
      case 'opensans': return 'Open Sans, sans-serif';
      case 'lato': return 'Lato, sans-serif';
      case 'poppins': return 'Poppins, sans-serif';
      case 'sourcesans': return 'Source Sans Pro, sans-serif';
      case 'nunito': return 'Nunito, sans-serif';
      case 'merriweather': return 'Merriweather, serif';
      case 'raleway': return 'Raleway, sans-serif';
      case 'crimson': return 'Crimson Text, serif';
      default: return 'Inter, sans-serif';
    }
  };

  const renderElegantTemplate = () => (
    <div className="p-12 bg-white" style={{ fontFamily: 'Playfair Display, serif' }}>
      {/* Decorative header with ornamental lines */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="h-px bg-gray-400 flex-1"></div>
          <div className="mx-4 text-xs tracking-widest text-gray-500">INVOICE</div>
          <div className="h-px bg-gray-400 flex-1"></div>
        </div>
        
        {invoice.company.logo && (
          <img src={invoice.company.logo} alt="Logo" className="h-16 mx-auto mb-6 object-contain" />
        )}
        
        <h1 className="text-4xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          {invoice.company.name || 'Your Company'}
        </h1>
        
        <div className="inline-block border-2 border-gray-300 px-6 py-2 mt-4">
          <span className="text-lg font-medium">#{invoice.number}</span>
        </div>
      </div>

      {/* Client and company info in elegant boxes */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div className="border-l-4 border-gray-300 pl-6">
          <h3 className="text-lg font-bold mb-4 italic" style={{ color: invoice.accentColor }}>
            From
          </h3>
          <div className="space-y-1 text-gray-700">
            <p>{invoice.company.email}</p>
            <p>{invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>
        
        <div className="border-l-4 border-gray-300 pl-6">
          <h3 className="text-lg font-bold mb-4 italic" style={{ color: invoice.accentColor }}>
            To
          </h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-semibold">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
      </div>

      {/* Date information in centered format */}
      <div className="text-center mb-12">
        <div className="inline-block bg-gray-50 px-8 py-4 rounded">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <span className="text-gray-600">Issue Date: </span>
              <span className="font-medium">{formatDate(invoice.issueDate)}</span>
            </div>
            <div>
              <span className="text-gray-600">Due Date: </span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant table with alternating rows */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-4 font-bold">Description</th>
            <th className="text-center py-4 font-bold w-20">Qty</th>
            <th className="text-right py-4 font-bold w-24">Rate</th>
            <th className="text-right py-4 font-bold w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-4 text-gray-800">{item.description}</td>
              <td className="py-4 text-center">{item.quantity}</td>
              <td className="py-4 text-right">${item.rate.toFixed(2)}</td>
              <td className="py-4 text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total in elegant box */}
      <div className="flex justify-end mb-8">
        <div className="border-2 border-gray-300 p-6 bg-gray-50">
          <div className="text-right">
            <div className="text-2xl font-bold">Total: ${subtotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t-2 border-gray-300 pt-6">
          <h3 className="text-lg font-bold mb-3 italic">Notes</h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderModernTemplate = () => (
    <div className="flex h-full bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Left sidebar with accent color */}
      <div className="w-1/3 p-8" style={{ backgroundColor: invoice.accentColor }}>
        <div className="text-white">
          {invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-12 mb-6 object-contain brightness-0 invert" />
          )}
          
          <h1 className="text-2xl font-bold mb-2">{invoice.company.name || 'Your Company'}</h1>
          <p className="text-lg opacity-90 mb-8">INVOICE</p>
          
          <div className="space-y-4 mb-8">
            <div>
              <h3 className="font-semibold mb-2 opacity-90">Contact</h3>
              <div className="space-y-1 text-sm opacity-80">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-20 p-4 rounded">
            <h3 className="font-semibold mb-2">Invoice Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Number:</span>
                <span>#{invoice.number}</span>
              </div>
              <div className="flex justify-between">
                <span>Issue:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Due:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: invoice.accentColor }}>Bill To</h3>
          <div className="bg-gray-50 p-4 rounded">
            <p className="font-semibold text-gray-800">{invoice.client.name}</p>
            <p className="text-gray-600">{invoice.client.email}</p>
            <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: invoice.accentColor }}>Items</h3>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: invoice.accentColor }} className="text-white">
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-center py-3 px-4 w-16">Qty</th>
                <th className="text-right py-3 px-4 w-20">Rate</th>
                <th className="text-right py-3 px-4 w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="bg-gray-50 p-4 rounded">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3" style={{ color: invoice.accentColor }}>Notes</h3>
            <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCorporateTemplate = () => (
    <div className="bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Corporate header with dark background */}
      <div className="bg-gray-900 text-white p-8">
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain brightness-0 invert" />
            )}
            <h1 className="text-3xl font-bold">{invoice.company.name || 'Your Company'}</h1>
            <p className="text-gray-300 mt-2">Professional Invoice</p>
          </div>
          <div className="text-right">
            <div className="bg-white text-gray-900 px-4 py-2 rounded">
              <span className="text-lg font-bold">#{invoice.number}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Company and client info in structured format */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
              FROM
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
              TO
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2" style={{ borderColor: invoice.accentColor }}>
              DETAILS
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Issue Date:</span>
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional table with borders */}
        <table className="w-full border border-gray-300 mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-3 px-4 text-left font-bold">DESCRIPTION</th>
              <th className="border border-gray-300 py-3 px-4 text-center font-bold w-20">QTY</th>
              <th className="border border-gray-300 py-3 px-4 text-right font-bold w-24">RATE</th>
              <th className="border border-gray-300 py-3 px-4 text-right font-bold w-24">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 py-3 px-4">{item.description}</td>
                <td className="border border-gray-300 py-3 px-4 text-center">{item.quantity}</td>
                <td className="border border-gray-300 py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
                <td className="border border-gray-300 py-3 px-4 text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total section */}
        <div className="flex justify-end mb-8">
          <div className="w-64 border border-gray-300">
            <div className="bg-gray-900 text-white p-4">
              <div className="flex justify-between text-xl font-bold">
                <span>TOTAL</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t-2 border-gray-300 pt-6">
            <h3 className="font-bold text-gray-900 mb-3">NOTES</h3>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="relative bg-white overflow-hidden" style={{ fontFamily: getFontFamily() }}>
      {/* Creative geometric background */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5" style={{ backgroundColor: invoice.accentColor, transform: 'rotate(45deg) translate(50%, -50%)' }}></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 opacity-5" style={{ backgroundColor: invoice.accentColor, borderRadius: '50%' }}></div>
      
      <div className="relative z-10 p-8">
        {/* Creative header with angled design */}
        <div className="relative mb-12">
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: invoice.accentColor }}></div>
          <div className="pt-8">
            <div className="flex items-end justify-between">
              <div>
                {invoice.company.logo && (
                  <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
                )}
                <h1 className="text-4xl font-bold text-gray-900 transform -skew-x-6 inline-block">
                  {invoice.company.name || 'Your Company'}
                </h1>
              </div>
              <div className="text-right">
                <div className="transform skew-x-6 inline-block p-4" style={{ backgroundColor: invoice.accentColor }}>
                  <span className="text-white font-bold text-xl">INVOICE</span>
                </div>
                <p className="text-gray-600 mt-2">#{invoice.number}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Creative layout with diagonal sections */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-full h-full border-2 border-gray-200 transform rotate-1"></div>
            <div className="relative bg-white p-6 border-2" style={{ borderColor: invoice.accentColor }}>
              <h3 className="font-bold mb-4 text-lg" style={{ color: invoice.accentColor }}>Company Info</h3>
              <div className="space-y-2 text-sm">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-2 -right-2 w-full h-full border-2 border-gray-200 transform -rotate-1"></div>
            <div className="relative bg-white p-6 border-2" style={{ borderColor: invoice.accentColor }}>
              <h3 className="font-bold mb-4 text-lg" style={{ color: invoice.accentColor }}>Bill To</h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date info in creative boxes */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4">
            <div className="text-center p-4 border-2 border-gray-300 transform rotate-2">
              <p className="text-xs text-gray-600">ISSUE DATE</p>
              <p className="font-bold">{formatDate(invoice.issueDate)}</p>
            </div>
            <div className="text-center p-4 border-2 border-gray-300 transform -rotate-2">
              <p className="text-xs text-gray-600">DUE DATE</p>
              <p className="font-bold">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Creative table design */}
        <div className="mb-8">
          <div className="overflow-hidden border-2" style={{ borderColor: invoice.accentColor }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: invoice.accentColor }} className="text-white">
                  <th className="py-4 px-4 text-left font-bold">DESCRIPTION</th>
                  <th className="py-4 px-4 text-center font-bold w-20">QTY</th>
                  <th className="py-4 px-4 text-right font-bold w-24">RATE</th>
                  <th className="py-4 px-4 text-right font-bold w-24">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">${item.rate.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Creative total section */}
        <div className="flex justify-end mb-8">
          <div className="relative">
            <div className="absolute -top-2 -right-2 w-full h-full transform rotate-3" style={{ backgroundColor: invoice.accentColor }}></div>
            <div className="relative bg-white border-2 border-gray-900 p-6">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">TOTAL AMOUNT</p>
                <p className="text-3xl font-bold">${subtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-full h-full bg-gray-100 transform skew-y-1"></div>
            <div className="relative bg-white p-6 border-2 border-gray-300">
              <h3 className="font-bold mb-3" style={{ color: invoice.accentColor }}>Notes</h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderBoutiqueTemplate = () => (
    <div className="relative bg-gradient-to-br from-gray-50 to-white" style={{ fontFamily: getFontFamily() }}>
      {/* Elegant frame */}
      <div className="absolute inset-4 border-2 border-gray-300"></div>
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gray-400"></div>
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gray-400"></div>
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gray-400"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gray-400"></div>
      
      <div className="relative z-10 p-12">
        {/* Boutique header */}
        <div className="text-center mb-12">
          {invoice.company.logo && (
            <div className="mb-6">
              <div className="inline-block p-4 bg-white rounded-full shadow-lg">
                <img src={invoice.company.logo} alt="Logo" className="h-12 object-contain" />
              </div>
            </div>
          )}
          
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
            {invoice.company.name || 'Your Company'}
          </h1>
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gray-400 w-16"></div>
            <span className="mx-4 text-sm tracking-widest text-gray-500">INVOICE</span>
            <div className="h-px bg-gray-400 w-16"></div>
          </div>
          <p className="text-gray-600">#{invoice.number}</p>
        </div>

        {/* Boutique cards layout */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4 text-gray-800 border-b pb-2" style={{ borderColor: invoice.accentColor }}>
              Our Details
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4 text-gray-800 border-b pb-2" style={{ borderColor: invoice.accentColor }}>
              Billed To
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
        </div>

        {/* Date information in elegant format */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 w-80">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">ISSUE DATE</p>
                <p className="font-medium text-gray-800">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">DUE DATE</p>
                <p className="font-medium text-gray-800">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Boutique table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-4 px-6 text-left font-medium text-gray-700">Description</th>
                <th className="py-4 px-6 text-center font-medium text-gray-700 w-20">Qty</th>
                <th className="py-4 px-6 text-right font-medium text-gray-700 w-24">Rate</th>
                <th className="py-4 px-6 text-right font-medium text-gray-700 w-24">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index !== invoice.items.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="py-4 px-6 text-gray-800">{item.description}</td>
                  <td className="py-4 px-6 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-6 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-medium text-gray-800">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Boutique total */}
        <div className="flex justify-end mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 w-64">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">Total Amount</p>
              <p className="text-2xl font-light text-gray-800">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-3 text-gray-800">Notes</h3>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="p-16 bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Ultra minimal header */}
      <div className="mb-16">
        {invoice.company.logo && (
          <img src={invoice.company.logo} alt="Logo" className="h-8 mb-8 object-contain" />
        )}
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              {invoice.company.name || 'Your Company'}
            </h1>
            <p className="text-sm text-gray-500">Invoice</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">#{invoice.number}</p>
          </div>
        </div>
      </div>

      {/* Minimal info layout */}
      <div className="grid grid-cols-3 gap-16 mb-16 text-sm">
        <div>
          <p className="text-gray-500 mb-3">From</p>
          <div className="space-y-1 text-gray-700">
            <p>{invoice.company.email}</p>
            <p>{invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 mb-3">To</p>
          <div className="space-y-1 text-gray-700">
            <p className="font-medium">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
        
        <div>
          <p className="text-gray-500 mb-3">Details</p>
          <div className="space-y-1 text-gray-700">
            <p>Issue: {formatDate(invoice.issueDate)}</p>
            <p>Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      {/* Minimal table */}
      <table className="w-full mb-16">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 font-normal text-gray-500 text-sm">Description</th>
            <th className="text-center py-3 font-normal text-gray-500 text-sm w-16">Qty</th>
            <th className="text-right py-3 font-normal text-gray-500 text-sm w-20">Rate</th>
            <th className="text-right py-3 font-normal text-gray-500 text-sm w-24">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td className="py-4 text-gray-800">{item.description}</td>
              <td className="py-4 text-center text-gray-600">{item.quantity}</td>
              <td className="py-4 text-right text-gray-600">${item.rate.toFixed(2)}</td>
              <td className="py-4 text-right text-gray-800">${(item.quantity * item.rate).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Minimal total */}
      <div className="flex justify-end mb-16">
        <div className="text-right">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-lg font-light text-gray-900">Total ${subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm mb-2">Notes</p>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}
    </div>
  );

  const renderDynamicTemplate = () => (
    <div className="bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Dynamic gradient header */}
      <div className="relative overflow-hidden">
        <div 
          className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600"
          style={{ background: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}80, ${invoice.accentColor}40)` }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div className="text-white">
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-10 mb-2 object-contain brightness-0 invert" />
            )}
            <h1 className="text-2xl font-bold tracking-wide">
              {invoice.company.name || 'Your Company'}
            </h1>
          </div>
          <div className="text-white text-right">
            <p className="text-sm opacity-90">INVOICE</p>
            <p className="text-xl font-bold">#{invoice.number}</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Dynamic cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: invoice.accentColor }}></div>
              Company Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: invoice.accentColor }}></div>
              Bill To
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
        </div>

        {/* Dynamic date section */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-6">
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-1">ISSUE DATE</p>
              <p className="font-bold text-gray-900">{formatDate(invoice.issueDate)}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-1">DUE DATE</p>
              <p className="font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic table */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-8">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: invoice.accentColor }} className="text-white">
                <th className="py-4 px-6 text-left font-bold">DESCRIPTION</th>
                <th className="py-4 px-6 text-center font-bold w-20">QTY</th>
                <th className="py-4 px-6 text-right font-bold w-24">RATE</th>
                <th className="py-4 px-6 text-right font-bold w-24">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-4 px-6 text-gray-800">{item.description}</td>
                  <td className="py-4 px-6 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-4 px-6 text-right text-gray-600">${item.rate.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-bold text-gray-900">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dynamic total */}
        <div className="flex justify-end mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-6 rounded-xl shadow-lg">
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">TOTAL AMOUNT</p>
              <p className="text-3xl font-bold">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: invoice.accentColor }}></div>
              Notes
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderTechTemplate = () => (
    <div className="bg-gray-900 text-white" style={{ fontFamily: getFontFamily() }}>
      {/* Tech header with neon accents */}
      <div className="relative p-8 border-b border-gray-700">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
        
        <div className="flex justify-between items-start">
          <div>
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain brightness-0 invert" />
            )}
            <h1 className="text-3xl font-bold tracking-wider text-cyan-400">
              {invoice.company.name || 'YOUR COMPANY'}
            </h1>
            <p className="text-gray-400 mt-2 font-mono text-sm">DIGITAL INVOICE</p>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg">
              <span className="font-mono font-bold">#{invoice.number}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Tech grid layout */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold mb-4 font-mono text-sm tracking-wider">
              &gt; COMPANY_DATA
            </h3>
            <div className="space-y-2 text-sm text-gray-300 font-mono">
              <p>email: {invoice.company.email}</p>
              <p>phone: {invoice.company.phone}</p>
              <p className="whitespace-pre-line">address: {invoice.company.address}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold mb-4 font-mono text-sm tracking-wider">
              &gt; CLIENT_DATA
            </h3>
            <div className="space-y-2 text-sm text-gray-300 font-mono">
              <p>name: {invoice.client.name}</p>
              <p>email: {invoice.client.email}</p>
              <p className="whitespace-pre-line">address: {invoice.client.address}</p>
            </div>
          </div>
        </div>

        {/* Tech date display */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 font-mono">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-cyan-400 text-xs mb-1">ISSUE_DATE</p>
                <p className="text-white">{formatDate(invoice.issueDate)}</p>
              </div>
              <div>
                <p className="text-cyan-400 text-xs mb-1">DUE_DATE</p>
                <p className="text-white">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tech table */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden mb-8">
          <table className="w-full font-mono">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-600 to-blue-600">
                <th className="py-4 px-6 text-left font-bold text-white">DESCRIPTION</th>
                <th className="py-4 px-6 text-center font-bold text-white w-20">QTY</th>
                <th className="py-4 px-6 text-right font-bold text-white w-24">RATE</th>
                <th className="py-4 px-6 text-right font-bold text-white w-24">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                  <td className="py-4 px-6 text-gray-300">{item.description}</td>
                  <td className="py-4 px-6 text-center text-cyan-400">{item.quantity}</td>
                  <td className="py-4 px-6 text-right text-gray-300">${item.rate.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right text-white font-bold">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tech total */}
        <div className="flex justify-end mb-8">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 rounded-lg">
            <div className="text-right font-mono">
              <p className="text-cyan-100 text-sm mb-1">&gt; TOTAL_AMOUNT</p>
              <p className="text-3xl font-bold text-white">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-cyan-400 font-bold mb-3 font-mono text-sm tracking-wider">
              &gt; NOTES
            </h3>
            <p className="text-gray-300 whitespace-pre-line font-mono text-sm">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderVintageTemplate = () => (
    <div className="bg-amber-50" style={{ fontFamily: 'Merriweather, serif' }}>
      {/* Vintage decorative border */}
      <div className="border-8 border-double border-amber-800 m-4">
        <div className="p-12">
          {/* Vintage header */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-amber-800"></div>
            <div className="pt-6">
              {invoice.company.logo && (
                <img src={invoice.company.logo} alt="Logo" className="h-16 mx-auto mb-6 object-contain sepia" />
              )}
              
              <h1 className="text-4xl font-bold text-amber-900 mb-2 tracking-wide">
                {invoice.company.name || 'Your Company'}
              </h1>
              
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-px bg-amber-700"></div>
                <span className="mx-4 text-amber-700 font-bold tracking-widest">INVOICE</span>
                <div className="w-16 h-px bg-amber-700"></div>
              </div>
              
              <div className="inline-block border-2 border-amber-800 px-6 py-2 bg-amber-100">
                <span className="text-amber-900 font-bold">No. {invoice.number}</span>
              </div>
            </div>
          </div>

          {/* Vintage info sections */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="border-2 border-amber-700 p-6 bg-amber-100">
              <h3 className="text-amber-900 font-bold mb-4 text-center border-b border-amber-700 pb-2">
                From Our Establishment
              </h3>
              <div className="space-y-2 text-amber-800 text-center">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
            
            <div className="border-2 border-amber-700 p-6 bg-amber-100">
              <h3 className="text-amber-900 font-bold mb-4 text-center border-b border-amber-700 pb-2">
                Billed To
              </h3>
              <div className="space-y-2 text-amber-800 text-center">
                <p className="font-bold">{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Vintage date section */}
          <div className="text-center mb-12">
            <div className="inline-block border-2 border-amber-700 bg-amber-100 p-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-amber-700 text-sm font-bold mb-1">Date of Issue</p>
                  <p className="text-amber-900 font-bold">{formatDate(invoice.issueDate)}</p>
                </div>
                <div className="text-center">
                  <p className="text-amber-700 text-sm font-bold mb-1">Payment Due</p>
                  <p className="text-amber-900 font-bold">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vintage table */}
          <div className="border-4 border-double border-amber-800 mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-amber-200 border-b-2 border-amber-800">
                  <th className="py-4 px-6 text-left font-bold text-amber-900">Description of Services</th>
                  <th className="py-4 px-6 text-center font-bold text-amber-900 w-20">Qty</th>
                  <th className="py-4 px-6 text-right font-bold text-amber-900 w-24">Rate</th>
                  <th className="py-4 px-6 text-right font-bold text-amber-900 w-24">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-amber-50">
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={index !== invoice.items.length - 1 ? 'border-b border-amber-300' : ''}>
                    <td className="py-4 px-6 text-amber-900">{item.description}</td>
                    <td className="py-4 px-6 text-center text-amber-800">{item.quantity}</td>
                    <td className="py-4 px-6 text-right text-amber-800">${item.rate.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-bold text-amber-900">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vintage total */}
          <div className="flex justify-end mb-8">
            <div className="border-4 border-double border-amber-800 bg-amber-200 p-6">
              <div className="text-right">
                <p className="text-amber-700 text-sm mb-2">Total Amount Due</p>
                <p className="text-3xl font-bold text-amber-900">${subtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-2 border-amber-700 bg-amber-100 p-6">
              <h3 className="text-amber-900 font-bold mb-3 text-center border-b border-amber-700 pb-2">
                Additional Notes
              </h3>
              <p className="text-amber-800 whitespace-pre-line text-center">{invoice.notes}</p>
            </div>
          )}

          {/* Vintage footer decoration */}
          <div className="text-center mt-12">
            <div className="w-32 h-1 bg-amber-800 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderArtisticTemplate = () => (
    <div className="relative bg-white overflow-hidden" style={{ fontFamily: getFontFamily() }}>
      {/* Artistic background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full transform rotate-45 scale-150"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10">
        <div className="w-full h-full bg-gradient-to-tr from-blue-400 via-teal-400 to-green-400 transform -rotate-12"></div>
      </div>
      
      <div className="relative z-10 p-8">
        {/* Artistic header */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"></div>
          
          <div className="pt-8">
            {invoice.company.logo && (
              <div className="mb-6">
                <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full shadow-lg">
                  <img src={invoice.company.logo} alt="Logo" className="h-12 object-contain" />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              {invoice.company.name || 'Your Company'}
            </h1>
            
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg transform -rotate-2">
              <span className="font-bold">INVOICE #{invoice.number}</span>
            </div>
          </div>
        </div>

        {/* Artistic cards */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
              <h3 className="font-bold text-purple-700 mb-4 flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2"></div>
                Studio Information
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-teal-200 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
              <h3 className="font-bold text-blue-700 mb-4 flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mr-2"></div>
                Client Details
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{invoice.client.name}</p>
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Artistic date section */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-lg transform rotate-2">
              <p className="text-purple-600 text-xs font-bold mb-2">CREATED</p>
              <p className="font-bold text-gray-900">{formatDate(invoice.issueDate)}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl shadow-lg transform -rotate-2">
              <p className="text-blue-600 text-xs font-bold mb-2">DUE DATE</p>
              <p className="font-bold text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Artistic table */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl transform rotate-1"></div>
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
                  <th className="py-4 px-6 text-left font-bold">Creative Work</th>
                  <th className="py-4 px-6 text-center font-bold w-20">Qty</th>
                  <th className="py-4 px-6 text-right font-bold w-24">Rate</th>
                  <th className="py-4 px-6 text-right font-bold w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-white'}>
                    <td className="py-4 px-6 text-gray-800">{item.description}</td>
                    <td className="py-4 px-6 text-center text-purple-600 font-bold">{item.quantity}</td>
                    <td className="py-4 px-6 text-right text-gray-700">${item.rate.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right font-bold text-gray-900">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Artistic total */}
        <div className="flex justify-end mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 rounded-2xl shadow-lg">
              <div className="text-right">
                <p className="text-purple-100 text-sm mb-2">TOTAL INVESTMENT</p>
                <p className="text-4xl font-bold">${subtotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl transform -rotate-1"></div>
            <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
              <h3 className="font-bold text-orange-700 mb-3 flex items-center">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mr-2"></div>
                Creative Notes
              </h3>
              <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfessionalTemplate = () => (
    <div className="bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Professional letterhead */}
      <div className="border-b-4 border-gray-800 pb-8 mb-8">
        <div className="flex justify-between items-start p-8">
          <div className="flex items-center space-x-6">
            {invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-16 object-contain" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {invoice.company.name || 'Your Company'}
              </h1>
              <p className="text-gray-600 mt-1">Professional Services</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gray-900 text-white px-6 py-3 rounded">
              <p className="text-sm font-medium">INVOICE</p>
              <p className="text-xl font-bold">#{invoice.number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8">
        {/* Professional layout */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
              Service Provider
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
              Bill To
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide border-b border-gray-300 pb-1">
              Invoice Details
            </h3>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Issue Date:</span>
                <span className="font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Due Date:</span>
                <span className="font-medium">{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional table */}
        <div className="mb-12">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-t border-b border-gray-300">
                <th className="py-4 px-4 text-left font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Description
                </th>
                <th className="py-4 px-4 text-center font-bold text-gray-900 text-sm uppercase tracking-wide w-20">
                  Qty
                </th>
                <th className="py-4 px-4 text-right font-bold text-gray-900 text-sm uppercase tracking-wide w-24">
                  Rate
                </th>
                <th className="py-4 px-4 text-right font-bold text-gray-900 text-sm uppercase tracking-wide w-24">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-4 px-4 text-gray-800 border-b border-gray-200">{item.description}</td>
                  <td className="py-4 px-4 text-center text-gray-700 border-b border-gray-200">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-700 border-b border-gray-200">${item.rate.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900 border-b border-gray-200">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Professional total */}
        <div className="flex justify-end mb-12">
          <div className="w-80">
            <div className="bg-gray-100 border border-gray-300 p-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 uppercase tracking-wide">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="border-t border-gray-300 pt-8">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Terms & Notes
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStartupTemplate = () => (
    <div className="bg-white" style={{ fontFamily: getFontFamily() }}>
      {/* Startup header with modern gradient */}
      <div className="relative overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {invoice.company.logo && (
                <div className="bg-white p-2 rounded-lg">
                  <img src={invoice.company.logo} alt="Logo" className="h-10 object-contain" />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {invoice.company.name || 'Your Company'}
                </h1>
                <p className="text-indigo-100">Invoice</p>
              </div>
            </div>
            <div className="text-white text-right">
              <p className="text-sm opacity-90">Invoice Number</p>
              <p className="text-2xl font-bold">#{invoice.number}</p>
            </div>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="relative">
          <svg className="w-full h-6 text-indigo-500" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </div>

      <div className="px-8">
        {/* Startup cards layout */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-indigo-700 mb-4 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              From
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="font-semibold text-purple-700 mb-4 flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              To
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{invoice.client.name}</p>
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
        </div>

        {/* Startup date badges */}
        <div className="flex justify-center space-x-4 mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg">
            <p className="text-xs font-medium opacity-90">Issue Date</p>
            <p className="font-bold">{formatDate(invoice.issueDate)}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg">
            <p className="text-xs font-medium opacity-90">Due Date</p>
            <p className="font-bold">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Startup table */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-sm mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <th className="py-4 px-6 text-left font-semibold">Description</th>
                <th className="py-4 px-6 text-center font-semibold w-20">Qty</th>
                <th className="py-4 px-6 text-right font-semibold w-24">Rate</th>
                <th className="py-4 px-6 text-right font-semibold w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-4 px-6 text-gray-800">{item.description}</td>
                  <td className="py-4 px-6 text-center text-indigo-600 font-medium">{item.quantity}</td>
                  <td className="py-4 px-6 text-right text-gray-700">${item.rate.toFixed(2)}</td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">${(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Startup total */}
        <div className="flex justify-end mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="text-right">
              <p className="text-indigo-100 text-sm mb-1">Total Amount</p>
              <p className="text-3xl font-bold">${subtotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
              Notes
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Template renderer
  const renderTemplate = () => {
    switch (invoice.template) {
      case 'elegant': return renderElegantTemplate();
      case 'modern': return renderModernTemplate();
      case 'corporate': return renderCorporateTemplate();
      case 'creative': return renderCreativeTemplate();
      case 'boutique': return renderBoutiqueTemplate();
      case 'minimal': return renderMinimalTemplate();
      case 'dynamic': return renderDynamicTemplate();
      case 'tech': return renderTechTemplate();
      case 'vintage': return renderVintageTemplate();
      case 'artistic': return renderArtisticTemplate();
      case 'professional': return renderProfessionalTemplate();
      case 'startup': return renderStartupTemplate();
      default: return renderElegantTemplate();
    }
  };

  return (
    <div style={{ 
      minHeight: '297mm',
      width: '210mm',
      margin: '0 auto',
    }}>
      {renderTemplate()}
      
      {invoice.showFooter && (
        <div className="text-center text-gray-400 text-xs py-4 border-t border-gray-200 mt-8">
          Generated by Invoice Beautifier
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;