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

    const taxAmount = (invoice.taxRates || []).reduce(
      (sum, tax) => sum + (afterDiscount * tax.rate) / 100,
      0
    );

    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol(invoice.currency);

  // QUANTUM TEMPLATE - Revolutionary Multi-Dimensional Design
  if (invoice.template === 'quantum') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Quantum Field Background */}
        <div className="absolute inset-0">
          {/* Animated Quantum Particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-violet-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-fuchsia-400 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute bottom-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-60 left-1/4 w-1 h-1 bg-violet-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Quantum Energy Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 via-fuchsia-500/10 to-pink-500/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-400/5 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-violet-400/5 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Quantum Header */}
          <div className="bg-gradient-to-r from-violet-900/80 via-purple-900/80 to-fuchsia-900/80 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-violet-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                {invoice.company.logo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-2xl blur-lg opacity-50"></div>
                    <img src={invoice.company.logo} alt="Logo" className="relative h-16 w-auto rounded-2xl shadow-xl" />
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent mb-2">
                    {invoice.company.name}
                  </h1>
                  <div className="text-violet-300 space-y-1">
                    <p>{invoice.company.email}</p>
                    <p>{invoice.company.phone}</p>
                    <p className="whitespace-pre-line">{invoice.company.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-4">
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl p-6 shadow-xl">
                  <h2 className="text-3xl font-bold text-white mb-2">INVOICE</h2>
                  <p className="text-violet-100 text-xl font-mono">{invoice.number}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="text-violet-200 space-y-2">
                    <div className="flex justify-between">
                      <span>Issue Date:</span>
                      <span className="text-white font-medium">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="text-white font-medium">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Client Section */}
          <div className="bg-gradient-to-r from-purple-900/60 via-fuchsia-900/60 to-pink-900/60 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30 shadow-xl">
            <h3 className="text-2xl font-bold text-purple-200 mb-4">Bill To</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-2">{invoice.client.name}</h4>
              <div className="text-purple-200 space-y-1">
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Quantum Items Table */}
          <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/80 to-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-violet-500/30 shadow-2xl mb-8">
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6">
              <div className="grid grid-cols-12 gap-4 text-white font-bold">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            <div className="divide-y divide-violet-500/20">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-6 text-white hover:bg-white/5 transition-colors">
                  <div className="col-span-6 font-medium">{item.description}</div>
                  <div className="col-span-2 text-center text-violet-200">{item.quantity}</div>
                  <div className="col-span-2 text-center text-violet-200">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantum Totals */}
          <div className="flex justify-end mb-8">
            <div className="bg-gradient-to-br from-violet-900/80 via-purple-900/80 to-fuchsia-900/80 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30 shadow-2xl min-w-96">
              <div className="space-y-4">
                <div className="flex justify-between text-violet-200">
                  <span>Subtotal:</span>
                  <span className="font-medium">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-pink-300">
                    <span>Discount:</span>
                    <span className="font-medium">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-violet-200">
                    <span>Tax:</span>
                    <span className="font-medium">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-violet-500/30 pt-4">
                  <div className="flex justify-between text-2xl font-bold text-white">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-500/30 text-center">
              <h3 className="text-2xl font-bold text-purple-200 mb-6">Quantum Payment Portal</h3>
              <div className="inline-block bg-white p-6 rounded-2xl shadow-2xl">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-32 h-32 mx-auto" />
              </div>
              <p className="text-purple-300 mt-4">{invoice.paymentInfo.method} Payment</p>
            </div>
          )}

          {/* Quantum Notes */}
          {invoice.notes && (
            <div className="bg-gradient-to-r from-slate-900/60 to-purple-900/60 backdrop-blur-xl rounded-3xl p-8 border border-violet-500/30">
              <h3 className="text-2xl font-bold text-violet-200 mb-4">Quantum Notes</h3>
              <p className="text-violet-100 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AURORA TEMPLATE - Breathtaking Northern Lights Design
  if (invoice.template === 'aurora') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Aurora Background Effects */}
        <div className="absolute inset-0">
          {/* Northern Lights Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-cyan-400/20 via-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-emerald-300/10 to-transparent transform skew-y-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-cyan-300/10 to-transparent transform -skew-y-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/10 to-transparent transform skew-x-12 animate-pulse" style={{ animationDelay: '3s' }}></div>
          
          {/* Celestial Stars */}
          <div className="absolute top-16 left-16 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-80"></div>
          <div className="absolute top-32 right-24 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute top-48 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 right-16 w-2 h-2 bg-purple-300 rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-48 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-ping opacity-70" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Aurora Flowing Gradients */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-400/30 via-cyan-400/30 to-blue-500/30 transform -skew-y-3 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-purple-500/30 via-pink-500/30 to-rose-400/30 transform skew-y-3 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Aurora Header */}
          <div className="bg-gradient-to-r from-emerald-900/70 via-cyan-900/70 to-blue-900/70 backdrop-blur-2xl rounded-[2rem] p-10 mb-10 border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
            <div className="flex justify-between items-start">
              <div className="space-y-6">
                {invoice.company.logo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl blur-xl opacity-60"></div>
                    <img src={invoice.company.logo} alt="Logo" className="relative h-20 w-auto rounded-3xl shadow-2xl" />
                  </div>
                )}
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-3">
                    {invoice.company.name}
                  </h1>
                  <div className="text-cyan-200 space-y-2 text-lg">
                    <p>{invoice.company.email}</p>
                    <p>{invoice.company.phone}</p>
                    <p className="whitespace-pre-line">{invoice.company.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-6">
                <div className="bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 rounded-3xl p-8 shadow-2xl shadow-cyan-500/30">
                  <h2 className="text-4xl font-bold text-white mb-3">INVOICE</h2>
                  <p className="text-cyan-100 text-2xl font-mono tracking-wider">{invoice.number}</p>
                </div>
                <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 border border-cyan-300/30">
                  <div className="text-cyan-200 space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                      <span>Issue Date:</span>
                      <span className="text-white font-semibold">{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Due Date:</span>
                      <span className="text-white font-semibold">{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aurora Client Section */}
          <div className="bg-gradient-to-r from-blue-900/60 via-purple-900/60 to-pink-900/60 backdrop-blur-2xl rounded-[2rem] p-10 mb-10 border border-blue-400/30 shadow-xl">
            <h3 className="text-3xl font-bold text-blue-200 mb-6">Bill To</h3>
            <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-blue-300/30">
              <h4 className="text-2xl font-bold text-white mb-3">{invoice.client.name}</h4>
              <div className="text-blue-200 space-y-2 text-lg">
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Aurora Items Table */}
          <div className="bg-gradient-to-br from-slate-900/70 via-blue-900/70 to-purple-900/70 backdrop-blur-2xl rounded-[2rem] overflow-hidden border border-cyan-400/30 shadow-2xl mb-10">
            <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 via-blue-500 to-purple-600 p-8">
              <div className="grid grid-cols-12 gap-6 text-white font-bold text-lg">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            <div className="divide-y divide-cyan-400/20">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-6 p-8 text-white hover:bg-white/10 transition-all duration-300">
                  <div className="col-span-6 font-semibold text-lg">{item.description}</div>
                  <div className="col-span-2 text-center text-cyan-200 text-lg">{item.quantity}</div>
                  <div className="col-span-2 text-center text-cyan-200 text-lg">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-lg">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Aurora Totals */}
          <div className="flex justify-end mb-10">
            <div className="bg-gradient-to-br from-emerald-900/70 via-cyan-900/70 to-blue-900/70 backdrop-blur-2xl rounded-[2rem] p-10 border border-emerald-400/30 shadow-2xl min-w-[28rem]">
              <div className="space-y-6">
                <div className="flex justify-between text-cyan-200 text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-300 text-lg">
                    <span>Discount:</span>
                    <span className="font-semibold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-cyan-200 text-lg">
                    <span>Tax:</span>
                    <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-cyan-400/30 pt-6">
                  <div className="flex justify-between text-3xl font-bold text-white">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Aurora Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-rose-900/60 backdrop-blur-2xl rounded-[2rem] p-10 mb-10 border border-purple-400/30 text-center">
              <h3 className="text-3xl font-bold text-purple-200 mb-8">Celestial Payment Gateway</h3>
              <div className="inline-block bg-white p-8 rounded-3xl shadow-2xl shadow-purple-500/30">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-40 h-40 mx-auto" />
              </div>
              <p className="text-purple-300 mt-6 text-lg">{invoice.paymentInfo.method} Payment</p>
            </div>
          )}

          {/* Aurora Notes */}
          {invoice.notes && (
            <div className="bg-gradient-to-r from-slate-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-[2rem] p-10 border border-blue-400/30">
              <h3 className="text-3xl font-bold text-blue-200 mb-6">Aurora Notes</h3>
              <p className="text-blue-100 whitespace-pre-line leading-relaxed text-lg">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT ELEGANT TEMPLATE (keeping existing design for other templates)
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.company.logo && (
              <img
                src={invoice.company.logo}
                alt="Company logo"
                className="h-16 w-auto mb-4"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {invoice.company.name}
            </h1>
            <div className="text-gray-600 space-y-1">
              <p>{invoice.company.email}</p>
              <p>{invoice.company.phone}</p>
              <p className="whitespace-pre-line">{invoice.company.address}</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <p className="text-lg text-gray-600 mb-4">{invoice.number}</p>
            <div className="text-sm text-gray-600 space-y-1">
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

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-1">{invoice.client.name}</h4>
            <div className="text-gray-600 space-y-1">
              <p>{invoice.client.email}</p>
              <p className="whitespace-pre-line">{invoice.client.address}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-900">Description</th>
                <th className="text-center py-3 font-semibold text-gray-900">Qty</th>
                <th className="text-center py-3 font-semibold text-gray-900">Rate</th>
                <th className="text-right py-3 font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 text-gray-900">{item.description}</td>
                  <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                  <td className="py-3 text-center text-gray-600">{currencySymbol}{item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-900">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
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
                <div className="flex justify-between text-gray-600">
                  <span>Tax:</span>
                  <span>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment QR Code */}
        {invoice.paymentInfo?.qrCode && (
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
            <div className="inline-block bg-gray-50 p-4 rounded-lg">
              <img
                src={invoice.paymentInfo.qrCode}
                alt="Payment QR Code"
                className="w-32 h-32 mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">{invoice.paymentInfo.method} Payment</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        {invoice.showFooter && (
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
            Generated by Invoice Beautifier
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;