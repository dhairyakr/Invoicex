import React from 'react';
import { Invoice } from '../types';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const getFontFamily = (font: string) => {
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
    return fontMap[font] || 'Inter, sans-serif';
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

  const getCurrencySymbol = () => {
    const currencies = {
      USD: '$', EUR: '€', GBP: '£', CAD: 'C$', 
      AUD: 'A$', JPY: '¥', INR: '₹'
    };
    return currencies[invoice.currency as keyof typeof currencies] || '$';
  };

  const totals = calculateTotals();
  const currencySymbol = getCurrencySymbol();

  // Crystalline Template
  const CrystallineTemplate = () => (
    <div 
      className="bg-white p-12 min-h-[297mm] relative overflow-hidden"
      style={{ 
        fontFamily: getFontFamily(invoice.font),
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
      }}
    >
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
          <defs>
            <pattern id="crystalline-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,0 20,10 10,20 0,10" fill="currentColor" opacity="0.1"/>
              <polygon points="5,5 15,5 15,15 5,15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crystalline-pattern)" style={{ color: invoice.accentColor }}/>
        </svg>
      </div>

      {/* Prismatic Header */}
      <div className="relative mb-12">
        <div 
          className="absolute inset-0 rounded-2xl opacity-10"
          style={{
            background: `linear-gradient(135deg, ${invoice.accentColor}20, transparent 50%, ${invoice.accentColor}10)`
          }}
        />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {invoice.company.logo && (
                <img 
                  src={invoice.company.logo} 
                  alt="Company Logo" 
                  className="h-16 w-auto mb-6 rounded-lg shadow-md"
                />
              )}
              <h1 className="text-5xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                {invoice.company.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div 
                className="inline-block px-6 py-3 rounded-xl text-white font-bold text-2xl mb-4 shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}dd)`
                }}
              >
                INVOICE
              </div>
              <div className="space-y-2 text-right">
                <p className="text-lg font-semibold text-gray-800">#{invoice.number}</p>
                <p className="text-gray-600">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information with Geometric Design */}
      <div className="mb-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md relative">
          <div 
            className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
            style={{ backgroundColor: invoice.accentColor }}
          />
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Bill To:</h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-semibold text-lg">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
      </div>

      {/* Items Table with Crystal-like Design */}
      <div className="mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-200/50">
          <div 
            className="px-6 py-4 text-white font-semibold"
            style={{ 
              background: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}dd)`
            }}
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {invoice.items.map((item, index) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <p className="font-medium text-gray-800">{item.description}</p>
                  </div>
                  <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                  <div className="col-span-2 text-center text-gray-600">
                    {currencySymbol}{item.rate.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right font-semibold text-gray-800">
                    {currencySymbol}{(item.quantity * item.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals with Prismatic Effect */}
      <div className="flex justify-end mb-12">
        <div className="w-80">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {invoice.taxRates.map((tax) => (
                <div key={tax.id} className="flex justify-between text-gray-700">
                  <span>{tax.name} ({tax.rate}%):</span>
                  <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                </div>
              ))}
              
              <div 
                className="border-t pt-3 flex justify-between text-white font-bold text-lg px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: invoice.accentColor,
                  borderTopColor: `${invoice.accentColor}40`
                }}
              >
                <span>Total:</span>
                <span>{currencySymbol}{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="mb-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50 inline-block">
            <h4 className="font-semibold mb-4 text-gray-800">Payment QR Code</h4>
            <img 
              src={invoice.paymentInfo.qrCode} 
              alt="Payment QR Code" 
              className="w-32 h-32 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.method}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-md">
            <h4 className="font-semibold mb-3 text-gray-800">Notes:</h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      {invoice.showFooter && (
        <div className="text-center text-gray-500 text-sm">
          <p>Generated with Invoice Beautifier - Professional Invoice Solutions</p>
        </div>
      )}
    </div>
  );

  // Aurora Template
  const AuroraTemplate = () => (
    <div 
      className="bg-white p-12 min-h-[297mm] relative overflow-hidden"
      style={{ 
        fontFamily: getFontFamily(invoice.font),
        background: 'radial-gradient(ellipse at top, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)'
      }}
    >
      {/* Aurora Background Effect */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-full h-32 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(90deg, ${invoice.accentColor}40, transparent, ${invoice.accentColor}20, transparent, ${invoice.accentColor}30)`
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-full h-40 rounded-full blur-3xl"
          style={{
            background: `linear-gradient(270deg, ${invoice.accentColor}30, transparent, ${invoice.accentColor}40, transparent)`
          }}
        />
      </div>

      {/* Flowing Header */}
      <div className="relative mb-12">
        <div 
          className="absolute inset-0 rounded-3xl opacity-20 blur-sm"
          style={{
            background: `linear-gradient(135deg, ${invoice.accentColor}40, transparent 30%, ${invoice.accentColor}20 70%, transparent)`
          }}
        />
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {invoice.company.logo && (
                <img 
                  src={invoice.company.logo} 
                  alt="Company Logo" 
                  className="h-16 w-auto mb-6 rounded-xl shadow-lg"
                />
              )}
              <h1 
                className="text-5xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent"
                style={{ 
                  backgroundImage: `linear-gradient(135deg, ${invoice.accentColor}, ${invoice.accentColor}80, ${invoice.accentColor})`
                }}
              >
                {invoice.company.name}
              </h1>
              <div className="space-y-1 text-gray-600">
                <p>{invoice.company.email}</p>
                <p>{invoice.company.phone}</p>
                <p className="whitespace-pre-line">{invoice.company.address}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div 
                className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-2xl mb-4 shadow-xl relative overflow-hidden"
                style={{ backgroundColor: invoice.accentColor }}
              >
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)`
                  }}
                />
                <span className="relative">INVOICE</span>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-xl font-bold text-gray-800">#{invoice.number}</p>
                <p className="text-gray-600">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Information with Aurora Flow */}
      <div className="mb-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full h-2 rounded-t-2xl"
            style={{
              background: `linear-gradient(90deg, ${invoice.accentColor}, ${invoice.accentColor}60, ${invoice.accentColor})`
            }}
          />
          <h3 className="text-lg font-semibold mb-4 text-gray-800 mt-2">Bill To:</h3>
          <div className="space-y-1 text-gray-700">
            <p className="font-bold text-xl">{invoice.client.name}</p>
            <p>{invoice.client.email}</p>
            <p className="whitespace-pre-line">{invoice.client.address}</p>
          </div>
        </div>
      </div>

      {/* Items Table with Flowing Design */}
      <div className="mb-12">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-white/50">
          <div 
            className="px-6 py-4 text-white font-semibold relative overflow-hidden"
            style={{ backgroundColor: invoice.accentColor }}
          >
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, transparent 20%, white 50%, transparent 80%)`
              }}
            />
            <div className="relative grid grid-cols-12 gap-4">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/30">
            {invoice.items.map((item, index) => (
              <div 
                key={item.id} 
                className="px-6 py-4 hover:bg-gradient-to-r hover:from-transparent hover:to-gray-50/50 transition-all duration-300"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-6">
                    <p className="font-medium text-gray-800">{item.description}</p>
                  </div>
                  <div className="col-span-2 text-center text-gray-600">{item.quantity}</div>
                  <div className="col-span-2 text-center text-gray-600">
                    {currencySymbol}{item.rate.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right font-semibold text-gray-800">
                    {currencySymbol}{(item.quantity * item.rate).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Totals with Aurora Effect */}
      <div className="flex justify-end mb-12">
        <div className="w-80">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 relative overflow-hidden">
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-xl"
              style={{ backgroundColor: invoice.accentColor }}
            />
            <div className="relative space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{currencySymbol}{totals.subtotal.toFixed(2)}</span>
              </div>
              
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-{currencySymbol}{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {invoice.taxRates.map((tax) => (
                <div key={tax.id} className="flex justify-between text-gray-700">
                  <span>{tax.name} ({tax.rate}%):</span>
                  <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                </div>
              ))}
              
              <div 
                className="border-t pt-3 flex justify-between text-white font-bold text-lg px-4 py-3 rounded-xl relative overflow-hidden"
                style={{ backgroundColor: invoice.accentColor }}
              >
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `linear-gradient(135deg, transparent 30%, white 50%, transparent 70%)`
                  }}
                />
                <span className="relative">Total:</span>
                <span className="relative">{currencySymbol}{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment QR Code */}
      {invoice.paymentInfo?.qrCode && (
        <div className="mb-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50 inline-block">
            <h4 className="font-semibold mb-4 text-gray-800">Payment QR Code</h4>
            <img 
              src={invoice.paymentInfo.qrCode} 
              alt="Payment QR Code" 
              className="w-32 h-32 mx-auto rounded-xl shadow-lg"
            />
            <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.method}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <h4 className="font-semibold mb-3 text-gray-800">Notes:</h4>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{invoice.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      {invoice.showFooter && (
        <div className="text-center text-gray-500 text-sm">
          <p>Generated with Invoice Beautifier - Professional Invoice Solutions</p>
        </div>
      )}
    </div>
  );

  // Template Selection
  const renderTemplate = () => {
    switch (invoice.template) {
      case 'crystalline':
        return <CrystallineTemplate />;
      case 'aurora':
        return <AuroraTemplate />;
      default:
        // Default elegant template for other cases
        return (
          <div 
            className="bg-white p-12 min-h-[297mm]"
            style={{ fontFamily: getFontFamily(invoice.font) }}
          >
            {/* Default template content */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  {invoice.company.logo && (
                    <img 
                      src={invoice.company.logo} 
                      alt="Company Logo" 
                      className="h-16 w-auto mb-4"
                    />
                  )}
                  <h1 className="text-3xl font-bold mb-2" style={{ color: invoice.accentColor }}>
                    {invoice.company.name}
                  </h1>
                  <div className="text-gray-600 space-y-1">
                    <p>{invoice.company.email}</p>
                    <p>{invoice.company.phone}</p>
                    <p className="whitespace-pre-line">{invoice.company.address}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-4" style={{ color: invoice.accentColor }}>
                    INVOICE
                  </h2>
                  <div className="space-y-1 text-gray-600">
                    <p className="font-semibold">#{invoice.number}</p>
                    <p>Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                    <p>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-semibold">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p className="whitespace-pre-line">{invoice.client.address}</p>
                </div>
              </div>

              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2" style={{ borderColor: invoice.accentColor }}>
                      <th className="text-left py-2">Description</th>
                      <th className="text-center py-2">Qty</th>
                      <th className="text-center py-2">Rate</th>
                      <th className="text-right py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2">{item.description}</td>
                        <td className="text-center py-2">{item.quantity}</td>
                        <td className="text-center py-2">{currencySymbol}{item.rate.toFixed(2)}</td>
                        <td className="text-right py-2">{currencySymbol}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mb-8">
                <div className="w-64">
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
                    
                    {invoice.taxRates.map((tax) => (
                      <div key={tax.id} className="flex justify-between">
                        <span>{tax.name} ({tax.rate}%):</span>
                        <span>{currencySymbol}{((totals.subtotal - totals.discountAmount) * tax.rate / 100).toFixed(2)}</span>
                      </div>
                    ))}
                    
                    <div 
                      className="border-t-2 pt-2 flex justify-between font-bold text-lg"
                      style={{ borderColor: invoice.accentColor }}
                    >
                      <span>Total:</span>
                      <span>{currencySymbol}{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {invoice.paymentInfo?.qrCode && (
                <div className="mb-8 text-center">
                  <h4 className="font-semibold mb-2">Payment QR Code</h4>
                  <img 
                    src={invoice.paymentInfo.qrCode} 
                    alt="Payment QR Code" 
                    className="w-32 h-32 mx-auto"
                  />
                  <p className="text-sm text-gray-600 mt-2">{invoice.paymentInfo.method}</p>
                </div>
              )}

              {invoice.notes && (
                <div className="mb-8">
                  <h4 className="font-semibold mb-2">Notes:</h4>
                  <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}

              {invoice.showFooter && (
                <div className="text-center text-gray-500 text-sm">
                  <p>Generated with Invoice Beautifier</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return renderTemplate();
};

export default InvoicePreview;