import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (
  elementOrId: string | HTMLElement, 
  fileName: string = 'invoice.pdf',
  returnBlob: boolean = false,
  printMode: boolean = false
): Promise<Blob | void> => {
  let element: HTMLElement;
  
  if (typeof elementOrId === 'string') {
    const foundElement = document.getElementById(elementOrId);
    if (!foundElement) {
      throw new Error('Element not found');
    }
    element = foundElement;
  } else {
    element = elementOrId;
  }

  try {
    // Wait for any images to load and ensure element is visible
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Ensure the element has proper dimensions before capturing
    const originalStyle = {
      width: element.style.width,
      height: element.style.height,
      position: element.style.position,
      visibility: element.style.visibility,
      display: element.style.display
    };

    // Temporarily set explicit dimensions and ensure visibility
    element.style.width = '210mm';
    element.style.height = 'auto';
    element.style.position = 'relative';
    element.style.visibility = 'visible';
    element.style.display = 'block';

    // Wait for layout to settle
    await new Promise(resolve => setTimeout(resolve, 50));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // Use actual element dimensions
      width: element.offsetWidth || 793.7,
      height: element.offsetHeight || 1122.5,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.querySelector('[data-invoice-preview]') || 
                             clonedDoc.getElementById('invoice-preview') ||
                             clonedDoc.body.firstElementChild;
        if (clonedElement) {
          // Ensure the cloned element has proper dimensions
          (clonedElement as HTMLElement).style.width = '210mm';
          (clonedElement as HTMLElement).style.height = 'auto';
          (clonedElement as HTMLElement).style.margin = '0';
          (clonedElement as HTMLElement).style.padding = '20mm';
          (clonedElement as HTMLElement).style.boxSizing = 'border-box';
          (clonedElement as HTMLElement).style.display = 'block';
          (clonedElement as HTMLElement).style.visibility = 'visible';
          
          // Ensure all child elements are visible
          const allElements = clonedElement.querySelectorAll('*');
          allElements.forEach((el: any) => {
            if (el.style) {
              el.style.visibility = 'visible';
              el.style.display = el.style.display === 'none' ? 'block' : el.style.display;
            }
          });
        }
      }
    });

    // Restore original styles
    Object.assign(element.style, originalStyle);

    // Verify canvas has valid dimensions
    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas has invalid dimensions. Please ensure the invoice preview is visible and has content.');
    }

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add the image to PDF
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.95),
      'JPEG',
      0,
      0,
      imgWidth,
      imgHeight,
      '',
      'FAST'
    );
    
    if (printMode) {
      // Print mode: Create a hidden iframe and trigger print
      const pdfDataUri = pdf.output('datauristring');
      
      // Create hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Set the PDF as the iframe source
      iframe.src = pdfDataUri;
      
      // Wait for the iframe to load, then trigger print
      iframe.onload = () => {
        try {
          // Focus the iframe and trigger print
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Clean up after a delay
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        } catch (error) {
          console.error('Error printing PDF:', error);
          // Fallback: download the PDF if printing fails
          pdf.save(fileName);
          // Clean up
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }
      };
      
      // Fallback: if iframe fails to load, clean up and download
      iframe.onerror = () => {
        console.warn('Print failed, downloading PDF instead');
        pdf.save(fileName);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      
      return;
    } else if (returnBlob) {
      // Return blob for email/WhatsApp attachment
      return pdf.output('blob');
    } else {
      // Download the PDF
      pdf.save(fileName);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};