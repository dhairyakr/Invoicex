import React, { useState, useEffect } from 'react';
import { Building2, Plus, RefreshCw, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, getAccounts, ensureAccountsExist } from '../../lib/supabase';

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype: string;
  balance: number;
  is_active: boolean;
}

const AccountManagement: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [initializingAccounts, setInitializingAccounts] = useState(false);

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const loadAccounts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('code');

      if (err) throw err;

      if (!data || data.length === 0) {
        setError('No accounts found. Click "Initialize Accounts" to create default accounts.');
      } else {
        setAccounts(data as Account[]);
      }
    } catch (err: any) {
      setError('Failed to load accounts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeAccounts = async () => {
    if (!user) return;

    try {
      setInitializingAccounts(true);
      setError(null);

      const { initialized, error: initError } = await ensureAccountsExist(user.id);

      if (initError) throw new Error(initError);

      if (initialized) {
        await loadAccounts();
      } else {
        setError('Accounts already exist.');
      }
    } catch (err: any) {
      setError('Failed to initialize accounts: ' + err.message);
    } finally {
      setInitializingAccounts(false);
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'text-green-600 bg-green-50';
      case 'liability': return 'text-red-600 bg-red-50';
      case 'equity': return 'text-blue-600 bg-blue-50';
      case 'revenue': return 'text-purple-600 bg-purple-50';
      case 'expense': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const groupedAccounts = accounts.reduce((acc, account) => {
    if (!showInactive && !account.is_active) return acc;

    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  const totalsByType = Object.entries(groupedAccounts).map(([type, accs]) => ({
    type,
    total: accs.reduce((sum, acc) => sum + (acc.balance || 0), 0),
    count: accs.length
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chart of Accounts</h2>
            <p className="text-sm text-gray-600">Manage your account structure</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInactive(!showInactive)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showInactive ? 'Hide' : 'Show'} Inactive
          </button>

          <button
            onClick={loadAccounts}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          {accounts.length === 0 && (
            <button
              onClick={handleInitializeAccounts}
              disabled={initializingAccounts}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:opacity-50"
            >
              {initializingAccounts ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Initialize Accounts
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">Notice</p>
            <p className="text-sm text-yellow-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {accounts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {totalsByType.map(({ type, total, count }) => (
              <div key={type} className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 shadow-lg">
                <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold ${getAccountTypeColor(type)} mb-2`}>
                  {type.toUpperCase()}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                <div className="text-sm text-gray-600">
                  Balance: {formatCurrency(total)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
              <div key={type} className="bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                <div className={`px-6 py-4 border-b border-gray-200 ${getAccountTypeColor(type)}`}>
                  <h3 className="text-lg font-bold capitalize">{type} Accounts</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Account Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Subtype
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Balance
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {typeAccounts.map((account) => (
                        <tr key={account.id} className={`hover:bg-gray-50/50 ${!account.is_active ? 'opacity-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                            {account.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {account.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {account.subtype || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            {formatCurrency(account.balance || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {account.is_active ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AccountManagement;
