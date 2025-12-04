import {
  TrialBalanceAccount,
  TrialBalanceData,
  LedgerEntry,
  TAccountData,
  AccountAnalytics,
  MultiPeriodComparison,
  FinancialRatios,
  AccountType,
  AccountActivityLevel,
  ReconciliationStatus
} from '../types';

export const calculateAccountActivity = (
  transactionCount: number,
  daysSinceLast: number
): AccountActivityLevel => {
  if (transactionCount === 0 || daysSinceLast > 90) return 'dormant';
  if (transactionCount > 20 && daysSinceLast < 7) return 'high';
  if (transactionCount > 10 && daysSinceLast < 30) return 'medium';
  return 'low';
};

export const calculateVariance = (current: number, previous: number) => {
  const variance = current - previous;
  const percentage = previous !== 0 ? (variance / Math.abs(previous)) * 100 : 0;
  return { variance, percentage };
};

export const formatAccountType = (type: string): AccountType => {
  const typeMap: Record<string, AccountType> = {
    'asset': 'Asset',
    'liability': 'Liability',
    'equity': 'Equity',
    'revenue': 'Revenue',
    'expense': 'Expense'
  };
  return typeMap[type.toLowerCase()] || 'Asset';
};

export const getAccountNormalBalance = (type: AccountType): 'debit' | 'credit' => {
  return ['Asset', 'Expense'].includes(type) ? 'debit' : 'credit';
};

export const calculateClosingBalance = (
  type: AccountType,
  openingBalance: number,
  totalDebits: number,
  totalCredits: number
): number => {
  const normalBalance = getAccountNormalBalance(type);

  if (normalBalance === 'debit') {
    return openingBalance + totalDebits - totalCredits;
  } else {
    return openingBalance + totalCredits - totalDebits;
  }
};

export const groupAccountsByType = (accounts: TrialBalanceAccount[]) => {
  const grouped: Record<AccountType, TrialBalanceAccount[]> = {
    Asset: [],
    Liability: [],
    Equity: [],
    Revenue: [],
    Expense: []
  };

  accounts.forEach(account => {
    grouped[account.type].push(account);
  });

  return grouped;
};

export const calculateTrialBalanceSummary = (accounts: TrialBalanceAccount[]) => {
  const summary = {
    totalAssets: 0,
    totalLiabilities: 0,
    totalEquity: 0,
    totalRevenue: 0,
    totalExpenses: 0
  };

  accounts.forEach(account => {
    const balance = account.closingBalance;
    switch (account.type) {
      case 'Asset':
        summary.totalAssets += balance;
        break;
      case 'Liability':
        summary.totalLiabilities += balance;
        break;
      case 'Equity':
        summary.totalEquity += balance;
        break;
      case 'Revenue':
        summary.totalRevenue += balance;
        break;
      case 'Expense':
        summary.totalExpenses += balance;
        break;
    }
  });

  return summary;
};

export const calculateFinancialRatios = (summary: {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}): FinancialRatios => {
  const currentAssets = summary.totalAssets;
  const currentLiabilities = summary.totalLiabilities;

  const currentRatio = currentLiabilities !== 0 ? currentAssets / currentLiabilities : 0;
  const quickRatio = currentLiabilities !== 0 ? (currentAssets * 0.8) / currentLiabilities : 0;
  const debtToEquity = summary.totalEquity !== 0 ? summary.totalLiabilities / summary.totalEquity : 0;
  const workingCapital = currentAssets - currentLiabilities;

  const calculatedEquity = summary.totalAssets - summary.totalLiabilities;
  const variance = Math.abs(calculatedEquity - summary.totalEquity);
  const isBalanced = variance < 1;

  return {
    currentRatio: Math.round(currentRatio * 100) / 100,
    quickRatio: Math.round(quickRatio * 100) / 100,
    debtToEquity: Math.round(debtToEquity * 100) / 100,
    workingCapital: Math.round(workingCapital * 100) / 100,
    assetsEqualsLiabilitiesPlusEquity: isBalanced,
    accountingEquationVariance: Math.round(variance * 100) / 100
  };
};

export const sortTrialBalance = (
  accounts: TrialBalanceAccount[],
  sortBy: 'name' | 'code' | 'type' | 'debit' | 'credit' | 'balance',
  sortOrder: 'asc' | 'desc'
): TrialBalanceAccount[] => {
  return [...accounts].sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = a.account.localeCompare(b.account);
        break;
      case 'code':
        compareValue = a.accountCode.localeCompare(b.accountCode);
        break;
      case 'type':
        compareValue = a.type.localeCompare(b.type);
        break;
      case 'debit':
        compareValue = a.debit - b.debit;
        break;
      case 'credit':
        compareValue = a.credit - b.credit;
        break;
      case 'balance':
        compareValue = a.closingBalance - b.closingBalance;
        break;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });
};

export const filterAccounts = (
  accounts: TrialBalanceAccount[],
  filters: {
    search?: string;
    types?: AccountType[];
    activityLevels?: AccountActivityLevel[];
    reconciliationStatus?: ReconciliationStatus[];
    showZeroBalance?: boolean;
  }
): TrialBalanceAccount[] => {
  return accounts.filter(account => {
    if (filters.search && !account.account.toLowerCase().includes(filters.search.toLowerCase()) &&
        !account.accountCode.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    if (filters.types && filters.types.length > 0 && !filters.types.includes(account.type)) {
      return false;
    }

    if (filters.activityLevels && filters.activityLevels.length > 0 &&
        !filters.activityLevels.includes(account.activityLevel)) {
      return false;
    }

    if (filters.reconciliationStatus && filters.reconciliationStatus.length > 0 &&
        !filters.reconciliationStatus.includes(account.reconciliationStatus)) {
      return false;
    }

    if (!filters.showZeroBalance && account.closingBalance === 0) {
      return false;
    }

    return true;
  });
};

export const calculateAccountAnalytics = (
  ledgerEntries: LedgerEntry[],
  accountName: string
): AccountAnalytics => {
  if (ledgerEntries.length === 0) {
    return {
      accountName,
      averageTransactionAmount: 0,
      transactionFrequency: 0,
      monthlyAverageBalance: 0,
      maxBalance: 0,
      minBalance: 0,
      trendDirection: 'stable',
      anomalies: []
    };
  }

  const amounts = ledgerEntries.map(e => e.debit + e.credit);
  const balances = ledgerEntries.map(e => e.balance);

  const averageTransactionAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const maxBalance = Math.max(...balances);
  const minBalance = Math.min(...balances);
  const monthlyAverageBalance = balances.reduce((sum, bal) => sum + bal, 0) / balances.length;

  const firstBalance = ledgerEntries[0].balance;
  const lastBalance = ledgerEntries[ledgerEntries.length - 1].balance;
  const trendDirection = lastBalance > firstBalance * 1.1 ? 'increasing' :
                        lastBalance < firstBalance * 0.9 ? 'decreasing' : 'stable';

  const anomalies = ledgerEntries
    .filter(entry => {
      const amount = entry.debit + entry.credit;
      return amount > averageTransactionAmount * 3;
    })
    .map(entry => ({
      date: entry.date,
      amount: entry.debit + entry.credit,
      reason: 'Transaction exceeds 3x average'
    }));

  return {
    accountName,
    averageTransactionAmount: Math.round(averageTransactionAmount * 100) / 100,
    transactionFrequency: ledgerEntries.length,
    monthlyAverageBalance: Math.round(monthlyAverageBalance * 100) / 100,
    maxBalance: Math.round(maxBalance * 100) / 100,
    minBalance: Math.round(minBalance * 100) / 100,
    trendDirection,
    anomalies: anomalies.slice(0, 5)
  };
};

export const buildTAccountData = (
  accountName: string,
  accountCode: string,
  accountType: AccountType,
  ledgerEntries: LedgerEntry[],
  openingBalance: number
): TAccountData => {
  const debits = ledgerEntries
    .filter(e => e.debit > 0)
    .map(e => ({
      date: e.date,
      ref: e.ref,
      amount: e.debit,
      description: e.description
    }));

  const credits = ledgerEntries
    .filter(e => e.credit > 0)
    .map(e => ({
      date: e.date,
      ref: e.ref,
      amount: e.credit,
      description: e.description
    }));

  const totalDebits = debits.reduce((sum, d) => sum + d.amount, 0);
  const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0);

  const closingBalance = calculateClosingBalance(accountType, openingBalance, totalDebits, totalCredits);

  return {
    accountName,
    accountCode,
    accountType,
    normalBalance: getAccountNormalBalance(accountType),
    openingBalance,
    totalDebits,
    totalCredits,
    closingBalance,
    debits,
    credits
  };
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};