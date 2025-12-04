export interface BalanceSheetRatios {
  liquidity: {
    currentRatio: number;
    quickRatio: number;
    cashRatio: number;
  };
  leverage: {
    debtToEquity: number;
    debtToAssets: number;
    equityMultiplier: number;
  };
  efficiency: {
    workingCapital: number;
    workingCapitalRatio: number;
  };
}

export interface RatioHealth {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  color: string;
  message: string;
}

export const calculateFinancialRatios = (
  totalAssets: number,
  currentAssets: number,
  fixedAssets: number,
  totalLiabilities: number,
  currentLiabilities: number,
  longTermLiabilities: number,
  totalEquity: number,
  cashAndEquivalents: number = 0
): BalanceSheetRatios => {
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 0;
  const quickAssets = currentAssets - (currentAssets * 0.3);
  const quickRatio = currentLiabilities > 0 ? quickAssets / currentLiabilities : 0;
  const cashRatio = currentLiabilities > 0 ? cashAndEquivalents / currentLiabilities : 0;

  const debtToEquity = totalEquity > 0 ? totalLiabilities / totalEquity : 0;
  const debtToAssets = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
  const equityMultiplier = totalEquity > 0 ? totalAssets / totalEquity : 0;

  const workingCapital = currentAssets - currentLiabilities;
  const workingCapitalRatio = currentAssets > 0 ? workingCapital / currentAssets : 0;

  return {
    liquidity: {
      currentRatio,
      quickRatio,
      cashRatio
    },
    leverage: {
      debtToEquity,
      debtToAssets,
      equityMultiplier
    },
    efficiency: {
      workingCapital,
      workingCapitalRatio
    }
  };
};

export const getCurrentRatioHealth = (ratio: number): RatioHealth => {
  if (ratio >= 2.0) return { status: 'excellent', color: 'green', message: 'Excellent liquidity position' };
  if (ratio >= 1.5) return { status: 'good', color: 'blue', message: 'Good liquidity position' };
  if (ratio >= 1.0) return { status: 'fair', color: 'yellow', message: 'Adequate liquidity' };
  if (ratio >= 0.5) return { status: 'poor', color: 'orange', message: 'Low liquidity - monitor closely' };
  return { status: 'critical', color: 'red', message: 'Critical liquidity issue' };
};

export const getQuickRatioHealth = (ratio: number): RatioHealth => {
  if (ratio >= 1.5) return { status: 'excellent', color: 'green', message: 'Excellent quick liquidity' };
  if (ratio >= 1.0) return { status: 'good', color: 'blue', message: 'Good quick liquidity' };
  if (ratio >= 0.7) return { status: 'fair', color: 'yellow', message: 'Adequate quick liquidity' };
  if (ratio >= 0.4) return { status: 'poor', color: 'orange', message: 'Low quick liquidity' };
  return { status: 'critical', color: 'red', message: 'Critical quick liquidity issue' };
};

export const getDebtToEquityHealth = (ratio: number): RatioHealth => {
  if (ratio <= 0.5) return { status: 'excellent', color: 'green', message: 'Very low leverage - conservative' };
  if (ratio <= 1.0) return { status: 'good', color: 'blue', message: 'Healthy leverage ratio' };
  if (ratio <= 2.0) return { status: 'fair', color: 'yellow', message: 'Moderate leverage' };
  if (ratio <= 3.0) return { status: 'poor', color: 'orange', message: 'High leverage - monitor risk' };
  return { status: 'critical', color: 'red', message: 'Excessive leverage - high risk' };
};

export const getDebtToAssetsHealth = (ratio: number): RatioHealth => {
  if (ratio <= 0.3) return { status: 'excellent', color: 'green', message: 'Very low debt burden' };
  if (ratio <= 0.5) return { status: 'good', color: 'blue', message: 'Healthy debt level' };
  if (ratio <= 0.7) return { status: 'fair', color: 'yellow', message: 'Moderate debt level' };
  if (ratio <= 0.85) return { status: 'poor', color: 'orange', message: 'High debt burden' };
  return { status: 'critical', color: 'red', message: 'Excessive debt - financial distress risk' };
};

export const getWorkingCapitalHealth = (workingCapital: number, currentAssets: number): RatioHealth => {
  const ratio = currentAssets > 0 ? workingCapital / currentAssets : 0;

  if (ratio >= 0.4) return { status: 'excellent', color: 'green', message: 'Strong working capital position' };
  if (ratio >= 0.2) return { status: 'good', color: 'blue', message: 'Healthy working capital' };
  if (ratio >= 0.1) return { status: 'fair', color: 'yellow', message: 'Adequate working capital' };
  if (ratio >= 0) return { status: 'poor', color: 'orange', message: 'Low working capital' };
  return { status: 'critical', color: 'red', message: 'Negative working capital - immediate attention needed' };
};

export const calculateOverallHealthScore = (ratios: BalanceSheetRatios): number => {
  let score = 0;

  const currentRatioHealth = getCurrentRatioHealth(ratios.liquidity.currentRatio);
  const quickRatioHealth = getQuickRatioHealth(ratios.liquidity.quickRatio);
  const debtToEquityHealth = getDebtToEquityHealth(ratios.leverage.debtToEquity);
  const debtToAssetsHealth = getDebtToAssetsHealth(ratios.leverage.debtToAssets);
  const workingCapitalHealth = getWorkingCapitalHealth(ratios.efficiency.workingCapital, ratios.efficiency.workingCapital + 1000);

  const healthScores = {
    excellent: 100,
    good: 75,
    fair: 50,
    poor: 25,
    critical: 0
  };

  score += healthScores[currentRatioHealth.status] * 0.25;
  score += healthScores[quickRatioHealth.status] * 0.20;
  score += healthScores[debtToEquityHealth.status] * 0.25;
  score += healthScores[debtToAssetsHealth.status] * 0.20;
  score += healthScores[workingCapitalHealth.status] * 0.10;

  return Math.round(score);
};

export const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'blue';
  if (score >= 40) return 'yellow';
  if (score >= 20) return 'orange';
  return 'red';
};

export const getHealthScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Critical';
};

export const formatRatio = (ratio: number, decimals: number = 2): string => {
  return ratio.toFixed(decimals);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};
