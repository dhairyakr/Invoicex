import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getProfitLossData, 
  getBalanceSheetData, 
  getCashFlowData, 
  getTrialBalanceData, 
  getAgedReceivables 
} from '../lib/supabase';

export const useFinancialData = (
  reportType: 'profit-loss' | 'balance-sheet' | 'cash-flow' | 'trial-balance' | 'aged-receivables',
  dateRange: { start: string; end: string },
  viewPeriod: 'monthly' | 'quarterly' | 'yearly',
  department?: string
) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let result;
        
        switch (reportType) {
          case 'profit-loss':
            result = await getProfitLossData(user.id, dateRange.start, dateRange.end);
            break;
          case 'balance-sheet':
            result = await getBalanceSheetData(user.id, dateRange.end);
            break;
          case 'cash-flow':
            result = await getCashFlowData(user.id, dateRange.start, dateRange.end);
            break;
          case 'trial-balance':
            result = await getTrialBalanceData(user.id, dateRange.end);
            break;
          case 'aged-receivables':
            result = await getAgedReceivables(user.id, dateRange.end);
            break;
          default:
            throw new Error('Invalid report type');
        }

        if (result.error) {
          setError(result.error);
        } else {
          setData(result.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, reportType, dateRange.start, dateRange.end, viewPeriod, department]);

  const refetch = () => {
    if (user) {
      setLoading(true);
      setError(null);
      // Re-trigger the effect by updating a dependency
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};

// Hook for real-time financial metrics
export const useFinancialMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    cashBalance: 0,
    outstandingReceivables: 0,
    overdueReceivables: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!user) return;

      setLoading(true);
      
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];

        // Load all financial data
        const [plResult, bsResult, receivablesResult] = await Promise.all([
          getProfitLossData(user.id, startOfYear, currentDate),
          getBalanceSheetData(user.id, currentDate),
          getAgedReceivables(user.id, currentDate)
        ]);

        const newMetrics = {
          totalRevenue: plResult.data?.totalRevenue || 0,
          totalExpenses: plResult.data?.totalExpenses || 0,
          netProfit: plResult.data?.netProfit || 0,
          totalAssets: bsResult.data?.totalAssets || 0,
          totalLiabilities: bsResult.data?.totalLiabilities || 0,
          cashBalance: bsResult.data?.assets?.find((acc: any) => acc.code === '1000')?.balance || 0,
          outstandingReceivables: receivablesResult.data?.reduce((sum: number, item: any) => sum + item.total_amount, 0) || 0,
          overdueReceivables: receivablesResult.data?.reduce((sum: number, item: any) => sum + (item.days_30 + item.days_60 + item.days_90), 0) || 0
        };

        setMetrics(newMetrics);
      } catch (error) {
        console.error('Error loading financial metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [user]);

  return { metrics, loading };
};