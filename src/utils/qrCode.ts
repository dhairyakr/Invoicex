import QRCode from 'qrcode';
import { generateGooglePayQRData, PaymentRequest } from './googlePay';

export const generateQRCode = async (text: string): Promise<string> => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

export const generatePaymentQR = async (paymentInfo: {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
}): Promise<string> => {
  const paymentText = `Payment: ${paymentInfo.currency} ${paymentInfo.amount.toFixed(2)} to ${paymentInfo.recipient} - Ref: ${paymentInfo.reference}`;
  return generateQRCode(paymentText);
};

// Generate Google Pay QR Code
export const generateGooglePayQR = async (paymentInfo: {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  merchantId?: string;
}): Promise<string> => {
  const paymentRequest: PaymentRequest = {
    amount: paymentInfo.amount,
    currency: paymentInfo.currency,
    description: `Invoice Payment`,
    reference: paymentInfo.reference,
    merchantInfo: {
      name: paymentInfo.recipient,
      id: paymentInfo.merchantId || 'default-merchant-id',
    },
  };

  const googlePayData = generateGooglePayQRData(paymentRequest);
  return generateQRCode(googlePayData);
};

// Generate UPI QR Code (for Indian payments)
export const generateUPIQR = async (paymentInfo: {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  upiId: string;
}): Promise<string> => {
  if (paymentInfo.currency !== 'INR') {
    throw new Error('UPI payments are only supported for INR currency');
  }

  const upiParams = new URLSearchParams({
    pa: paymentInfo.upiId, // Payee UPI ID
    pn: paymentInfo.recipient, // Payee Name
    am: paymentInfo.amount.toString(), // Amount
    cu: paymentInfo.currency, // Currency
    tn: `Invoice ${paymentInfo.reference}`, // Transaction Note
    tr: paymentInfo.reference, // Transaction Reference
  });

  const upiUrl = `upi://pay?${upiParams.toString()}`;
  return generateQRCode(upiUrl);
};

// Generate PayPal QR Code
export const generatePayPalQR = async (paymentInfo: {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  paypalMerchantId?: string;
}): Promise<string> => {
  const paypalUrl = `https://www.paypal.com/paypalme/${paymentInfo.paypalMerchantId || 'your-paypal-username'}/${paymentInfo.amount}${paymentInfo.currency}`;
  return generateQRCode(paypalUrl);
};

// Generate Stripe Payment Link QR
export const generateStripeQR = async (paymentInfo: {
  amount: number;
  currency: string;
  recipient: string;
  reference: string;
  stripePaymentLinkId?: string;
}): Promise<string> => {
  const stripeUrl = `https://buy.stripe.com/${paymentInfo.stripePaymentLinkId || 'your-payment-link-id'}`;
  return generateQRCode(stripeUrl);
};

// Multi-provider QR generator
export const generateMultiProviderQR = async (
  provider: 'googlepay' | 'upi' | 'paypal' | 'stripe' | 'generic',
  paymentInfo: {
    amount: number;
    currency: string;
    recipient: string;
    reference: string;
    merchantId?: string;
    upiId?: string;
    paypalMerchantId?: string;
    stripePaymentLinkId?: string;
  }
): Promise<string> => {
  switch (provider) {
    case 'googlepay':
      return generateGooglePayQR(paymentInfo);
    
    case 'upi':
      if (!paymentInfo.upiId) {
        throw new Error('UPI ID is required for UPI payments');
      }
      return generateUPIQR({
        ...paymentInfo,
        upiId: paymentInfo.upiId,
      });
    
    case 'paypal':
      return generatePayPalQR(paymentInfo);
    
    case 'stripe':
      return generateStripeQR(paymentInfo);
    
    case 'generic':
    default:
      return generatePaymentQR(paymentInfo);
  }
};