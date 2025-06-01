import React from 'react';
import { Invoice } from '../types';
import { formatDate } from '../utils/helpers';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const getTemplateStyles = () => {
    const baseStyles = {
      fontFamily: invoice.font === 'inter' ? 'Inter, sans-serif' :
                  invoice.font === 'roboto' ? 'Roboto, sans-serif' :
                  invoice.font === 'montserrat' ? 'Montserrat, sans-serif' :
                  invoice.font === 'playfair' ? 'Playfair Display, serif' :
                  invoice.font === 'opensans' ? 'Open Sans, sans-serif' :
                  invoice.font === 'lato' ? 'Lato, sans-serif' : 'Inter, sans-serif',
      accentColor: invoice.accentColor || '#223141',
    };

    switch (invoice.template) {
      case 'elegant':
        return {
          ...baseStyles,
          headerStyle: 'text-center pb-8 mb-8',
          titleStyle: 'text-4xl font-bold mb-2',
          subtitleStyle: 'text-2xl italic mb-4 text-gray-600',
          sectionStyle: 'mb-8',
          sectionTitleStyle: 'font-serif text-lg font-medium mb-4',
          tableHeaderStyle: 'border-b-2 border-gray-200 pb-2',
          tableStyle: 'w-full',
          tableCellStyle: 'py-3',
        };
      default:
        return {
          ...baseStyles,
          headerStyle: 'pb-8 mb-8',
          titleStyle: 'text-3xl font-bold mb-2',
          subtitleStyle: 'text-2xl mb-4 text-gray-600',
          sectionStyle: 'mb-8',
          sectionTitleStyle: 'text-lg font-medium mb-4',
          tableHeaderStyle: 'border-b-2 border-gray-200 pb-2',
          tableStyle: 'w-full',
          tableCellStyle: 'py-3',
        };
    }
  };

  const styles = getTemplateStyles();
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);

  return (
    <div className="p-12 bg-white" style={{ 
      fontFamily: styles.fontFamily,
      minHeight: '297mm',
      width: '210mm',
      margin: '0 auto',
    }}>
      <div className={styles.headerStyle}>
        {invoice.company.logo && (
          <img
            src={invoice.company.logo}
            alt="Company logo"
            className="h-16 object-contain mb-6"
          />
        )}
        <h1 className={styles.titleStyle}>{invoice.company.name || 'Your Company'}</h1>
        <h2 className={styles.subtitleStyle}>Invoice</h2>
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1 border-b border-gray-300">
            #{invoice.number}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className={styles.sectionStyle}>
          <h3 className={styles.sectionTitleStyle} style={{ color: styles.accentColor }}>
            Billed To
          </h3>
          <div className="text-gray-800">
            {invoice.client.name && <p className="font-medium mb-2">{invoice.client.name}</p>}
            {invoice.client.email && <p className="mb-2">{invoice.client.email}</p>}
            {invoice.client.address && <p className="whitespace-pre-line">{invoice.client.address}</p>}
          </div>
        </div>

        <div className={styles.sectionStyle}>
          <h3 className={styles.sectionTitleStyle} style={{ color: styles.accentColor }}>
            Details
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">
              <p className="mb-2">Issue Date:</p>
              <p>Due Date:</p>
            </div>
            <div className="text-gray-800">
              <p className="mb-2">{formatDate(invoice.issueDate)}</p>
              <p>{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionStyle}>
        <table className={styles.tableStyle}>
          <thead>
            <tr className={styles.tableHeaderStyle}>
              <th className="text-left py-2 w-2/5">Description</th>
              <th className="text-center py-2 w-1/5">Quantity</th>
              <th className="text-right py-2 w-1/5">Rate</th>
              <th className="text-right py-2 w-1/5">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className={`${styles.tableCellStyle} text-left`}>
                  {item.description || 'Item description'}
                </td>
                <td className={`${styles.tableCellStyle} text-center`}>
                  {item.quantity}
                </td>
                <td className={`${styles.tableCellStyle} text-right`}>
                  ${item.rate.toFixed(2)}
                </td>
                <td className={`${styles.tableCellStyle} text-right`}>
                  ${(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span>Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-3 font-bold border-t-2 border-gray-200 mt-2">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className={styles.sectionStyle}>
          <h3 className={styles.sectionTitleStyle} style={{ color: styles.accentColor }}>
            Notes
          </h3>
          <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {invoice.showFooter && (
        <div className="mt-12 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          Generated by Invoice Beautifier
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;