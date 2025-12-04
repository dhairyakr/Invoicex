import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TrialBalanceData, LedgerEntry, ExportOptions } from '../types';
import { formatCurrency, formatNumber } from './trialBalanceUtils';

export const exportTrialBalanceToCSV = (data: TrialBalanceData, options: ExportOptions): void => {
  const rows: string[] = [];

  rows.push(`Trial Balance Report`);
  rows.push(`Period: ${new Date(data.period.start).toLocaleDateString()} to ${new Date(data.period.end).toLocaleDateString()}`);
  rows.push('');

  const headers = ['Account Code', 'Account Name', 'Type'];
  if (options.includeOpeningBalance) headers.push('Opening Balance');
  headers.push('Debit', 'Credit');
  if (options.includeClosingBalance) headers.push('Closing Balance');
  if (options.includeVariance) headers.push('Variance', 'Variance %');

  rows.push(headers.join(','));

  data.accounts.forEach(account => {
    const row = [
      `"${account.accountCode}"`,
      `"${account.account}"`,
      account.type
    ];
    if (options.includeOpeningBalance) row.push(account.openingBalance.toFixed(2));
    row.push(account.debit.toFixed(2), account.credit.toFixed(2));
    if (options.includeClosingBalance) row.push(account.closingBalance.toFixed(2));
    if (options.includeVariance && account.varianceFromPrevious !== undefined) {
      row.push(
        account.varianceFromPrevious.toFixed(2),
        (account.variancePercentage || 0).toFixed(2)
      );
    }
    rows.push(row.join(','));
  });

  rows.push('');
  const totalsRow = ['', 'TOTAL', ''];
  if (options.includeOpeningBalance) totalsRow.push('');
  totalsRow.push(data.totalDebits.toFixed(2), data.totalCredits.toFixed(2));
  rows.push(totalsRow.join(','));

  if (options.includeSummary) {
    rows.push('');
    rows.push('Summary');
    rows.push(`Total Assets,${data.summary.totalAssets.toFixed(2)}`);
    rows.push(`Total Liabilities,${data.summary.totalLiabilities.toFixed(2)}`);
    rows.push(`Total Equity,${data.summary.totalEquity.toFixed(2)}`);
    rows.push(`Total Revenue,${data.summary.totalRevenue.toFixed(2)}`);
    rows.push(`Total Expenses,${data.summary.totalExpenses.toFixed(2)}`);
  }

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `trial_balance_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportTrialBalanceToPDF = (data: TrialBalanceData, options: ExportOptions): void => {
  const doc = new jsPDF('landscape');

  doc.setFontSize(20);
  doc.text('Trial Balance Report', 14, 20);

  doc.setFontSize(10);
  doc.text(
    `Period: ${new Date(data.period.start).toLocaleDateString()} to ${new Date(data.period.end).toLocaleDateString()}`,
    14,
    28
  );

  doc.text(
    `Status: ${data.isBalanced ? 'Balanced ✓' : 'Imbalanced ⚠'}`,
    14,
    34
  );

  const headers: string[] = ['Code', 'Account Name', 'Type'];
  if (options.includeOpeningBalance) headers.push('Opening');
  headers.push('Debit', 'Credit');
  if (options.includeClosingBalance) headers.push('Closing');

  const rows = data.accounts.map(account => {
    const row = [
      account.accountCode,
      account.account,
      account.type
    ];
    if (options.includeOpeningBalance) row.push(formatCurrency(account.openingBalance));
    row.push(
      account.debit > 0 ? formatCurrency(account.debit) : '—',
      account.credit > 0 ? formatCurrency(account.credit) : '—'
    );
    if (options.includeClosingBalance) row.push(formatCurrency(account.closingBalance));
    return row;
  });

  const totalsRow = ['', 'TOTAL', ''];
  if (options.includeOpeningBalance) totalsRow.push('');
  totalsRow.push(formatCurrency(data.totalDebits), formatCurrency(data.totalCredits));
  if (options.includeClosingBalance) totalsRow.push('');
  rows.push(totalsRow);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 9 },
  });

  if (options.includeSummary) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text('Financial Summary', 14, finalY);

    const summaryData = [
      ['Total Assets', formatCurrency(data.summary.totalAssets)],
      ['Total Liabilities', formatCurrency(data.summary.totalLiabilities)],
      ['Total Equity', formatCurrency(data.summary.totalEquity)],
      ['Total Revenue', formatCurrency(data.summary.totalRevenue)],
      ['Total Expenses', formatCurrency(data.summary.totalExpenses)],
    ];

    autoTable(doc, {
      body: summaryData,
      startY: finalY + 5,
      theme: 'plain',
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      },
    });
  }

  doc.save(`trial_balance_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportLedgerToCSV = (
  accountName: string,
  entries: LedgerEntry[],
  dateRange: { start: string; end: string }
): void => {
  const rows: string[] = [];

  rows.push(`General Ledger - ${accountName}`);
  rows.push(`Period: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}`);
  rows.push('');

  rows.push(['Date', 'Reference', 'Description', 'Contra Account', 'Debit', 'Credit', 'Balance'].join(','));

  entries.forEach(entry => {
    const row = [
      entry.date,
      entry.ref,
      `"${entry.description}"`,
      `"${entry.contraAccount}"`,
      entry.debit > 0 ? entry.debit.toFixed(2) : '',
      entry.credit > 0 ? entry.credit.toFixed(2) : '',
      entry.balance.toFixed(2)
    ];
    rows.push(row.join(','));
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `ledger_${accountName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportLedgerToPDF = (
  accountName: string,
  entries: LedgerEntry[],
  dateRange: { start: string; end: string }
): void => {
  const doc = new jsPDF('landscape');

  doc.setFontSize(20);
  doc.text(`General Ledger`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Account: ${accountName}`, 14, 28);

  doc.setFontSize(10);
  doc.text(
    `Period: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}`,
    14,
    34
  );

  const headers = ['Date', 'Ref', 'Description', 'Contra Account', 'Debit', 'Credit', 'Balance'];

  const rows = entries.map(entry => [
    entry.date,
    entry.ref,
    entry.description.substring(0, 30),
    entry.contraAccount.substring(0, 20),
    entry.debit > 0 ? formatCurrency(entry.debit) : '—',
    entry.credit > 0 ? formatCurrency(entry.credit) : '—',
    formatCurrency(entry.balance)
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 18 },
      2: { cellWidth: 50 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
      6: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`ledger_${accountName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};