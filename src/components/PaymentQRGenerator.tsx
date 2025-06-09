import React, { useState } from 'react';
import { QrCode, CreditCard, Smartphone, DollarSign, Globe } from 'lucide-react';
import { generateMultiProviderQR } from '../utils/qrCode';

interface PaymentQRGeneratorProps {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  onQRGenerated: (qrCode: string, provider: string) => void;
}

const PaymentQRGenerator: React.FC<PaymentQRGeneratorProps> = ({
  amount,
  currency,
  recipient,
  reference,
  onQRGenerated,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'googlepay' | 'upi' | 'paypal' | 'stripe' | 'generic'>('googlepay');
  const [isGenerating, setIsGenerating] = useState(false);
  const [merchantConfig, setMerchantConfig] = useState({
    merchantId: '',
    upiId: '',
    paypalMerchantId: '',
    stripePaymentLinkId: '',
  });

  const paymentProviders = [
    {
      id: 'googlepay' as const,
      name: 'Google Pay',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'UPI & Card payments via Google Pay',
      configField: 'merchantId',
      placeholder: 'Enter Merchant ID',
      supported: ['INR', 'USD', 'EUR', 'GBP'],
    },
    {
      id: 'upi' as const,
      name: 'UPI Direct',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Direct UPI payments (India only)',
      configField: 'upiId',
      placeholder: 'Enter UPI ID (e.g., merchant@paytm)',
      supported: ['INR'],
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      icon: <DollarSign className="w-5 h-5" />,
      description: 'PayPal.me payment links',
      configField: 'paypalMerchantId',
      placeholder: 'Enter PayPal username',
      supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    },
    {
      id: 'stripe' as const,
      name: 'Stripe',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Stripe payment links',
      configField: 'stripePaymentLinkId',
      placeholder: 'Enter Stripe Payment Link ID',
      supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
    },
    {
      id: 'generic' as const,
      name: 'Generic',
      icon: <Globe className="w-5 h-5" />,
      description: 'Basic payment information QR',
      configField: '',
      placeholder: '',
      supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'],
    },
  ];

  const selectedProviderInfo = paymentProviders.find(p => p.id === selectedProvider);
  const isCurrencySupported = selectedProviderInfo?.supported.includes(currency) ?? false;

  const handleGenerateQR = async () => {
    if (!isCurrencySupported) {
      alert(`${selectedProviderInfo?.name} doesn't support ${currency} currency`);
      return;
    }

    setIsGenerating(true);
    try {
      const qrCode = await generateMultiProviderQR(selectedProvider, {
        amount,
        currency,
        recipient,
        reference,
        merchantId: merchantConfig.merchantId || undefined,
        upiId: merchantConfig.upiId || undefined,
        paypalMerchantId: merchantConfig.paypalMerchantId || undefined,
        stripePaymentLinkId: merchantConfig.stripePaymentLinkId || undefined,
      });

      onQRGenerated(qrCode, selectedProvider);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please check your configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMerchantConfig = (field: string, value: string) => {
    setMerchantConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Provider
        </label>
        <div className="grid grid-cols-1 gap-2">
          {paymentProviders.map((provider) => (
            <div
              key={provider.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedProvider === provider.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProvider(provider.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  selectedProvider === provider.id ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {provider.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{provider.name}</h3>
                    {!provider.supported.includes(currency) && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                        Not supported for {currency}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{provider.description}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    Supports: {provider.supported.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProviderInfo?.configField && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Configuration
          </label>
          <input
            type="text"
            value={merchantConfig[selectedProviderInfo.configField as keyof typeof merchantConfig]}
            onChange={(e) => updateMerchantConfig(selectedProviderInfo.configField, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={selectedProviderInfo.placeholder}
          />
          
          {selectedProvider === 'googlepay' && (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Google Pay Setup:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Get your Merchant ID from Google Pay Business Console</li>
                <li>• For UPI: Use your UPI ID (e.g., merchant@paytm)</li>
                <li>• For cards: Configure payment gateway integration</li>
              </ul>
            </div>
          )}
          
          {selectedProvider === 'upi' && (
            <div className="mt-2 p-3 bg-green-50 rounded-md">
              <h4 className="font-medium text-green-900 mb-2">UPI Setup:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Use your UPI ID (e.g., yourname@paytm)</li>
                <li>• Only works for INR currency</li>
                <li>• Compatible with all UPI apps</li>
              </ul>
            </div>
          )}
          
          {selectedProvider === 'paypal' && (
            <div className="mt-2 p-3 bg-purple-50 rounded-md">
              <h4 className="font-medium text-purple-900 mb-2">PayPal Setup:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Use your PayPal.me username</li>
                <li>• Enable PayPal.me in your PayPal account</li>
                <li>• Works internationally</li>
              </ul>
            </div>
          )}
          
          {selectedProvider === 'stripe' && (
            <div className="mt-2 p-3 bg-indigo-50 rounded-md">
              <h4 className="font-medium text-indigo-900 mb-2">Stripe Setup:</h4>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>• Create a Payment Link in Stripe Dashboard</li>
                <li>• Copy the Payment Link ID from the URL</li>
                <li>• Supports cards and local payment methods</li>
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Amount:</span>
            <span className="ml-2 font-medium">{currency} {amount.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Reference:</span>
            <span className="ml-2 font-medium">{reference}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Recipient:</span>
            <span className="ml-2 font-medium">{recipient}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerateQR}
        disabled={isGenerating || !isCurrencySupported || (selectedProviderInfo?.configField && !merchantConfig[selectedProviderInfo.configField as keyof typeof merchantConfig])}
        className={`w-full px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center ${
          isGenerating || !isCurrencySupported || (selectedProviderInfo?.configField && !merchantConfig[selectedProviderInfo.configField as keyof typeof merchantConfig])
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating QR Code...
          </>
        ) : (
          <>
            <QrCode className="w-4 h-4 mr-2" />
            Generate {selectedProviderInfo?.name} QR Code
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentQRGenerator;