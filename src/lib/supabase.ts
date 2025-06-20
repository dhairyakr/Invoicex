import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced error checking for environment variables
if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
  console.error('❌ VITE_SUPABASE_URL is missing or not configured properly in .env file')
  console.log('📝 Please update your .env file with your actual Supabase project URL')
  console.log('🔗 Get it from: https://supabase.com/dashboard → Your Project → Settings → API')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key' || supabaseAnonKey === 'your_supabase_anon_key_here') {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing or not configured properly in .env file')
  console.log('📝 Please update your .env file with your actual Supabase anon key')
  console.log('🔗 Get it from: https://supabase.com/dashboard → Your Project → Settings → API')
}

if (!supabaseUrl || !supabaseAnonKey || 
    supabaseUrl === 'your_supabase_project_url' || 
    supabaseAnonKey === 'your_supabase_anon_key' ||
    supabaseAnonKey === 'your_supabase_anon_key_here') {
  throw new Error('Missing or invalid Supabase environment variables. Please check your .env file and restart the dev server.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Clear invalid session data
export const clearInvalidSession = async () => {
  try {
    // Clear local storage items related to Supabase auth
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sb-') || key.includes('supabase')) {
        localStorage.removeItem(key);
      }
    });
    
    // Sign out to clear any remaining session state
    await supabase.auth.signOut();
    
    console.log('✅ Cleared invalid session data');
  } catch (error) {
    console.warn('⚠️ Error clearing session data:', error);
  }
}

// Test connection function
export const testConnection = async () => {
  try {
    // First check if we can reach Supabase at all
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      
      // Provide more specific error messages
      if (error.message.includes('Failed to fetch')) {
        return { success: false, error: 'Unable to reach Supabase. Please check your internet connection and Supabase URL.' }
      } else if (error.message.includes('Invalid API key')) {
        return { success: false, error: 'Invalid Supabase API key. Please check your VITE_SUPABASE_ANON_KEY in .env file.' }
      } else if (error.message.includes('Project not found')) {
        return { success: false, error: 'Supabase project not found. Please check your VITE_SUPABASE_URL in .env file.' }
      } else if (error.message.includes('relation "users" does not exist')) {
        return { success: false, error: 'Database tables not found. Please run the SQL schema in your Supabase dashboard.' }
      } else {
        return { success: false, error: `Database error: ${error.message}` }
      }
    }
    
    console.log('✅ Supabase connection successful')
    return { success: true }
  } catch (err: any) {
    console.error('Supabase connection test failed:', err)
    
    if (err.message?.includes('fetch')) {
      return { success: false, error: 'Network error: Unable to connect to Supabase. Please check your internet connection.' }
    }
    
    return { success: false, error: err.message || 'Unknown connection error' }
  }
}

// Auth functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  })
}

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  
  // Handle the case where the session is already invalidated
  if (error && error.message?.includes('session_not_found')) {
    console.warn('Session already invalidated on server side - user is effectively logged out')
    return { error: null } // Return success since user is already logged out
  }
  
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ==========================================
// ACCOUNTING MODULE FUNCTIONS
// ==========================================

// ==========================================
// ACCOUNTS FUNCTIONS
// ==========================================

export const createAccount = async (accountData: Database['public']['Tables']['accounts']['Insert']) => {
  return await supabase
    .from('accounts')
    .insert(accountData)
    .select()
    .single()
}

export const getAccounts = async (userId: string) => {
  return await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('code', { ascending: true })
}

export const getAccountsByGroup = async (userId: string, groupType: string) => {
  return await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('group_type', groupType)
    .eq('is_active', true)
    .order('name', { ascending: true })
}

export const updateAccount = async (id: string, updates: Database['public']['Tables']['accounts']['Update']) => {
  return await supabase
    .from('accounts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export const deleteAccount = async (id: string) => {
  return await supabase
    .from('accounts')
    .delete()
    .eq('id', id)
}

export const getAccountBalance = async (accountId: string, asOfDate?: string) => {
  return await supabase.rpc('fn_get_account_balance', {
    p_account_id: accountId,
    p_as_of_date: asOfDate || new Date().toISOString().split('T')[0]
  })
}

// ==========================================
// VOUCHERS FUNCTIONS
// ==========================================

export const createVoucher = async (voucherData: {
  voucher: Database['public']['Tables']['vouchers']['Insert'],
  entries: Database['public']['Tables']['voucher_entries']['Insert'][],
  gstDetails?: Database['public']['Tables']['gst_details']['Insert'][]
}) => {
  const { voucher, entries, gstDetails } = voucherData

  // Start a transaction
  const { data: voucherResult, error: voucherError } = await supabase
    .from('vouchers')
    .insert(voucher)
    .select()
    .single()

  if (voucherError) return { data: null, error: voucherError }

  // Insert voucher entries
  const entriesWithVoucherId = entries.map(entry => ({
    ...entry,
    voucher_id: voucherResult.id
  }))

  const { data: entriesResult, error: entriesError } = await supabase
    .from('voucher_entries')
    .insert(entriesWithVoucherId)
    .select()

  if (entriesError) {
    // Rollback voucher if entries fail
    await supabase.from('vouchers').delete().eq('id', voucherResult.id)
    return { data: null, error: entriesError }
  }

  // Insert GST details if provided
  let gstResult = null
  if (gstDetails && gstDetails.length > 0) {
    const gstDetailsWithVoucherId = gstDetails.map(gst => ({
      ...gst,
      voucher_id: voucherResult.id
    }))

    const { data: gstData, error: gstError } = await supabase
      .from('gst_details')
      .insert(gstDetailsWithVoucherId)
      .select()

    if (gstError) {
      // Rollback voucher and entries if GST details fail
      await supabase.from('voucher_entries').delete().eq('voucher_id', voucherResult.id)
      await supabase.from('vouchers').delete().eq('id', voucherResult.id)
      return { data: null, error: gstError }
    }

    gstResult = gstData
  }

  return {
    data: {
      voucher: voucherResult,
      entries: entriesResult,
      gstDetails: gstResult
    },
    error: null
  }
}

export const getVouchers = async (userId: string, filters?: {
  voucherType?: string,
  dateFrom?: string,
  dateTo?: string,
  status?: string
}) => {
  let query = supabase
    .from('vouchers')
    .select(`
      *,
      voucher_entries (*),
      gst_details (*)
    `)
    .eq('user_id', userId)
    .order('voucher_date', { ascending: false })

  if (filters?.voucherType) {
    query = query.eq('voucher_type', filters.voucherType)
  }

  if (filters?.dateFrom) {
    query = query.gte('voucher_date', filters.dateFrom)
  }

  if (filters?.dateTo) {
    query = query.lte('voucher_date', filters.dateTo)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  return await query
}

export const getVoucherById = async (id: string) => {
  return await supabase
    .from('vouchers')
    .select(`
      *,
      voucher_entries (*),
      gst_details (*)
    `)
    .eq('id', id)
    .single()
}

export const updateVoucher = async (id: string, voucherData: {
  voucher: Database['public']['Tables']['vouchers']['Update'],
  entries?: Database['public']['Tables']['voucher_entries']['Insert'][],
  gstDetails?: Database['public']['Tables']['gst_details']['Insert'][]
}) => {
  const { voucher, entries, gstDetails } = voucherData

  // Update voucher
  const { data: voucherResult, error: voucherError } = await supabase
    .from('vouchers')
    .update(voucher)
    .eq('id', id)
    .select()
    .single()

  if (voucherError) return { data: null, error: voucherError }

  // If entries are provided, replace existing entries
  if (entries) {
    // Delete existing entries
    await supabase.from('voucher_entries').delete().eq('voucher_id', id)

    // Insert new entries
    const entriesWithVoucherId = entries.map(entry => ({
      ...entry,
      voucher_id: id
    }))

    const { data: entriesResult, error: entriesError } = await supabase
      .from('voucher_entries')
      .insert(entriesWithVoucherId)
      .select()

    if (entriesError) return { data: null, error: entriesError }
  }

  // If GST details are provided, replace existing GST details
  if (gstDetails) {
    // Delete existing GST details
    await supabase.from('gst_details').delete().eq('voucher_id', id)

    // Insert new GST details
    const gstDetailsWithVoucherId = gstDetails.map(gst => ({
      ...gst,
      voucher_id: id
    }))

    const { data: gstResult, error: gstError } = await supabase
      .from('gst_details')
      .insert(gstDetailsWithVoucherId)
      .select()

    if (gstError) return { data: null, error: gstError }
  }

  return { data: voucherResult, error: null }
}

export const deleteVoucher = async (id: string) => {
  // Delete related records first (cascade should handle this, but being explicit)
  await supabase.from('gst_details').delete().eq('voucher_id', id)
  await supabase.from('voucher_entries').delete().eq('voucher_id', id)
  
  return await supabase
    .from('vouchers')
    .delete()
    .eq('id', id)
}

// ==========================================
// COST CENTERS FUNCTIONS
// ==========================================

export const createCostCenter = async (costCenterData: Database['public']['Tables']['cost_centers']['Insert']) => {
  return await supabase
    .from('cost_centers')
    .insert(costCenterData)
    .select()
    .single()
}

export const getCostCenters = async (userId: string) => {
  return await supabase
    .from('cost_centers')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('name', { ascending: true })
}

export const updateCostCenter = async (id: string, updates: Database['public']['Tables']['cost_centers']['Update']) => {
  return await supabase
    .from('cost_centers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export const deleteCostCenter = async (id: string) => {
  return await supabase
    .from('cost_centers')
    .delete()
    .eq('id', id)
}

// ==========================================
// EXCHANGE RATES FUNCTIONS
// ==========================================

export const createExchangeRate = async (rateData: Database['public']['Tables']['exchange_rates']['Insert']) => {
  return await supabase
    .from('exchange_rates')
    .insert(rateData)
    .select()
    .single()
}

export const getExchangeRates = async (currencyCode?: string, date?: string) => {
  let query = supabase
    .from('exchange_rates')
    .select('*')
    .order('effective_date', { ascending: false })

  if (currencyCode) {
    query = query.eq('from_currency', currencyCode)
  }

  if (date) {
    query = query.lte('effective_date', date)
  }

  return await query
}

export const updateExchangeRate = async (id: string, updates: Database['public']['Tables']['exchange_rates']['Update']) => {
  return await supabase
    .from('exchange_rates')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export const deleteExchangeRate = async (id: string) => {
  return await supabase
    .from('exchange_rates')
    .delete()
    .eq('id', id)
}

// ==========================================
// BANK RECONCILIATION FUNCTIONS
// ==========================================

export const createBankReconciliation = async (reconciliationData: Database['public']['Tables']['bank_reconciliation']['Insert']) => {
  return await supabase
    .from('bank_reconciliation')
    .insert(reconciliationData)
    .select()
    .single()
}

export const getBankReconciliations = async (userId: string, accountId?: string) => {
  let query = supabase
    .from('bank_reconciliation')
    .select('*')
    .eq('user_id', userId)
    .order('bank_date', { ascending: false })

  if (accountId) {
    query = query.eq('account_id', accountId)
  }

  return await query
}

export const updateBankReconciliation = async (id: string, updates: Database['public']['Tables']['bank_reconciliation']['Update']) => {
  return await supabase
    .from('bank_reconciliation')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

// ==========================================
// BUDGETS FUNCTIONS
// ==========================================

export const createBudget = async (budgetData: Database['public']['Tables']['budgets']['Insert']) => {
  return await supabase
    .from('budgets')
    .insert(budgetData)
    .select()
    .single()
}

export const getBudgets = async (userId: string, fiscalYear?: string) => {
  let query = supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('fiscal_year', { ascending: false })

  if (fiscalYear) {
    query = query.eq('fiscal_year', fiscalYear)
  }

  return await query
}

export const updateBudget = async (id: string, updates: Database['public']['Tables']['budgets']['Update']) => {
  return await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export const deleteBudget = async (id: string) => {
  return await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
}

// ==========================================
// RPC (Remote Procedure Call) FUNCTIONS
// ==========================================

export const generateVoucherNumber = async (voucherType: string, voucherDate: string) => {
  return await supabase.rpc('fn_generate_voucher_number', {
    p_voucher_type: voucherType,
    p_voucher_date: voucherDate
  })
}

export const calculateGst = async (taxableValue: number, taxRate: number, stateCode?: string) => {
  return await supabase.rpc('fn_calculate_gst', {
    p_taxable_value: taxableValue,
    p_tax_rate: taxRate,
    p_state_code: stateCode
  })
}

export const getExchangeRate = async (fromCurrency: string, toCurrency: string, date: string) => {
  return await supabase.rpc('fn_get_exchange_rate', {
    p_from_currency: fromCurrency,
    p_to_currency: toCurrency,
    p_date: date
  })
}

export const getTrialBalance = async (userId: string, asOfDate: string, includeZeroBalances: boolean = false) => {
  return await supabase.rpc('fn_get_trial_balance', {
    p_user_id: userId,
    p_as_of_date: asOfDate,
    p_include_zero_balances: includeZeroBalances
  })
}

export const getProfitLoss = async (userId: string, fromDate: string, toDate: string) => {
  return await supabase.rpc('fn_get_profit_loss', {
    p_user_id: userId,
    p_from_date: fromDate,
    p_to_date: toDate
  })
}

export const getBalanceSheet = async (userId: string, asOfDate: string) => {
  return await supabase.rpc('fn_get_balance_sheet', {
    p_user_id: userId,
    p_as_of_date: asOfDate
  })
}

export const getCashBook = async (userId: string, accountId: string, fromDate: string, toDate: string) => {
  return await supabase.rpc('fn_get_cash_book', {
    p_user_id: userId,
    p_account_id: accountId,
    p_from_date: fromDate,
    p_to_date: toDate
  })
}

export const getLedgerReport = async (userId: string, accountId: string, fromDate: string, toDate: string) => {
  return await supabase.rpc('fn_get_ledger_report', {
    p_user_id: userId,
    p_account_id: accountId,
    p_from_date: fromDate,
    p_to_date: toDate
  })
}

export const getDayBook = async (userId: string, fromDate: string, toDate: string) => {
  return await supabase.rpc('fn_get_day_book', {
    p_user_id: userId,
    p_from_date: fromDate,
    p_to_date: toDate
  })
}

export const getGstrReport = async (userId: string, reportType: string, month: number, year: number) => {
  return await supabase.rpc('fn_get_gstr_report', {
    p_user_id: userId,
    p_report_type: reportType,
    p_month: month,
    p_year: year
  })
}

export const getCostCenterReport = async (userId: string, costCenterId: string, fromDate: string, toDate: string) => {
  return await supabase.rpc('fn_get_cost_center_report', {
    p_user_id: userId,
    p_cost_center_id: costCenterId,
    p_from_date: fromDate,
    p_to_date: toDate
  })
}

// ==========================================
// EXISTING INVOICE FUNCTIONS (PRESERVED)
// ==========================================

export const getInvoices = async (userId: string) => {
  return await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items (*),
      tax_rates (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export const createInvoice = async (invoice: any) => {
  return await supabase
    .from('invoices')
    .insert(invoice)
    .select()
    .single()
}

export const updateInvoice = async (id: string, updates: any) => {
  return await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export const deleteInvoice = async (id: string) => {
  return await supabase
    .from('invoices')
    .delete()
    .eq('id', id)
}

// Real-time subscription
export const subscribeToInvoices = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('invoices')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'invoices',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

// Real-time subscriptions for accounting tables
export const subscribeToVouchers = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('vouchers')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'vouchers',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export const subscribeToAccounts = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('accounts')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'accounts',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}