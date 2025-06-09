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