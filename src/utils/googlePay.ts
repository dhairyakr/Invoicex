export interface GooglePayConfig {
  merchantId: string;
  merchantName: string;
  environment: 'TEST' | 'PRODUCTION';
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  reference: string;
  merchantInfo: {
    name: string;
    id: string;
  };
}

// Google Pay UPI Payment URL Generator
export const generateGooglePayUPI = (paymentRequest: PaymentRequest): string => {
  const { amount, currency, description, reference, merchantInfo } = paymentRequest;
  
  // UPI Payment URL format for Google Pay
  const upiParams = new URLSearchParams({
    pa: 'your-upi-id@bank', // Replace with your UPI ID
    pn: merchantInfo.name,
    am: amount.toString(),
    cu: currency,
    tn: `${description} - ${reference}`,
    tr: reference,
  });

  return `upi://pay?${upiParams.toString()}`;
};

// Google Pay Web Payment Request
export const createGooglePayRequest = (paymentRequest: PaymentRequest) => {
  const { amount, currency, merchantInfo } = paymentRequest;

  return {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA', 'AMEX']
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example', // Replace with your payment gateway
            gatewayMerchantId: merchantInfo.id
          }
        }
      },
      {
        type: 'UPI',
        parameters: {
          payeeVpa: 'your-upi-id@bank', // Replace with your UPI ID
          payeeName: merchantInfo.name,
          referenceUrl: window.location.origin,
          mcc: '5411', // Merchant Category Code
          tr: paymentRequest.reference,
        }
      }
    ],
    merchantInfo: {
      merchantId: merchantInfo.id,
      merchantName: merchantInfo.name
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: amount.toString(),
      currencyCode: currency,
      countryCode: 'IN' // Change based on your country
    }
  };
};

// Generate Google Pay QR Code Data
export const generateGooglePayQRData = (paymentRequest: PaymentRequest): string => {
  // For UPI-based payments (India)
  if (paymentRequest.currency === 'INR') {
    return generateGooglePayUPI(paymentRequest);
  }
  
  // For other currencies, create a payment link
  const paymentData = {
    amount: paymentRequest.amount,
    currency: paymentRequest.currency,
    description: paymentRequest.description,
    reference: paymentRequest.reference,
    merchant: paymentRequest.merchantInfo.name,
  };
  
  // Create a payment URL (you can customize this based on your payment processor)
  const paymentUrl = `${window.location.origin}/pay?${new URLSearchParams({
    amount: paymentData.amount.toString(),
    currency: paymentData.currency,
    ref: paymentData.reference,
    merchant: paymentData.merchant,
  }).toString()}`;
  
  return paymentUrl;
};

// Initialize Google Pay API
export const initializeGooglePay = async (config: GooglePayConfig): Promise<google.payments.api.PaymentsClient | null> => {
  if (typeof google === 'undefined' || !google.payments) {
    console.error('Google Pay API not loaded');
    return null;
  }

  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: config.environment,
    merchantInfo: {
      merchantId: config.merchantId,
      merchantName: config.merchantName,
    },
  });

  return paymentsClient;
};

// Check if Google Pay is available
export const isGooglePayAvailable = async (
  paymentsClient: google.payments.api.PaymentsClient,
  paymentRequest: any
): Promise<boolean> => {
  try {
    const isReadyToPayRequest = {
      apiVersion: paymentRequest.apiVersion,
      apiVersionMinor: paymentRequest.apiVersionMinor,
      allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
    };

    const response = await paymentsClient.isReadyToPay(isReadyToPayRequest);
    return response.result;
  } catch (error) {
    console.error('Error checking Google Pay availability:', error);
    return false;
  }
};

// Process Google Pay payment
export const processGooglePayPayment = async (
  paymentsClient: google.payments.api.PaymentsClient,
  paymentRequest: any
): Promise<google.payments.api.PaymentData | null> => {
  try {
    const paymentData = await paymentsClient.loadPaymentData(paymentRequest);
    return paymentData;
  } catch (error) {
    console.error('Error processing Google Pay payment:', error);
    return null;
  }
};