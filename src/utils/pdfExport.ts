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
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      // Ensure proper dimensions
      width: 793.7, // A4 width in pixels at 96 DPI
      height: 1122.5, // A4 height in pixels at 96 DPI
      onclone: (document) => {
        const el = document.getElementById(elementId);
        if (el) {
          el.style.width = '210mm';
          el.style.height = '297mm';
          el.style.margin = '0';
          el.style.padding = '0';
        }
      }
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(
      canvas.toDataURL('image/jpeg', 1.0),
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