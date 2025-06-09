import { exportToPDF } from './pdfExport';

export const sendEmailInvoice = async (invoice: any, recipientEmail: string) => {
  try {
    // Generate PDF first
    const pdfBlob = await exportToPDF('invoice-preview', `invoice-${invoice.number}.pdf`, true);
    
    const subject = `Invoice ${invoice.number} from ${invoice.company.name}`;
    const body = `Dear ${invoice.client.name},

Please find attached your invoice ${invoice.number}.

Invoice Details:
- Amount: ${invoice.currency} ${invoice.total}
- Due Date: ${invoice.dueDate}

Best regards,
${invoice.company.name}

---
This invoice was generated using Invoice Beautifier`;

    // Create mailto link with attachment note
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.open(mailtoLink);
    
    // Show user instruction for PDF attachment
    setTimeout(() => {
      alert(`Email client opened! Please attach the PDF file that will be automatically downloaded.`);
      
      // Trigger PDF download for manual attachment
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `invoice-${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 500);
    
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export const sendWhatsAppInvoice = async (invoice: any, phoneNumber: string) => {
  try {
    // Generate PDF first
    const pdfBlob = await exportToPDF('invoice-preview', `invoice-${invoice.number}.pdf`, true);
    
    const message = `Hi ${invoice.client.name}! 

Your invoice ${invoice.number} is ready:
💰 Amount: ${invoice.currency} ${invoice.total}
📅 Due Date: ${invoice.dueDate}

📎 PDF invoice will be downloaded automatically - please attach it to this WhatsApp message.

From ${invoice.company.name}

---
Generated with Invoice Beautifier`;

    const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    // Show user instruction and download PDF
    setTimeout(() => {
      alert(`WhatsApp opened! The PDF will be downloaded automatically - please attach it to your message.`);
      
      // Trigger PDF download for manual attachment
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `invoice-${invoice.number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }, 500);
    
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    alert('Error generating PDF. Please try again.');
  }
};

export const generateShareableLink = (invoiceId: string): string => {
  return `${window.location.origin}/invoice/${invoiceId}`;
};