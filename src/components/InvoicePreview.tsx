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

  // HOLOGRAPHIC TEMPLATE - Mind-Bending 3D Holographic Design
  if (invoice.template === 'holographic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Holographic Grid Background */}
        <div className="absolute inset-0">
          {/* 3D Grid Lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(rgba(255, 0, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 25px 25px, 25px 25px',
            animation: 'holographicGrid 8s ease-in-out infinite'
          }}></div>
          
          {/* Holographic Particles */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-80 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-magenta-400 rounded-full animate-bounce opacity-70 shadow-lg shadow-magenta-400/50"></div>
          <div className="absolute top-60 left-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-60 shadow-lg shadow-yellow-400/50"></div>
          <div className="absolute bottom-40 right-20 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-50 shadow-lg shadow-green-400/50" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-60 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60 shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Holographic Waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-magenta-500/10 via-yellow-500/10 to-green-500/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/5 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-magenta-400/5 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* 3D Perspective Lines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-300/5 to-transparent transform perspective-1000 rotateX-12 animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Holographic Header */}
          <div className="bg-gradient-to-r from-gray-900/90 via-black/90 to-gray-900/90 backdrop-blur-xl rounded-[3rem] p-10 mb-10 border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 relative overflow-hidden">
            {/* Holographic Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -skew-x-12 transform translate-x-[-200%] animate-pulse" style={{ animation: 'holographicShimmer 3s ease-in-out infinite' }}></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-6">
                {invoice.company.logo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400 rounded-3xl blur-2xl opacity-60 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-magenta-400 to-yellow-400 rounded-3xl blur-xl opacity-40 animate-ping"></div>
                    <img src={invoice.company.logo} alt="Logo" className="relative h-20 w-auto rounded-3xl shadow-2xl border-2 border-cyan-400/50" />
                  </div>
                )}
                <div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-magenta-300 via-yellow-300 to-green-300 bg-clip-text text-transparent mb-4 animate-pulse">
                    {invoice.company.name}
                  </h1>
                  <div className="text-cyan-200 space-y-2 text-lg">
                    <p className="hover:text-cyan-100 transition-colors">{invoice.company.email}</p>
                    <p className="hover:text-cyan-100 transition-colors">{invoice.company.phone}</p>
                    <p className="whitespace-pre-line hover:text-cyan-100 transition-colors">{invoice.company.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-6">
                <div className="bg-gradient-to-br from-cyan-500 via-magenta-500 to-yellow-500 rounded-[2rem] p-8 shadow-2xl shadow-cyan-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse" style={{ animation: 'holographicShimmer 2s ease-in-out infinite' }}></div>
                  <h2 className="text-5xl font-bold text-white mb-4 relative z-10">INVOICE</h2>
                  <p className="text-cyan-100 text-2xl font-mono tracking-wider relative z-10">{invoice.number}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border-2 border-cyan-300/30 shadow-xl">
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

          {/* Holographic Client Section */}
          <div className="bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 mb-10 border-2 border-magenta-400/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-400/10 to-transparent -skew-x-12 transform translate-x-[-150%] animate-pulse" style={{ animation: 'holographicShimmer 4s ease-in-out infinite' }}></div>
            <h3 className="text-4xl font-bold text-magenta-200 mb-6 relative z-10">Bill To</h3>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border-2 border-magenta-300/30 relative z-10">
              <h4 className="text-3xl font-bold text-white mb-4">{invoice.client.name}</h4>
              <div className="text-magenta-200 space-y-2 text-lg">
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Holographic Items Table */}
          <div className="bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] overflow-hidden border-2 border-yellow-400/30 shadow-2xl mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse" style={{ animation: 'holographicShimmer 5s ease-in-out infinite' }}></div>
            <div className="bg-gradient-to-r from-cyan-500 via-magenta-500 via-yellow-500 to-green-500 p-8 relative z-10">
              <div className="grid grid-cols-12 gap-6 text-white font-bold text-xl">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            <div className="divide-y divide-cyan-400/20 relative z-10">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-6 p-8 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20">
                  <div className="col-span-6 font-semibold text-xl">{item.description}</div>
                  <div className="col-span-2 text-center text-cyan-200 text-xl">{item.quantity}</div>
                  <div className="col-span-2 text-center text-cyan-200 text-xl">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-xl">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Holographic Totals */}
          <div className="flex justify-end mb-10">
            <div className="bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 border-2 border-green-400/30 shadow-2xl min-w-[32rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse" style={{ animation: 'holographicShimmer 3s ease-in-out infinite' }}></div>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-cyan-200 text-xl">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-magenta-300 text-xl">
                    <span>Discount:</span>
                    <span className="font-semibold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-cyan-200 text-xl">
                    <span>Tax:</span>
                    <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-cyan-400/30 pt-6">
                  <div className="flex justify-between text-4xl font-bold text-white">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-cyan-300 via-magenta-300 via-yellow-300 to-green-300 bg-clip-text text-transparent animate-pulse">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Holographic Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 mb-10 border-2 border-cyan-400/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse" style={{ animation: 'holographicShimmer 4s ease-in-out infinite' }}></div>
              <h3 className="text-4xl font-bold text-cyan-200 mb-8 relative z-10">Holographic Payment Portal</h3>
              <div className="inline-block bg-white p-8 rounded-3xl shadow-2xl shadow-cyan-500/30 border-4 border-cyan-400/50 relative z-10">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-cyan-300 mt-6 text-xl relative z-10">{invoice.paymentInfo.method} Payment</p>
            </div>
          )}

          {/* Holographic Notes */}
          {invoice.notes && (
            <div className="bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl rounded-[3rem] p-10 border-2 border-yellow-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent -skew-x-12 transform translate-x-[-100%] animate-pulse" style={{ animation: 'holographicShimmer 6s ease-in-out infinite' }}></div>
              <h3 className="text-4xl font-bold text-yellow-200 mb-6 relative z-10">Holographic Notes</h3>
              <p className="text-yellow-100 whitespace-pre-line leading-relaxed text-xl relative z-10">{invoice.notes}</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes holographicGrid {
            0%, 100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
            25% { transform: perspective(1000px) rotateX(5deg) rotateY(2deg); }
            50% { transform: perspective(1000px) rotateX(0deg) rotateY(5deg); }
            75% { transform: perspective(1000px) rotateX(-5deg) rotateY(-2deg); }
          }
          @keyframes holographicShimmer {
            0% { transform: translateX(-200%) skewX(-12deg); }
            100% { transform: translateX(300%) skewX(-12deg); }
          }
        `}</style>
      </div>
    );
  }

  // CRYSTALLINE TEMPLATE - Stunning Crystal-Inspired Design
  if (invoice.template === 'crystalline') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 relative overflow-hidden">
        {/* Crystal Background Effects */}
        <div className="absolute inset-0">
          {/* Crystal Formations */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 transform rotate-45 rounded-lg backdrop-blur-sm border border-blue-300/30 animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 transform rotate-12 rounded-lg backdrop-blur-sm border border-purple-300/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-32 w-28 h-28 bg-gradient-to-br from-pink-400/20 to-rose-400/20 transform -rotate-12 rounded-lg backdrop-blur-sm border border-pink-300/30 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 transform rotate-45 rounded-lg backdrop-blur-sm border border-indigo-300/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Crystal Particles */}
          <div className="absolute top-32 left-1/3 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-60 shadow-lg shadow-blue-400/50"></div>
          <div className="absolute top-48 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-70 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-pink-400 rounded-full animate-pulse opacity-50 shadow-lg shadow-pink-400/50"></div>
          <div className="absolute bottom-48 right-1/3 w-3 h-3 bg-indigo-400 rounded-full animate-ping opacity-80 shadow-lg shadow-indigo-400/50" style={{ animationDelay: '1s' }}></div>
          
          {/* Crystal Refractions */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 via-pink-500/5 to-indigo-500/5 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/3 to-transparent transform rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-purple-400/3 to-transparent transform -rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Crystalline Header */}
          <div className="bg-gradient-to-r from-indigo-900/70 via-purple-900/70 to-pink-900/70 backdrop-blur-2xl rounded-[4rem] p-12 mb-12 border-4 border-blue-400/30 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            {/* Crystal Facets */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-[4rem]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform skew-x-12 animate-pulse"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-8">
                {invoice.company.logo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-[2rem] blur-3xl opacity-60 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-[2rem] blur-xl opacity-40"></div>
                    <img src={invoice.company.logo} alt="Logo" className="relative h-24 w-auto rounded-[2rem] shadow-2xl border-4 border-blue-400/50 backdrop-blur-sm" />
                  </div>
                )}
                <div>
                  <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
                    {invoice.company.name}
                  </h1>
                  <div className="text-blue-200 space-y-3 text-xl">
                    <p className="hover:text-blue-100 transition-colors">{invoice.company.email}</p>
                    <p className="hover:text-blue-100 transition-colors">{invoice.company.phone}</p>
                    <p className="whitespace-pre-line hover:text-blue-100 transition-colors">{invoice.company.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-8">
                <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[3rem] p-10 shadow-2xl shadow-blue-500/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-pulse"></div>
                  <h2 className="text-6xl font-bold text-white mb-6 relative z-10 drop-shadow-lg">INVOICE</h2>
                  <p className="text-blue-100 text-3xl font-mono tracking-wider relative z-10">{invoice.number}</p>
                </div>
                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border-4 border-blue-300/30 shadow-xl">
                  <div className="text-blue-200 space-y-4 text-xl">
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

          {/* Crystalline Client Section */}
          <div className="bg-gradient-to-r from-purple-900/70 via-pink-900/70 to-indigo-900/70 backdrop-blur-2xl rounded-[4rem] p-12 mb-12 border-4 border-purple-400/30 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-indigo-400/10 rounded-[4rem]"></div>
            <h3 className="text-5xl font-bold text-purple-200 mb-8 relative z-10">Bill To</h3>
            <div className="bg-white/15 backdrop-blur-lg rounded-[3rem] p-10 border-4 border-purple-300/30 relative z-10">
              <h4 className="text-4xl font-bold text-white mb-6">{invoice.client.name}</h4>
              <div className="text-purple-200 space-y-3 text-xl">
                <p>{invoice.client.email}</p>
                <p className="whitespace-pre-line">{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Crystalline Items Table */}
          <div className="bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-pink-900/70 backdrop-blur-2xl rounded-[4rem] overflow-hidden border-4 border-pink-400/30 shadow-2xl mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/5 via-purple-400/5 to-indigo-400/5 rounded-[4rem]"></div>
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-indigo-500 p-10 relative z-10">
              <div className="grid grid-cols-12 gap-8 text-white font-bold text-2xl">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
              </div>
            </div>
            <div className="divide-y divide-blue-400/20 relative z-10">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-8 p-10 text-white hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/20">
                  <div className="col-span-6 font-semibold text-2xl">{item.description}</div>
                  <div className="col-span-2 text-center text-blue-200 text-2xl">{item.quantity}</div>
                  <div className="col-span-2 text-center text-blue-200 text-2xl">{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold text-2xl">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Crystalline Totals */}
          <div className="flex justify-end mb-12">
            <div className="bg-gradient-to-br from-indigo-900/70 via-purple-900/70 to-pink-900/70 backdrop-blur-2xl rounded-[4rem] p-12 border-4 border-indigo-400/30 shadow-2xl min-w-[36rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 via-purple-400/10 to-pink-400/10 rounded-[4rem]"></div>
              <div className="space-y-8 relative z-10">
                <div className="flex justify-between text-blue-200 text-2xl">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-purple-300 text-2xl">
                    <span>Discount:</span>
                    <span className="font-semibold">-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-blue-200 text-2xl">
                    <span>Tax:</span>
                    <span className="font-semibold">{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-blue-400/30 pt-8">
                  <div className="flex justify-between text-5xl font-bold text-white">
                    <span>Total:</span>
                    <span className="bg-gradient-to-r from-blue-300 via-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-lg">
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Crystalline Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="bg-gradient-to-r from-purple-900/70 via-pink-900/70 to-indigo-900/70 backdrop-blur-2xl rounded-[4rem] p-12 mb-12 border-4 border-purple-400/30 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-indigo-400/10 rounded-[4rem]"></div>
              <h3 className="text-5xl font-bold text-purple-200 mb-10 relative z-10">Crystalline Payment Gateway</h3>
              <div className="inline-block bg-white p-10 rounded-[3rem] shadow-2xl shadow-purple-500/30 border-6 border-purple-400/50 relative z-10">
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-56 h-56 mx-auto" />
              </div>
              <p className="text-purple-300 mt-8 text-2xl relative z-10">{invoice.paymentInfo.method} Payment</p>
            </div>
          )}

          {/* Crystalline Notes */}
          {invoice.notes && (
            <div className="bg-gradient-to-r from-indigo-900/70 via-purple-900/70 to-pink-900/70 backdrop-blur-2xl rounded-[4rem] p-12 border-4 border-pink-400/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-indigo-400/10 rounded-[4rem]"></div>
              <h3 className="text-5xl font-bold text-pink-200 mb-8 relative z-10">Crystalline Notes</h3>
              <p className="text-pink-100 whitespace-pre-line leading-relaxed text-2xl relative z-10">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // NEON CYBERPUNK TEMPLATE - Futuristic Neon-Lit Design
  if (invoice.template === 'neon') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Neon Grid Background */}
        <div className="absolute inset-0">
          {/* Cyberpunk Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(rgba(255, 0, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 255, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 50px 50px, 50px 50px',
            animation: 'neonGrid 6s ease-in-out infinite'
          }}></div>
          
          {/* Neon Glows */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-magenta-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-40 left-32 w-56 h-56 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Neon Particles */}
          <div className="absolute top-32 left-1/3 w-6 h-6 bg-cyan-400 rounded-full animate-ping opacity-80 shadow-lg shadow-cyan-400/80" style={{ boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff' }}></div>
          <div className="absolute top-48 right-1/4 w-4 h-4 bg-magenta-400 rounded-full animate-bounce opacity-70 shadow-lg shadow-magenta-400/80" style={{ boxShadow: '0 0 20px #ff00ff, 0 0 40px #ff00ff' }}></div>
          <div className="absolute bottom-32 left-1/4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse opacity-60 shadow-lg shadow-yellow-400/80" style={{ boxShadow: '0 0 20px #ffff00, 0 0 40px #ffff00, 0 0 60px #ffff00' }}></div>
          <div className="absolute bottom-48 right-1/3 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-90 shadow-lg shadow-green-400/80" style={{ boxShadow: '0 0 20px #00ff00, 0 0 40px #00ff00' }}></div>
          
          {/* Neon Scanlines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse" style={{ animation: 'neonScanline 3s linear infinite' }}></div>
        </div>

        <div className="relative z-10 p-12">
          {/* Neon Header */}
          <div className="bg-black/90 backdrop-blur-xl rounded-none p-12 mb-12 border-4 border-cyan-400 shadow-2xl relative overflow-hidden" style={{ 
            boxShadow: '0 0 30px #00ffff, inset 0 0 30px rgba(0, 255, 255, 0.1)',
            clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
          }}>
            {/* Neon Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-magenta-500/10 to-yellow-500/10 animate-pulse"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-8">
                {invoice.company.logo && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400 rounded-none blur-2xl opacity-60 animate-pulse" style={{ boxShadow: '0 0 40px #00ffff, 0 0 80px #00ffff' }}></div>
                    <img src={invoice.company.logo} alt="Logo" className="relative h-24 w-auto rounded-none shadow-2xl border-4 border-cyan-400" style={{ boxShadow: '0 0 20px #00ffff' }} />
                  </div>
                )}
                <div>
                  <h1 className="text-8xl font-bold text-cyan-400 mb-6 animate-pulse" style={{ 
                    textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 80px #00ffff',
                    fontFamily: 'monospace'
                  }}>
                    {invoice.company.name}
                  </h1>
                  <div className="text-cyan-300 space-y-3 text-xl font-mono">
                    <p className="hover:text-cyan-100 transition-colors" style={{ textShadow: '0 0 5px #00ffff' }}>{invoice.company.email}</p>
                    <p className="hover:text-cyan-100 transition-colors" style={{ textShadow: '0 0 5px #00ffff' }}>{invoice.company.phone}</p>
                    <p className="whitespace-pre-line hover:text-cyan-100 transition-colors" style={{ textShadow: '0 0 5px #00ffff' }}>{invoice.company.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-right space-y-8">
                <div className="bg-black border-4 border-magenta-400 rounded-none p-10 shadow-2xl relative overflow-hidden" style={{ 
                  boxShadow: '0 0 30px #ff00ff, inset 0 0 30px rgba(255, 0, 255, 0.1)',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}>
                  <h2 className="text-7xl font-bold text-magenta-400 mb-6 font-mono animate-pulse" style={{ textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff' }}>INVOICE</h2>
                  <p className="text-magenta-300 text-3xl font-mono tracking-wider" style={{ textShadow: '0 0 5px #ff00ff' }}>{invoice.number}</p>
                </div>
                <div className="bg-black/80 backdrop-blur-lg rounded-none p-8 border-4 border-yellow-400 shadow-xl" style={{ 
                  boxShadow: '0 0 20px #ffff00',
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <div className="text-yellow-300 space-y-4 text-xl font-mono">
                    <div className="flex justify-between items-center">
                      <span style={{ textShadow: '0 0 5px #ffff00' }}>Issue Date:</span>
                      <span className="text-yellow-100 font-semibold" style={{ textShadow: '0 0 5px #ffff00' }}>{formatDate(invoice.issueDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ textShadow: '0 0 5px #ffff00' }}>Due Date:</span>
                      <span className="text-yellow-100 font-semibold" style={{ textShadow: '0 0 5px #ffff00' }}>{formatDate(invoice.dueDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neon Client Section */}
          <div className="bg-black/90 backdrop-blur-xl rounded-none p-12 mb-12 border-4 border-green-400 shadow-xl relative overflow-hidden" style={{ 
            boxShadow: '0 0 30px #00ff00, inset 0 0 30px rgba(0, 255, 0, 0.1)',
            clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))'
          }}>
            <h3 className="text-6xl font-bold text-green-400 mb-8 font-mono animate-pulse" style={{ textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00' }}>BILL TO</h3>
            <div className="bg-black/80 backdrop-blur-lg rounded-none p-10 border-4 border-green-300 relative" style={{ 
              boxShadow: '0 0 15px #00ff00',
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
            }}>
              <h4 className="text-5xl font-bold text-green-100 mb-6 font-mono" style={{ textShadow: '0 0 10px #00ff00' }}>{invoice.client.name}</h4>
              <div className="text-green-300 space-y-3 text-xl font-mono">
                <p style={{ textShadow: '0 0 5px #00ff00' }}>{invoice.client.email}</p>
                <p className="whitespace-pre-line" style={{ textShadow: '0 0 5px #00ff00' }}>{invoice.client.address}</p>
              </div>
            </div>
          </div>

          {/* Neon Items Table */}
          <div className="bg-black/90 backdrop-blur-xl rounded-none overflow-hidden border-4 border-yellow-400 shadow-2xl mb-12 relative" style={{ 
            boxShadow: '0 0 30px #ffff00, inset 0 0 30px rgba(255, 255, 0, 0.1)',
            clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
          }}>
            <div className="bg-black border-b-4 border-yellow-400 p-10">
              <div className="grid grid-cols-12 gap-8 text-yellow-400 font-bold text-2xl font-mono">
                <div className="col-span-6" style={{ textShadow: '0 0 10px #ffff00' }}>DESCRIPTION</div>
                <div className="col-span-2 text-center" style={{ textShadow: '0 0 10px #ffff00' }}>QTY</div>
                <div className="col-span-2 text-center" style={{ textShadow: '0 0 10px #ffff00' }}>RATE</div>
                <div className="col-span-2 text-right" style={{ textShadow: '0 0 10px #ffff00' }}>AMOUNT</div>
              </div>
            </div>
            <div className="divide-y divide-cyan-400/30">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-8 p-10 text-cyan-300 hover:bg-cyan-500/10 transition-all duration-300 font-mono text-xl">
                  <div className="col-span-6 font-semibold" style={{ textShadow: '0 0 5px #00ffff' }}>{item.description}</div>
                  <div className="col-span-2 text-center" style={{ textShadow: '0 0 5px #00ffff' }}>{item.quantity}</div>
                  <div className="col-span-2 text-center" style={{ textShadow: '0 0 5px #00ffff' }}>{currencySymbol}{item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-right font-bold" style={{ textShadow: '0 0 5px #00ffff' }}>{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Neon Totals */}
          <div className="flex justify-end mb-12">
            <div className="bg-black/90 backdrop-blur-xl rounded-none p-12 border-4 border-magenta-400 shadow-2xl min-w-[40rem] relative overflow-hidden" style={{ 
              boxShadow: '0 0 30px #ff00ff, inset 0 0 30px rgba(255, 0, 255, 0.1)',
              clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))'
            }}>
              <div className="space-y-8 font-mono">
                <div className="flex justify-between text-cyan-300 text-2xl">
                  <span style={{ textShadow: '0 0 5px #00ffff' }}>SUBTOTAL:</span>
                  <span className="font-semibold" style={{ textShadow: '0 0 5px #00ffff' }}>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discountAmount > 0 && (
                  <div className="flex justify-between text-yellow-300 text-2xl">
                    <span style={{ textShadow: '0 0 5px #ffff00' }}>DISCOUNT:</span>
                    <span className="font-semibold" style={{ textShadow: '0 0 5px #ffff00' }}>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {totals.taxAmount > 0 && (
                  <div className="flex justify-between text-cyan-300 text-2xl">
                    <span style={{ textShadow: '0 0 5px #00ffff' }}>TAX:</span>
                    <span className="font-semibold" style={{ textShadow: '0 0 5px #00ffff' }}>{currencySymbol}{totals.taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-magenta-400/50 pt-8">
                  <div className="flex justify-between text-6xl font-bold text-magenta-400 animate-pulse">
                    <span style={{ textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff' }}>TOTAL:</span>
                    <span style={{ textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff' }}>
                      {currencySymbol}{totals.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neon Payment QR */}
          {invoice.paymentInfo?.qrCode && (
            <div className="bg-black/90 backdrop-blur-xl rounded-none p-12 mb-12 border-4 border-green-400 text-center relative overflow-hidden" style={{ 
              boxShadow: '0 0 30px #00ff00, inset 0 0 30px rgba(0, 255, 0, 0.1)',
              clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
            }}>
              <h3 className="text-6xl font-bold text-green-400 mb-10 font-mono animate-pulse" style={{ textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00' }}>PAYMENT PORTAL</h3>
              <div className="inline-block bg-white p-10 rounded-none shadow-2xl border-6 border-green-400" style={{ boxShadow: '0 0 30px #00ff00' }}>
                <img src={invoice.paymentInfo.qrCode} alt="Payment QR" className="w-64 h-64 mx-auto" />
              </div>
              <p className="text-green-300 mt-8 text-2xl font-mono" style={{ textShadow: '0 0 5px #00ff00' }}>{invoice.paymentInfo.method} PAYMENT</p>
            </div>
          )}

          {/* Neon Notes */}
          {invoice.notes && (
            <div className="bg-black/90 backdrop-blur-xl rounded-none p-12 border-4 border-cyan-400 relative overflow-hidden" style={{ 
              boxShadow: '0 0 30px #00ffff, inset 0 0 30px rgba(0, 255, 255, 0.1)',
              clipPath: 'polygon(0 0, calc(100% - 25px) 0, 100% 25px, 100% 100%, 25px 100%, 0 calc(100% - 25px))'
            }}>
              <h3 className="text-6xl font-bold text-cyan-400 mb-8 font-mono animate-pulse" style={{ textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff' }}>NOTES</h3>
              <p className="text-cyan-100 whitespace-pre-line leading-relaxed text-2xl font-mono" style={{ textShadow: '0 0 5px #00ffff' }}>{invoice.notes}</p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes neonGrid {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes neonScanline {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
        `}</style>
      </div>
    );
  }

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