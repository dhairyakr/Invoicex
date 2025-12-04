export interface AgingData {
  customer: string;
  current: number;
  days30: number;
  days60: number;
  days90: number;
  days90Plus?: number;
  total: number;
  overdue: boolean;
  customerVendorId?: string;
  email?: string;
  phone?: string;
  paymentHistory?: PaymentHistoryItem[];
}

export interface PaymentHistoryItem {
  date: string;
  amount: number;
  invoiceNumber: string;
  daysToPayment: number;
}

export interface AnalyticsMetrics {
  dso: number;
  cei: number;
  collectionRate: number;
  badDebtRatio: number;
  averageDaysToPayment: number;
  totalReceivables: number;
  totalOverdue: number;
  overduePercentage: number;
  currentRatio: number;
  agingBuckets: {
    current: number;
    days30: number;
    days60: number;
    days90Plus: number;
  };
}

export interface RiskAssessment {
  score: number;
  rating: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
}

export const calculateDSO = (receivables: number, revenue: number, days: number = 30): number => {
  if (revenue === 0) return 0;
  return (receivables / revenue) * days;
};

export const calculateCEI = (
  beginningReceivables: number,
  creditSales: number,
  endingReceivables: number
): number => {
  const collectedAmount = beginningReceivables + creditSales - endingReceivables;
  const availableToCollect = beginningReceivables + creditSales;

  if (availableToCollect === 0) return 0;
  return (collectedAmount / availableToCollect) * 100;
};

export const calculateCollectionRate = (
  collected: number,
  totalDue: number
): number => {
  if (totalDue === 0) return 100;
  return (collected / totalDue) * 100;
};

export const calculateBadDebtRatio = (
  badDebt: number,
  totalSales: number
): number => {
  if (totalSales === 0) return 0;
  return (badDebt / totalSales) * 100;
};

export const calculateAverageDaysToPayment = (
  paymentHistory: PaymentHistoryItem[]
): number => {
  if (paymentHistory.length === 0) return 0;
  const totalDays = paymentHistory.reduce((sum, payment) => sum + payment.daysToPayment, 0);
  return totalDays / paymentHistory.length;
};

export const calculateAgingMetrics = (
  agingData: AgingData[],
  revenue: number = 0,
  period: number = 30
): AnalyticsMetrics => {
  const totals = agingData.reduce((acc, item) => ({
    current: acc.current + item.current,
    days30: acc.days30 + item.days30,
    days60: acc.days60 + item.days60,
    days90Plus: acc.days90Plus + item.days90 + (item.days90Plus || 0),
    total: acc.total + item.total,
  }), { current: 0, days30: 0, days60: 0, days90Plus: 0, total: 0 });

  const totalOverdue = totals.days30 + totals.days60 + totals.days90Plus;
  const overduePercentage = totals.total > 0 ? (totalOverdue / totals.total) * 100 : 0;
  const currentRatio = totals.total > 0 ? (totals.current / totals.total) * 100 : 0;

  const dso = calculateDSO(totals.total, revenue || totals.total, period);

  const collectionRate = totals.total > 0
    ? ((totals.total - totalOverdue) / totals.total) * 100
    : 100;

  return {
    dso,
    cei: 0,
    collectionRate,
    badDebtRatio: 0,
    averageDaysToPayment: 0,
    totalReceivables: totals.total,
    totalOverdue,
    overduePercentage,
    currentRatio,
    agingBuckets: {
      current: totals.current,
      days30: totals.days30,
      days60: totals.days60,
      days90Plus: totals.days90Plus,
    }
  };
};

export const assessCustomerRisk = (
  agingData: AgingData,
  paymentHistory: PaymentHistoryItem[] = [],
  creditLimit: number = 0
): RiskAssessment => {
  const factors: string[] = [];
  let score = 0;

  const totalOverdue = agingData.days30 + agingData.days60 + agingData.days90;
  const overduePercentage = agingData.total > 0 ? (totalOverdue / agingData.total) * 100 : 0;

  if (overduePercentage > 75) {
    score += 40;
    factors.push('More than 75% of balance is overdue');
  } else if (overduePercentage > 50) {
    score += 30;
    factors.push('More than 50% of balance is overdue');
  } else if (overduePercentage > 25) {
    score += 15;
    factors.push('Over 25% of balance is overdue');
  }

  if (agingData.days90 > 0) {
    score += 25;
    factors.push('Has amounts overdue more than 90 days');
  } else if (agingData.days60 > 0) {
    score += 15;
    factors.push('Has amounts overdue 60-90 days');
  } else if (agingData.days30 > 0) {
    score += 5;
    factors.push('Has amounts overdue 30-60 days');
  }

  if (creditLimit > 0 && agingData.total > creditLimit) {
    score += 20;
    factors.push('Exceeded credit limit');
  } else if (creditLimit > 0 && agingData.total > creditLimit * 0.9) {
    score += 10;
    factors.push('Near credit limit');
  }

  const avgDaysToPayment = calculateAverageDaysToPayment(paymentHistory);
  if (avgDaysToPayment > 60) {
    score += 15;
    factors.push('Historically slow payer (avg 60+ days)');
  } else if (avgDaysToPayment > 45) {
    score += 10;
    factors.push('Payment delays (avg 45+ days)');
  }

  if (agingData.total > 100000) {
    score += 10;
    factors.push('High value account requiring attention');
  }

  let rating: 'low' | 'medium' | 'high' | 'critical';
  let recommendation: string;

  if (score >= 70) {
    rating = 'critical';
    recommendation = 'Immediate action required. Consider legal escalation or placing account on hold.';
  } else if (score >= 45) {
    rating = 'high';
    recommendation = 'Urgent follow-up needed. Send firm reminder and escalate to management.';
  } else if (score >= 20) {
    rating = 'medium';
    recommendation = 'Monitor closely. Send payment reminder and schedule follow-up.';
  } else {
    rating = 'low';
    recommendation = 'Good payment behavior. Maintain regular monitoring.';
  }

  if (factors.length === 0) {
    factors.push('No risk factors identified');
  }

  return {
    score,
    rating,
    factors,
    recommendation
  };
};

export const calculatePriorityScore = (agingData: AgingData): number => {
  let score = 0;

  score += (agingData.days90 / agingData.total) * 50;
  score += (agingData.days60 / agingData.total) * 30;
  score += (agingData.days30 / agingData.total) * 20;

  score += Math.min((agingData.total / 10000) * 10, 30);

  return Math.min(Math.round(score), 100);
};

export const getAgingDistributionData = (agingData: AgingData[]) => {
  const totals = agingData.reduce((acc, item) => ({
    current: acc.current + item.current,
    days30: acc.days30 + item.days30,
    days60: acc.days60 + item.days60,
    days90: acc.days90 + item.days90,
  }), { current: 0, days30: 0, days60: 0, days90: 0 });

  return [
    { name: 'Current', value: totals.current, percentage: 0 },
    { name: '1-30 Days', value: totals.days30, percentage: 0 },
    { name: '31-60 Days', value: totals.days60, percentage: 0 },
    { name: '61-90+ Days', value: totals.days90, percentage: 0 },
  ].map(item => {
    const total = totals.current + totals.days30 + totals.days60 + totals.days90;
    return {
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    };
  });
};

export const getTopOverdueCustomers = (
  agingData: AgingData[],
  limit: number = 5
): AgingData[] => {
  return agingData
    .filter(item => item.overdue)
    .sort((a, b) => {
      const aTotalOverdue = a.days30 + a.days60 + a.days90;
      const bTotalOverdue = b.days30 + b.days60 + b.days90;
      return bTotalOverdue - aTotalOverdue;
    })
    .slice(0, limit);
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getRiskColor = (rating: 'low' | 'medium' | 'high' | 'critical'): string => {
  const colors = {
    low: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    high: 'text-orange-600 bg-orange-50',
    critical: 'text-red-600 bg-red-50'
  };
  return colors[rating];
};

export const getRiskBorderColor = (rating: 'low' | 'medium' | 'high' | 'critical'): string => {
  const colors = {
    low: 'border-green-200',
    medium: 'border-yellow-200',
    high: 'border-orange-200',
    critical: 'border-red-200'
  };
  return colors[rating];
};

export const getCollectionStageColor = (stage: string): string => {
  const colors: Record<string, string> = {
    current: 'bg-green-100 text-green-800',
    reminder: 'bg-blue-100 text-blue-800',
    follow_up: 'bg-yellow-100 text-yellow-800',
    escalated: 'bg-orange-100 text-orange-800',
    legal: 'bg-red-100 text-red-800',
    write_off: 'bg-gray-100 text-gray-800'
  };
  return colors[stage] || 'bg-gray-100 text-gray-800';
};
