import React, { useState, useEffect } from 'react';
import { Building, ChevronDown, ChevronRight, DollarSign, TrendingUp, Layers, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getBalanceSheetData } from '../../lib/supabase';

interface BalanceSheetProps {
  dateRange: { start: string; end: string };
  viewPeriod: 'monthly' | 'quarterly' | 'yearly';
  department: string;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({ dateRange, viewPeriod, department }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['assets', 'current-assets', 'liabilities', 'current-liabilities', 'equity']);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      const result = await getBalanceSheetData(user.id, dateRange.end);
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
      
      setLoading(false);
    };

    loadData();
  }, [user, dateRange.end, viewPeriod, department]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderBalanceSheetSection = (
    section: BalanceSheetItem, 
    sectionId: string, 
    level: number = 0,
    colorScheme: string
  ) => {
    const isExpanded = expandedSections.includes(sectionId);
    const hasChildren = section.children && section.children.length > 0;
    
    return (
      <div key={sectionId}>
        <div 
          className={`group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-300 cursor-pointer ${
            level === 0 ? 'bg-gradient-to-r from-gray-50/40 to-blue-50/40 font-bold border-b border-white/30' : ''
          }`}
          style={{ paddingLeft: `${level * 2 + 1}rem` }}
          onClick={() => hasChildren && toggleSection(sectionId)}
        >
          <div className="flex items-center">
            {hasChildren && (
              <button className="mr-3 p-1 rounded-lg hover:bg-white/30 transition-colors">
                {isExpanded ? (
                  <ChevronDown size={16} className="text-gray-600" />
                ) : (
                  <ChevronRight size={16} className="text-gray-600" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6 mr-3"></div>}
            
            <div className="flex items-center">
              {level === 0 && (
                <div className={`w-3 h-3 rounded-full mr-3 bg-gradient-to-r ${colorScheme}`}></div>
              )}
              <span className={`${level === 0 ? 'text-lg font-bold' : level === 1 ? 'font-semibold' : ''} text-gray-900 group-hover:text-blue-600 transition-colors`}>
                {section.name}
              </span>
            </div>
          </div>
          
          <div className={`${level === 0 ? 'text-xl font-bold' : 'font-semibold'} text-gray-900`}>
            {formatCurrency(section.amount)}
          </div>
        </div>
        
        {hasChildren && isExpanded && section.children?.map((child, index) => 
          renderBalanceSheetSection(
            child, 
            `${sectionId}-${index}`, 
            level + 1,
            colorScheme
          )
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50/60 backdrop-blur-md border border-red-200/50 rounded-2xl p-8 text-center">
        <div className="text-red-600 mb-4">
          <Building size={48} className="mx-auto mb-4" />
          <h3 className="text-xl font-bold">Error Loading Balance Sheet</h3>
          <p className="text-sm mt-2">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const totalAssets = data.totalAssets;
  const totalLiabilitiesAndEquity = data.totalLiabilities + data.totalEquity;
  const isBalanced = totalAssets === totalLiabilitiesAndEquity;

  // Group accounts by subtype for hierarchical display
  const currentAssets = data.assets.filter((acc: any) => acc.subtype === 'current');
  const fixedAssets = data.assets.filter((acc: any) => acc.subtype === 'fixed');
  const currentLiabilities = data.liabilities.filter((acc: any) => acc.subtype === 'current');
  const longTermLiabilities = data.liabilities.filter((acc: any) => acc.subtype === 'long-term');

  const balanceSheetData = {
    assets: {
      name: 'Total Assets',
      amount: totalAssets,
      children: [
        {
          name: 'Current Assets',
          amount: currentAssets.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0),
          children: currentAssets.map((acc: any) => ({ name: acc.name, amount: Math.abs(acc.balance) }))
        },
        {
          name: 'Fixed Assets',
          amount: fixedAssets.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0),
          children: fixedAssets.map((acc: any) => ({ name: acc.name, amount: Math.abs(acc.balance) }))
        }
      ]
    },
    liabilities: {
      name: 'Total Liabilities',
      amount: data.totalLiabilities,
      children: [
        {
          name: 'Current Liabilities',
          amount: currentLiabilities.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0),
          children: currentLiabilities.map((acc: any) => ({ name: acc.name, amount: Math.abs(acc.balance) }))
        },
        {
          name: 'Long-term Liabilities',
          amount: longTermLiabilities.reduce((sum: number, acc: any) => sum + Math.abs(acc.balance), 0),
          children: longTermLiabilities.map((acc: any) => ({ name: acc.name, amount: Math.abs(acc.balance) }))
        }
      ]
    },
    equity: {
      name: 'Total Equity',
      amount: data.totalEquity,
      children: data.equity.map((acc: any) => ({ name: acc.name, amount: Math.abs(acc.balance) }))
    }
  };

  return (
    <div className="space-y-8">
      {/* Balance Sheet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Assets */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Assets</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(totalAssets)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/80 to-indigo-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <Building className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Liabilities */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-red-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Liabilities</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(data.totalLiabilities)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Total Equity */}
        <div className="group relative bg-white/40 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-gray-500/20 border border-white/50 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 transform hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider mb-2">Total Equity</p>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(data.totalEquity)}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/80 to-emerald-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Verification */}
      <div className={`relative backdrop-blur-md rounded-2xl p-6 border shadow-lg ${
        isBalanced 
          ? 'bg-green-50/60 border-green-200/50' 
          : 'bg-red-50/60 border-red-200/50'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-2xl"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
              isBalanced ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isBalanced ? (
                <TrendingUp className="w-5 h-5 text-white" />
              ) : (
                <Shield className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isBalanced ? 'text-green-800' : 'text-red-800'}`}>
                Balance Sheet {isBalanced ? 'Balanced' : 'Imbalanced'}
              </h3>
              <p className={`text-sm ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                {isBalanced 
                  ? 'Assets equal Liabilities + Equity' 
                  : `Difference: ${formatCurrency(Math.abs(totalAssets - totalLiabilitiesAndEquity))}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Assets = Liabilities + Equity</div>
            <div className="font-bold text-lg text-gray-900">
              {formatCurrency(totalAssets)} = {formatCurrency(totalLiabilitiesAndEquity)}
            </div>
          </div>
        </div>
      </div>

      {/* Balance Sheet Table */}
      <div className="relative bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl shadow-gray-500/20 border border-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10 rounded-3xl"></div>
        
        {/* Table Header */}
        <div className="relative bg-gradient-to-r from-gray-50/60 to-blue-50/60 backdrop-blur-sm p-6 border-b border-white/30">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Balance Sheet</h3>
            </div>
            <div className="text-sm text-gray-600">
              As of {new Date(dateRange.end).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="relative z-10">
          {/* Assets Section */}
          <div className="border-b border-white/30">
            {renderBalanceSheetSection(balanceSheetData.assets, 'assets', 0, 'from-blue-500 to-indigo-500')}
          </div>

          {/* Liabilities Section */}
          <div className="border-b border-white/30">
            {renderBalanceSheetSection(balanceSheetData.liabilities, 'liabilities', 0, 'from-red-500 to-pink-500')}
          </div>

          {/* Equity Section */}
          <div>
            {renderBalanceSheetSection(balanceSheetData.equity, 'equity', 0, 'from-green-500 to-emerald-500')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;