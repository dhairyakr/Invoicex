import QRCode from 'qrcode';

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