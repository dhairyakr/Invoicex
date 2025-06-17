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

    // Create mailto link with customer email pre-filled
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      setTimeout(() => {
        alert(`✅ EMAIL CLIENT OPENED!

Your email client should have opened with:
- To: ${recipientEmail}
- Subject: ${subject}
- Pre-filled message content

If your email client didn't open:
1. Copy this email: ${recipientEmail}
2. Copy the subject: Invoice ${invoice.number} from ${invoice.company.name}
3. Use the pre-written message content

Simply attach the invoice PDF and send!`);
      }, 500);
    } catch (error) {
      // Fallback: show email details for manual copying
      alert(`📧 EMAIL DETAILS

Please manually create an email with these details:

To: ${recipientEmail}
Subject: ${subject}

Message:
${body}

Copy these details to your email client and attach the invoice PDF.`);
    }
    
  } catch (error) {
    console.error('Error preparing email:', error);
    alert('❌ Error preparing email details. Please try again.');
  }
};

export const sendMessageInvoice = async (invoice: any) => {
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

    // Get client phone number
    const clientPhone = invoice.client.phone || 'No phone number provided';

    const message = `Hi ${invoice.client.name}! 👋

Your invoice is ready:

📄 Invoice: ${invoice.number}
💰 Amount: ${invoice.currency} ${total.toFixed(2)}
📅 Due Date: ${invoice.dueDate}

From: ${invoice.company.name}
📧 ${invoice.company.email}
📞 ${invoice.company.phone}

Generated with Invoice Beautifier ✨`;

    // Copy message to clipboard
    try {
      await navigator.clipboard.writeText(message);
      alert(`✅ MESSAGE COPIED TO CLIPBOARD!

The invoice message has been copied to your clipboard.

Client Details:
- Name: ${invoice.client.name}
- Phone: ${clientPhone}
- Email: ${invoice.client.email}

You can now:
1. Open your preferred messaging app (SMS, WhatsApp, Telegram, etc.)
2. Send to: ${clientPhone}
3. Paste the message (Ctrl+V or Cmd+V)

Message includes all invoice details and is ready to send!`);
    } catch (clipboardError) {
      // Fallback: show message in a modal for manual copying
      const userConfirmed = confirm(`📱 INVOICE MESSAGE READY

Client: ${invoice.client.name}
Phone: ${clientPhone}

Message:
${message}

Click OK to continue, then copy this message to your preferred messaging app.`);
      
      if (userConfirmed) {
        // Create a temporary textarea to select text for copying
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        alert('✅ Message prepared! You can now paste it in your messaging app.');
      }
    }
    
  } catch (error) {
    console.error('Error preparing message:', error);
    alert('❌ Error preparing message. Please try again.');
  }
};

export const generateShareableLink = (invoiceId: string): string => {
  return `${window.location.origin}/invoice/${invoiceId}`;
};