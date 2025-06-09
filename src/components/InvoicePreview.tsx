import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const getCurrencySymbol = (currency: string) => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[currency as keyof typeof currencies] || '$';
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

    const taxAmount = invoice.taxRates.reduce(
      (sum, tax) => sum + (afterDiscount * tax.rate) / 100,
      0
    );

    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol(invoice.currency);

  // Quantum Nexus Template
  if (invoice.template === 'quantum') {
    return (
      <div className="relative min-h-[297mm] w-[210mm] bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Quantum Field Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.3) 1px, transparent 1px),
              linear-gradient(45deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 80px 80px, 40px 40px, 20px 20px, 20px 20px',
            animation: 'quantumField 15s ease-in-out infinite'
          }}></div>
        </div>

        {/* Floating Quantum Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-16 w-4 h-4 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-gradient-to-r from-fuchsia-400 to-pink-500 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
          <div className="absolute bottom-32 left-24 w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full opacity-70 animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-48 right-16 w-5 h-5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}></div>
          <div className="absolute top-60 left-32 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-55 animate-pulse" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
        </div>

        {/* Morphing Geometric Shapes */}
        <div className="absolute top-16 right-16 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-purple-500/20 transform rotate-45 rounded-lg animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 left-16 w-12 h-12 bg-gradient-to-br from-fuchsia-400/20 to-pink-500/20 transform rotate-12 rounded-full animate-spin" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-violet-500/20 transform -rotate-12 animate-pulse" style={{ animationDelay: '2s', animationDuration: '8s', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>

        {/* Content Container */}
        <div className="relative z-10 p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              {invoice.company.logo && (
                <img src={invoice.company.logo} alt="Logo" className="h-16 w-auto mb-4 filter brightness-0 invert" />
              )}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent mb-2">
                {invoice.company.name}
              </h1>
              <div className="text-purple-200 space-y-1">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-orange-300 bg-clip-text text-transparent mb-4">
                INVOICE
              </h2>
              <div className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-violet-400/30">
                <p className="text-purple-200 mb-2">Invoice Number</p>
                <p className="text-2xl font-bold text-white">{invoice.number}</p>
                <p className="text-purple-200 mt-4 mb-2">Issue Date</p>
                <p className="text-white">{formatDate(invoice.issueDate)}</p>
                <p className="text-purple-200 mt-4 mb-2">Due Date</p>
                <p className="text-white">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-purple-200 mb-4">Bill To:</h3>
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
              <p className="text-xl font-bold text-white mb-2">{invoice.client.name}</p>
              <p className="text-purple-200">{invoice.client.email}</p>
              <p className="text-purple-200 whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-400/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-600/30 to-purple-600/30">
                    <th className="text-left p-4 text-purple-200 font-semibold">Description</th>
                    <th className="text-center p-4 text-purple-200 font-semibold">Qty</th>
                    <th className="text-right p-4 text-purple-200 font-semibold">Rate</th>
                    <th className="text-right p-4 text-purple-200 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-t border-purple-400/20">
                      <td className="p-4 text-white">{item.description}</td>
                      <td className="p-4 text-center text-purple-200">{item.quantity}</td>
                      <td className="p-4 text-right text-purple-200">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="p-4 text-right text-white font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-80">
              <div className="bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
                <div className="space-y-3">
                  <div className="flex justify-between text-purple-200">
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-pink-300">
                      <span>Discount:</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between text-purple-200">
                      <span>Tax:</span>
                      <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-purple-400/30 pt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total:</span>
                      <span className="bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                        {currencySymbol}{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-200 mb-4">Notes:</h3>
              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
                <p className="text-purple-100 whitespace-pre-line">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center mb-8">
              <div className="bg-white rounded-xl p-6 inline-block">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-32 h-32 mx-auto" />
                <p className="text-gray-800 mt-2 text-sm">{invoice.paymentInfo.method} Payment</p>
              </div>
            </div>
          )}

          {/* Footer */}
          {invoice.showFooter && (
            <div className="text-center text-purple-300 text-sm">
              <p>Generated by Invoice Beautifier</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes quantumField {
            0%, 100% { 
              opacity: 0.2; 
              transform: scale(1) rotate(0deg);
            }
            25% { 
              opacity: 0.4; 
              transform: scale(1.05) rotate(2deg);
            }
            50% { 
              opacity: 0.3; 
              transform: scale(0.95) rotate(-2deg);
            }
            75% { 
              opacity: 0.5; 
              transform: scale(1.02) rotate(1deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Aurora Celestialis Template
  if (invoice.template === 'aurora') {
    return (
      <div className="relative min-h-[297mm] w-[210mm] bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Cosmic Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-600/20 via-pink-500/20 via-emerald-400/20 via-cyan-300/20 to-blue-400/30"></div>
          
          {/* Aurora Waves */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-8 left-0 w-full h-16 bg-gradient-to-r from-transparent via-emerald-400/60 via-cyan-300/60 to-transparent transform -skew-y-3 animate-pulse" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
              <div className="absolute top-24 left-0 w-full h-12 bg-gradient-to-r from-transparent via-purple-500/50 via-pink-400/50 to-transparent transform skew-y-2 animate-pulse" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
              <div className="absolute top-40 left-0 w-full h-8 bg-gradient-to-r from-transparent via-indigo-400/40 via-blue-300/40 to-transparent transform -skew-y-1 animate-pulse" style={{ animationDelay: '4s', animationDuration: '12s' }}></div>
              <div className="absolute bottom-32 left-0 w-full h-10 bg-gradient-to-r from-transparent via-violet-400/45 via-fuchsia-300/45 to-transparent transform skew-y-2 animate-pulse" style={{ animationDelay: '6s', animationDuration: '14s' }}></div>
            </div>
          </div>

          {/* Stellar Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-12 left-16 w-2 h-2 bg-cyan-300 rounded-full animate-ping opacity-80" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-24 right-24 w-3 h-3 bg-emerald-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-40 left-32 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-70" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-56 right-16 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '3s' }}></div>
            <div className="absolute bottom-32 right-32 w-4 h-4 bg-indigo-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-48 left-20 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-80" style={{ animationDelay: '5s' }}></div>
            <div className="absolute top-1/2 right-12 w-2 h-2 bg-violet-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '6s' }}></div>
            <div className="absolute bottom-16 left-40 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50" style={{ animationDelay: '7s' }}></div>
          </div>

          {/* Constellation Patterns */}
          <div className="absolute inset-0 overflow-hidden opacity-40">
            <svg className="absolute top-16 right-16 w-24 h-24 text-cyan-300 animate-pulse" style={{ animationDuration: '6s' }}>
              <circle cx="6" cy="6" r="2" fill="currentColor" />
              <circle cx="18" cy="12" r="1" fill="currentColor" />
              <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              <circle cx="20" cy="20" r="1" fill="currentColor" />
              <line x1="6" y1="6" x2="18" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
              <line x1="18" y1="12" x2="12" y2="18" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
              <line x1="12" y1="18" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
            </svg>
            <svg className="absolute bottom-24 left-16 w-20 h-20 text-purple-400 animate-pulse" style={{ animationDelay: '3s', animationDuration: '8s' }}>
              <circle cx="10" cy="4" r="1" fill="currentColor" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" />
              <circle cx="16" cy="12" r="1" fill="currentColor" />
              <circle cx="10" cy="16" r="2" fill="currentColor" />
              <line x1="10" y1="4" x2="4" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              <line x1="16" y1="12" x2="10" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
            </svg>
          </div>

          {/* Cosmic Orbs */}
          <div className="absolute top-32 left-12 w-12 h-12 bg-gradient-to-br from-emerald-400/30 to-cyan-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
          <div className="absolute bottom-32 right-12 w-16 h-16 bg-gradient-to-br from-purple-500/25 to-pink-400/25 rounded-full animate-pulse" style={{ animationDelay: '4s', animationDuration: '9s' }}></div>
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-gradient-to-br from-indigo-400/35 to-blue-300/35 rounded-full animate-pulse" style={{ animationDelay: '2s', animationDuration: '11s' }}></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-12">
          {/* Header */}
          <div className="flex justify-between items-start mb-12">
            <div>
              {invoice.company.logo && (
                <img src={invoice.company.logo} alt="Logo" className="h-16 w-auto mb-4 filter brightness-0 invert" />
              )}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
                {invoice.company.name}
              </h1>
              <div className="text-cyan-200 space-y-1">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-4">
                INVOICE
              </h2>
              <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-emerald-400/30">
                <p className="text-cyan-200 mb-2">Invoice Number</p>
                <p className="text-2xl font-bold text-white">{invoice.number}</p>
                <p className="text-cyan-200 mt-4 mb-2">Issue Date</p>
                <p className="text-white">{formatDate(invoice.issueDate)}</p>
                <p className="text-cyan-200 mt-4 mb-2">Due Date</p>
                <p className="text-white">{formatDate(invoice.dueDate)}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-cyan-200 mb-4">Bill To:</h3>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
              <p className="text-xl font-bold text-white mb-2">{invoice.client.name}</p>
              <p className="text-cyan-200">{invoice.client.email}</p>
              <p className="text-cyan-200 whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-12">
            <div className="bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-400/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-600/30 to-cyan-600/30">
                    <th className="text-left p-4 text-cyan-200 font-semibold">Description</th>
                    <th className="text-center p-4 text-cyan-200 font-semibold">Qty</th>
                    <th className="text-right p-4 text-cyan-200 font-semibold">Rate</th>
                    <th className="text-right p-4 text-cyan-200 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={item.id} className="border-t border-cyan-400/20">
                      <td className="p-4 text-white">{item.description}</td>
                      <td className="p-4 text-center text-cyan-200">{item.quantity}</td>
                      <td className="p-4 text-right text-cyan-200">{currencySymbol}{item.rate.toFixed(2)}</td>
                      <td className="p-4 text-right text-white font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-80">
              <div className="bg-gradient-to-r from-slate-800/50 to-indigo-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30">
                <div className="space-y-3">
                  <div className="flex justify-between text-cyan-200">
                    <span>Subtotal:</span>
                    <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-300">
                      <span>Discount:</span>
                      <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between text-cyan-200">
                      <span>Tax:</span>
                      <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-cyan-400/30 pt-3">
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total:</span>
                      <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                        {currencySymbol}{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-cyan-200 mb-4">Notes:</h3>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
                <p className="text-cyan-100 whitespace-pre-line">{invoice.notes}</p>
              </div>
            </div>
          )}

          {/* Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="text-center mb-8">
              <div className="bg-white rounded-xl p-6 inline-block">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-32 h-32 mx-auto" />
                <p className="text-gray-800 mt-2 text-sm">{invoice.paymentInfo.method} Payment</p>
              </div>
            </div>
          )}

          {/* Footer */}
          {invoice.showFooter && (
            <div className="text-center text-cyan-300 text-sm">
              <p>Generated by Invoice Beautifier</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default template fallback
  return (
    <div className="min-h-[297mm] w-[210mm] bg-white p-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-16 w-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.company.name}</h1>
          <div className="text-gray-600 space-y-1">
            <p>{invoice.company.email}</p>
            <p>{invoice.company.phone}</p>
            <p className="whitespace-pre-line">{invoice.company.address}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 mb-1">Invoice Number</p>
            <p className="text-xl font-bold">{invoice.number}</p>
            <p className="text-gray-600 mt-3 mb-1">Issue Date</p>
            <p>{formatDate(invoice.issueDate)}</p>
            <p className="text-gray-600 mt-3 mb-1">Due Date</p>
            <p>{formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-lg font-bold text-gray-900 mb-1">{invoice.client.name}</p>
          <p className="text-gray-600">{invoice.client.email}</p>
          <p className="text-gray-600 whitespace-pre-line">{invoice.client.address}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-semibold">Description</th>
              <th className="text-center p-3 font-semibold">Qty</th>
              <th className="text-right p-3 font-semibold">Rate</th>
              <th className="text-right p-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.description}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                <td className="p-3 text-right font-semibold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              {totals.taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        </div>
      )}

      {invoice.paymentInfo?.qrCode && (
        <div className="text-center mb-6">
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-32 h-32 mx-auto" />
            <p className="text-gray-600 mt-2 text-sm">{invoice.paymentInfo.method} Payment</p>
          </div>
        </div>
      )}

      {invoice.showFooter && (
        <div className="text-center text-gray-500 text-sm">
          <p>Generated by Invoice Beautifier</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;