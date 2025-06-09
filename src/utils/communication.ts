export const sendEmailInvoice = (invoice: any, recipientEmail: string) => {
  const subject = `Invoice ${invoice.number} from ${invoice.company.name}`;
  const body = `Dear ${invoice.client.name},

Please find attached your invoice ${invoice.number}.

Invoice Details:
- Amount: ${invoice.currency} ${invoice.total}
- Due Date: ${invoice.dueDate}

Best regards,
${invoice.company.name}`;

  const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink);
};

export const sendWhatsAppInvoice = (invoice: any, phoneNumber: string) => {
  const message = `Hi ${invoice.client.name}! 

Your invoice ${invoice.number} is ready:
💰 Amount: ${invoice.currency} ${invoice.total}
📅 Due Date: ${invoice.dueDate}

From ${invoice.company.name}`;

  const whatsappLink = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  window.open(whatsappLink, '_blank');
};

export const generateShareableLink = (invoiceId: string): string => {
  return `${window.location.origin}/invoice/${invoiceId}`;
};