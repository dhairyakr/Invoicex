import { exportToPDF } from './pdfExport';

// Email service configurations
const emailServices = [
  { 
    name: 'Gmail', 
    url: 'https://mail.google.com/mail/u/0/#inbox?compose=new',
    icon: '📧'
  },
  { 
    name: 'Outlook', 
    url: 'https://outlook.live.com/mail/0/deeplink/compose',
    icon: '📮'
  },
  { 
    name: 'Yahoo Mail', 
    url: 'https://mail.yahoo.com/d/compose',
    icon: '📬'
  },
  { 
    name: 'Apple Mail', 
    url: 'mailto:',
    icon: '📭'
  },
  { 
    name: 'Thunderbird', 
    url: 'mailto:',
    icon: '🦅'
  },
  { 
    name: 'Other Email App', 
    url: 'mailto:',
    icon: '📨'
  }
];

export const sendEmailInvoice = async (invoice: any, recipientEmail?: string) => {
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
    
    // Create email service selection modal
    const serviceSelection = await new Promise<string>((resolve) => {
      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4';
      
      // Create modal content
      const modal = document.createElement('div');
      modal.className = 'bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 opacity-0';
      
      modal.innerHTML = `
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📧</span>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Choose Email Service</h3>
          <p class="text-gray-600">Select your preferred email service to send the invoice</p>
        </div>
        
        <div class="space-y-3 mb-6">
          ${emailServices.map(service => `
            <button 
              class="email-service-btn w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center text-left group"
              data-service="${service.name}"
              data-url="${service.url}"
            >
              <span class="text-2xl mr-4">${service.icon}</span>
              <div>
                <div class="font-semibold text-gray-900 group-hover:text-blue-600">${service.name}</div>
                <div class="text-sm text-gray-500">Open ${service.name} to compose email</div>
              </div>
              <div class="ml-auto text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </button>
          `).join('')}
        </div>
        
        <div class="flex gap-3">
          <button 
            id="cancel-email" 
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      `;
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      // Animate in
      setTimeout(() => {
        modal.classList.remove('scale-95', 'opacity-0');
        modal.classList.add('scale-100', 'opacity-100');
      }, 10);
      
      // Handle service selection
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const serviceBtn = target.closest('.email-service-btn') as HTMLElement;
        const cancelBtn = target.closest('#cancel-email');
        
        if (serviceBtn) {
          const serviceName = serviceBtn.dataset.service!;
          const serviceUrl = serviceBtn.dataset.url!;
          
          // Animate out
          modal.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(overlay);
            resolve(serviceUrl);
          }, 200);
        } else if (cancelBtn) {
          // Animate out
          modal.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(overlay);
            resolve('');
          }, 200);
        }
      });
    });
    
    // If user cancelled, return
    if (!serviceSelection) {
      return;
    }
    
    // Open the selected email service
    if (serviceSelection.startsWith('mailto:')) {
      // For mailto links, just open the default email client
      window.open(serviceSelection);
    } else {
      // For web-based email services, open in new tab
      window.open(serviceSelection, '_blank');
    }
    
    // Show success message with instructions
    setTimeout(() => {
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4';
      
      const successContent = document.createElement('div');
      successContent.className = 'bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-95 opacity-0';
      
      successContent.innerHTML = `
        <div class="text-center">
          <div class="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 class="text-2xl font-bold text-gray-900 mb-4">Invoice Ready to Send!</h3>
          
          <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div class="text-left space-y-3">
              <div class="flex items-center text-green-800">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">PDF Downloaded: ${fileName}</span>
              </div>
              <div class="flex items-center text-green-800">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">Email Service Opened</span>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">Next Steps:</h4>
            <ol class="text-left text-blue-800 space-y-2 text-sm">
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                <span>Add the client's email address in the "To" field</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                <span>Attach the downloaded PDF file (${fileName})</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                <span>Write your message and send the email</span>
              </li>
            </ol>
          </div>
          
          <div class="text-sm text-gray-600 mb-6">
            <strong>Invoice Details:</strong><br>
            Invoice #${invoice.number} • ${invoice.currency} ${total.toFixed(2)} • Due: ${invoice.dueDate}
          </div>
          
          <button 
            id="close-success" 
            class="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold"
          >
            Got it!
          </button>
        </div>
      `;
      
      successModal.appendChild(successContent);
      document.body.appendChild(successModal);
      
      // Animate in
      setTimeout(() => {
        successContent.classList.remove('scale-95', 'opacity-0');
        successContent.classList.add('scale-100', 'opacity-100');
      }, 10);
      
      // Handle close
      successContent.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('#close-success')) {
          successContent.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(successModal);
          }, 200);
        }
      });
      
      // Auto close after 10 seconds
      setTimeout(() => {
        if (document.body.contains(successModal)) {
          successContent.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(successModal);
          }, 200);
        }
      }, 10000);
    }, 500);
    
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