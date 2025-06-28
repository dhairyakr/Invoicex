import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToPDF = async (
  elementId: string, 
  fileName: string = 'invoice.pdf',
  returnBlob: boolean = false
): Promise<Blob | void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
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
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Ensure the cloned element has proper dimensions
          clonedElement.style.width = '210mm';
          clonedElement.style.height = 'auto';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '20mm';
          clonedElement.style.boxSizing = 'border-box';
          clonedElement.style.display = 'block';
          clonedElement.style.visibility = 'visible';
          
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
    
    if (returnBlob) {
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