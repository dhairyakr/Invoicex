import { exportToPDF } from './pdfExport';

// Email service configurations
const emailServices = [
  { 
    name: 'Gmail', 
    url: 'https://mail.google.com/mail/u/0/#inbox?compose=new',
    icon: '📧',
    supportsTo: true
  },
  { 
    name: 'Outlook', 
    url: 'https://outlook.live.com/mail/0/deeplink/compose',
    icon: '📮',
    supportsTo: true
  },
  { 
    name: 'Yahoo Mail', 
    url: 'https://mail.yahoo.com/d/compose',
    icon: '📬',
    supportsTo: true
  },
  { 
    name: 'Apple Mail (iCloud)', 
    url: 'https://www.icloud.com/mail',
    icon: '📭',
    supportsTo: false
  },
  { 
    name: 'Thunderbird', 
    url: 'mailto:',
    icon: '🦅',
    supportsTo: true
  },
  { 
    name: 'Other Email App', 
    url: 'mailto:',
    icon: '📨',
    supportsTo: true
  }
];

export const sendEmailInvoice = async (invoice: any, pdfBlob?: Blob, recipientEmail?: string) => {
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

    // Generate and download PDF if not provided
    let fileName = `invoice-${invoice.number}.pdf`;
    if (!pdfBlob) {
      await exportToPDF('invoice-preview', fileName);
    } else {
      // Create download link for the provided blob
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    
    // Use client email from invoice if not provided
    const clientEmail = recipientEmail || invoice.client?.email || '';
    
    // Create email service selection modal
    const serviceSelection = await new Promise<{url: string, supportsTo: boolean, serviceName: string}>((resolve) => {
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
          ${clientEmail ? `<p class="text-sm text-blue-600 mt-2 font-medium">📧 To: ${clientEmail}</p>` : `<p class="text-sm text-orange-600 mt-2">⚠️ No client email found - you'll need to add it manually</p>`}
        </div>
        
        <div class="space-y-3 mb-6">
          ${emailServices.map(service => `
            <button 
              class="email-service-btn w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center text-left group"
              data-service="${service.name}"
              data-url="${service.url}"
              data-supports-to="${service.supportsTo}"
            >
              <span class="text-2xl mr-4">${service.icon}</span>
              <div class="flex-1">
                <div class="font-semibold text-gray-900 group-hover:text-blue-600">${service.name}</div>
                <div class="text-sm text-gray-500">
                  ${service.supportsTo && clientEmail 
                    ? `✅ Will auto-fill recipient: ${clientEmail}` 
                    : clientEmail && !service.supportsTo
                    ? `📝 Manual entry required: ${clientEmail}`
                    : '📝 Manual recipient entry required'
                  }
                </div>
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
          const supportsTo = serviceBtn.dataset.supportsTo === 'true';
          
          // Animate out
          modal.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(overlay);
            resolve({ url: serviceUrl, supportsTo, serviceName });
          }, 200);
        } else if (cancelBtn) {
          // Animate out
          modal.classList.add('scale-95', 'opacity-0');
          setTimeout(() => {
            document.body.removeChild(overlay);
            resolve({ url: '', supportsTo: false, serviceName: '' });
          }, 200);
        }
      });
    });
    
    // If user cancelled, return
    if (!serviceSelection.url) {
      return;
    }
    
    // Open the selected email service with proper client email handling
    let finalUrl = serviceSelection.url;
    
    if (serviceSelection.url.startsWith('mailto:')) {
      // For mailto links, add the recipient if available
      if (clientEmail) {
        finalUrl = `mailto:${encodeURIComponent(clientEmail)}`;
      } else {
        finalUrl = 'mailto:';
      }
      window.open(finalUrl);
    } else if (serviceSelection.url.includes('mail.google.com')) {
      // For Gmail, add recipient to compose URL
      if (clientEmail) {
        finalUrl = `https://mail.google.com/mail/u/0/#inbox?compose=new&to=${encodeURIComponent(clientEmail)}`;
      } else {
        finalUrl = 'https://mail.google.com/mail/u/0/#inbox?compose=new';
      }
      window.open(finalUrl, '_blank');
    } else if (serviceSelection.url.includes('outlook.live.com')) {
      // For Outlook, add recipient to compose URL
      if (clientEmail) {
        finalUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(clientEmail)}`;
      } else {
        finalUrl = 'https://outlook.live.com/mail/0/deeplink/compose';
      }
      window.open(finalUrl, '_blank');
    } else if (serviceSelection.url.includes('mail.yahoo.com')) {
      // For Yahoo Mail, add recipient to compose URL
      if (clientEmail) {
        finalUrl = `https://mail.yahoo.com/d/compose?to=${encodeURIComponent(clientEmail)}`;
      } else {
        finalUrl = 'https://mail.yahoo.com/d/compose';
      }
      window.open(finalUrl, '_blank');
    } else {
      // For other web-based email services (like iCloud), open in new tab
      window.open(serviceSelection.url, '_blank');
    }
    
    // Show success message with instructions
    setTimeout(() => {
      const successModal = document.createElement('div');
      successModal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4';
      
      const successContent = document.createElement('div');
      successContent.className = 'bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all duration-300 scale-95 opacity-0';
      
      const wasEmailPreFilled = clientEmail && serviceSelection.supportsTo;
      
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
                <span class="font-medium">${serviceSelection.serviceName} Opened</span>
              </div>
              ${wasEmailPreFilled ? `
                <div class="flex items-center text-green-800">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="font-medium">Recipient Pre-filled: ${clientEmail}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h4 class="font-semibold text-blue-900 mb-3">Next Steps:</h4>
            <ol class="text-left text-blue-800 space-y-2 text-sm">
              ${!wasEmailPreFilled ? `
                <li class="flex items-start">
                  <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <span>Add the client's email address: <strong>${clientEmail || 'client@example.com'}</strong></span>
                </li>
              ` : ''}
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">${!wasEmailPreFilled ? '2' : '1'}</span>
                <span>Attach the downloaded PDF file (${fileName})</span>
              </li>
              <li class="flex items-start">
                <span class="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">${!wasEmailPreFilled ? '3' : '2'}</span>
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

export const generateShareableLink = (invoiceId: string): string => {
  return `${window.location.origin}/invoice/${invoiceId}`;
};