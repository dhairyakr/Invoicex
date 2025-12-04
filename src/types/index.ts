export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

export interface Client {
  name: string;
  email: string;
  address: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // percentage
}

export interface PaymentInfo {
  method: string;
  details: string;
  qrCode?: string;
}

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  company: Company;
  client: Client;
  items: InvoiceItem[];
  notes: string;
  template: string;
  accentColor: string;
  font: string;
  showFooter: boolean;
  // New fields for tax and discount
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRates: TaxRate[];
  currency: string;
  // New fields for enhanced features
  paymentInfo?: PaymentInfo;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// New Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  sku?: string;
  stock?: number;
  unit: string; // e.g., 'piece', 'hour', 'kg', 'meter'
  taxable: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  isActive: boolean;
}

export type TemplateType = {
  id: string;
  name: string;
  description: string;
}

export type FontType = {
  id: string;
  name: string;
}

export interface InvoiceFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type TransactionType = 'journal' | 'invoice' | 'payment' | 'adjustment' | 'opening' | 'closing';
export type ReconciliationStatus = 'unreconciled' | 'reconciled' | 'locked';
export type AccountActivityLevel = 'high' | 'medium' | 'low' | 'dormant';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId?: string;
  description?: string;
  normalBalance: 'debit' | 'credit';
  isActive: boolean;
  reconciliationRequired: boolean;
  lastReconciledDate?: string;
  tags: string[];
  createdAt: string;
  userId: string;
}

export interface Transaction {
  id: string;
  transactionDate: string;
  postingDate: string;
  reference: string;
  description: string;
  debitAccountId: string;
  creditAccountId: string;
  amount: number;
  type: TransactionType;
  reconciliationStatus: ReconciliationStatus;
  approvedBy?: string;
  approvedAt?: string;
  attachments: string[];
  tags: string[];
  memo?: string;
  createdBy: string;
  createdAt: string;
  modifiedAt?: string;
  userId: string;
}

export interface TrialBalanceAccount {
  account: string;
  accountCode: string;
  type: AccountType;
  debit: number;
  credit: number;
  openingBalance: number;
  closingBalance: number;
  transactionCount: number;
  activityLevel: AccountActivityLevel;
  lastTransactionDate?: string;
  reconciliationStatus: ReconciliationStatus;
  varianceFromPrevious?: number;
  variancePercentage?: number;
}

export interface TrialBalanceData {
  accounts: TrialBalanceAccount[];
  totalDebits: number;
  totalCredits: number;
  isBalanced: boolean;
  variance: number;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    totalRevenue: number;
    totalExpenses: number;
  };
}

export interface LedgerEntry {
  id: string;
  date: string;
  postingDate: string;
  ref: string;
  description: string;
  contraAccount: string;
  debit: number;
  credit: number;
  balance: number;
  type: TransactionType;
  reconciliationStatus: ReconciliationStatus;
  tags: string[];
  memo?: string;
  attachments: string[];
}

export interface TAccountData {
  accountName: string;
  accountCode: string;
  accountType: AccountType;
  normalBalance: 'debit' | 'credit';
  openingBalance: number;
  totalDebits: number;
  totalCredits: number;
  closingBalance: number;
  debits: Array<{ date: string; ref: string; amount: number; description: string }>;
  credits: Array<{ date: string; ref: string; amount: number; description: string }>;
}

export interface AccountAnalytics {
  accountName: string;
  averageTransactionAmount: number;
  transactionFrequency: number;
  monthlyAverageBalance: number;
  maxBalance: number;
  minBalance: number;
  utilizationPercentage?: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  anomalies: Array<{
    date: string;
    amount: number;
    reason: string;
  }>;
}

export interface MultiPeriodComparison {
  periods: Array<{
    label: string;
    startDate: string;
    endDate: string;
  }>;
  accounts: Array<{
    accountName: string;
    accountType: AccountType;
    balances: number[];
    changes: number[];
    percentageChanges: number[];
  }>;
}

export interface ReconciliationRecord {
  id: string;
  accountId: string;
  accountName: string;
  reconciliationDate: string;
  statementBalance: number;
  bookBalance: number;
  variance: number;
  unreconciledItems: number;
  reconciledBy: string;
  notes?: string;
  status: 'pending' | 'completed' | 'approved';
  attachments: string[];
}

export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  workingCapital: number;
  assetsEqualsLiabilitiesPlusEquity: boolean;
  accountingEquationVariance: number;
}

export interface AccountFilters {
  search: string;
  types: AccountType[];
  activityLevels: AccountActivityLevel[];
  reconciliationStatus: ReconciliationStatus[];
  balanceRange: {
    min: number;
    max: number;
  };
  showInactive: boolean;
  showZeroBalance: boolean;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includeOpeningBalance: boolean;
  includeClosingBalance: boolean;
  includeVariance: boolean;
  groupByType: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  dateRange: {
    start: string;
    end: string;
  };
}