import { exportToPDF } from './pdfExport';

export const sendEmailInvoice = async (invoice: any, recipientEmail: string) => {
  try {
    // Calculate total for display
    const subtotal = invoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
    let discountAmount = 0;
    if (invoice.discountValue > 0) {
      discountAmount = invoice.discountType === 'percentage' 
        ? (subtotal * invoice.discountValue) / 100 
        : invoice.discountValue;
    }
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (invoice.taxRates || []).reduce((sum: number, tax: any) => sum + (afterDiscount * tax.rate) / 100, 0);
    const total = afterDiscount + taxAmount;

    // Generate and download PDF first
    const fileName = `invoice-${invoice.number}.pdf`;
    await exportToPDF('invoice-preview', fileName);
    
    const subject = `Invoice ${invoice.number} from ${invoice.company.name}`;
    const body = `Dear ${invoice.client.name},

Please find attached your invoice ${invoice.number}.

Invoice Details:
- Invoice Number: ${invoice.number}
- Amount: ${invoice.currency} ${total.toFixed(2)}
- Issue Date: ${invoice.issueDate}
- Due Date: ${invoice.dueDate}

${invoice.notes ? `Notes: ${invoice.notes}` : ''}

Best regards,
${invoice.company.name}
${invoice.company.email}
${invoice.company.phone}

---
This invoice was generated using Invoice Beautifier`;

    // Create mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Show instructions first
    const userConfirmed = confirm(`📧 EMAIL PROCESS:

1. PDF invoice will be downloaded automatically
2. Your email client will open with pre-filled content
3. Manually attach the downloaded PDF file to the email
4. Send the email

Click OK to proceed, or Cancel to abort.`);

    if (userConfirmed) {
      // Open email client
      window.open(mailtoLink);
      
      // Show follow-up instructions
      setTimeout(() => {
        alert(`✅ EMAIL OPENED!

Next steps:
1. Check your Downloads folder for: ${fileName}
2. In your email client, click "Attach" or 📎
3. Select the downloaded PDF file
4. Send the email

The PDF has been downloaded to your Downloads folder.`);
      }, 1000);
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    alert('❌ Error generating PDF. Please try again.');
  }
};

export const sendWhatsAppInvoice = async (invoice: any, phoneNumber: string) => {
  try {
    // Calculate total for display
    const subtotal = invoice.items.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0);
    let discountAmount = 0;
    if (invoice.discountValue > 0) {
      discountAmount = invoice.discountType === 'percentage' 
        ? (subtotal * invoice.discountValue) / 100 
        : invoice.discountValue;
    }
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (invoice.taxRates || []).reduce((sum: number, tax: any) => sum + (afterDiscount * tax.rate) / 100, 0);
    const total = afterDiscount + taxAmount;

    // Generate and download PDF first
    const fileName = `invoice-${invoice.number}.pdf`;
    await exportToPDF('invoice-preview', fileName);

    const message = `Hi ${invoice.client.name}! 👋

Your invoice is ready:

📄 Invoice: ${invoice.number}
💰 Amount: ${invoice.currency} ${total.toFixed(2)}
📅 Due Date: ${invoice.dueDate}

I'll send the PDF invoice in the next message.

From: ${invoice.company.name}
📧 ${invoice.company.email}
📞 ${invoice.company.phone}

Generated with Invoice Beautifier ✨`;

    const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Show instructions first
    const userConfirmed = confirm(`📱 WHATSAPP PROCESS:

1. PDF invoice will be downloaded automatically
2. WhatsApp will open with pre-filled message
3. Send the text message first
4. Then attach and send the PDF file

Click OK to proceed, or Cancel to abort.`);

    if (userConfirmed) {
      // Open WhatsApp
      window.open(whatsappLink, '_blank');
      
      // Show follow-up instructions
      setTimeout(() => {
        alert(`✅ WHATSAPP OPENED!

Next steps:
1. Send the pre-filled text message first
2. Check Downloads folder for: ${fileName}
3. Click 📎 (attachment) in WhatsApp
4. Select "Document" and choose the PDF
5. Send the PDF file

The PDF has been downloaded to your Downloads folder.`);
      }, 1000);
    }
    
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    alert('❌ Error generating PDF. Please try again.');
  }
};

export const generateShareableLink = (invoiceId: string): string => {
  return `${window.location.origin}/invoice/${invoiceId}`;
};