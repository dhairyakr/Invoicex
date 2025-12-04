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

// Auth functions with enhanced error handling
export const signUp = async (email: string, password: string) => {
  try {
    console.log('🔐 Supabase signUp called for:', email);
    
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`
      }
    });
    
    console.log('📝 Supabase signUp result:', {
      user: result.data.user ? 'User created' : 'No user',
      session: result.data.session ? 'Session created' : 'No session',
      error: result.error?.message || 'No error'
    });
    
    return result;
  } catch (err: any) {
    console.error('❌ Supabase signUp error:', err);
    return {
      data: { user: null, session: null },
      error: { message: err.message || 'Unknown sign up error' }
    };
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Supabase signIn called for:', email);
    
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('📝 Supabase signIn result:', {
      user: result.data.user ? 'User found' : 'No user',
      session: result.data.session ? 'Session created' : 'No session',
      error: result.error?.message || 'No error'
    });
    
    return result;
  } catch (err: any) {
    console.error('❌ Supabase signIn error:', err);
    return {
      data: { user: null, session: null },
      error: { message: err.message || 'Unknown sign in error' }
    };
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    // Handle the case where the session is already invalidated
    if (error && (error.message?.includes('session_not_found') || error.message?.includes('Invalid Refresh Token'))) {
      console.warn('Session already invalidated on server side - user is effectively logged out')
      // Clear local session data when server reports session doesn't exist
      await clearInvalidSession()
      return { error: null } // Return success since user is already logged out
    }
    
    return { error }
  } catch (err: any) {
    // Handle cases where Supabase throws an error instead of returning it
    if (err.message?.includes('session_not_found') || err.message?.includes('Invalid Refresh Token')) {
      console.warn('Session already invalidated on server side - user is effectively logged out')
      // Clear local session data when server reports session doesn't exist
      await clearInvalidSession()
      return { error: null } // Return success since user is already logged out
    }
    
    console.error('❌ Supabase signOut error:', err);
    return { error: { message: err.message || 'Unknown sign out error' } }
  }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Invoice functions
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

// Financial Reports Functions
export const getAccounts = async (userId: string) => {
  return await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('code')
}

export const getTransactions = async (userId: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('transactions')
    .select(`
      *,
      debit_account:debit_account_id(code, name, type),
      credit_account:credit_account_id(code, name, type)
    `)
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false })

  if (startDate) {
    query = query.gte('transaction_date', startDate)
  }
  if (endDate) {
    query = query.lte('transaction_date', endDate)
  }

  return await query
}

export const getProfitLossData = async (userId: string, startDate: string, endDate: string) => {
  try {
    // Get all accounts
    const { data: accounts, error: accountsError } = await getAccounts(userId)
    if (accountsError) throw accountsError

    // Get transactions for the period
    const { data: transactions, error: transactionsError } = await getTransactions(userId, startDate, endDate)
    if (transactionsError) throw transactionsError

    // Calculate balances for each account
    const accountBalances = new Map()
    
    accounts?.forEach(account => {
      accountBalances.set(account.id, {
        ...account,
        balance: 0,
        transactions: []
      })
    })

    // Process transactions
    transactions?.forEach(transaction => {
      const debitAccount = accountBalances.get(transaction.debit_account_id)
      const creditAccount = accountBalances.get(transaction.credit_account_id)

      if (debitAccount) {
        if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
          debitAccount.balance += transaction.amount
        } else {
          debitAccount.balance -= transaction.amount
        }
        debitAccount.transactions.push({ ...transaction, type: 'debit' })
      }

      if (creditAccount) {
        if (creditAccount.type === 'asset' || creditAccount.type === 'expense') {
          creditAccount.balance -= transaction.amount
        } else {
          creditAccount.balance += transaction.amount
        }
        creditAccount.transactions.push({ ...transaction, type: 'credit' })
      }
    })

    // Separate into revenue and expense accounts
    const revenueAccounts = Array.from(accountBalances.values()).filter(acc => acc.type === 'revenue')
    const expenseAccounts = Array.from(accountBalances.values()).filter(acc => acc.type === 'expense')

    const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
    const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
    const netProfit = totalRevenue - totalExpenses

    return {
      data: {
        totalRevenue,
        totalExpenses,
        netProfit,
        revenueAccounts,
        expenseAccounts,
        accounts: Array.from(accountBalances.values())
      },
      error: null
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getBalanceSheetData = async (userId: string, asOfDate: string) => {
  try {
    const { data: accounts, error: accountsError } = await getAccounts(userId)
    if (accountsError) throw accountsError

    const { data: transactions, error: transactionsError } = await getTransactions(userId, undefined, asOfDate)
    if (transactionsError) throw transactionsError

    // Calculate balances
    const accountBalances = new Map()
    
    accounts?.forEach(account => {
      accountBalances.set(account.id, { ...account, balance: 0 })
    })

    transactions?.forEach(transaction => {
      const debitAccount = accountBalances.get(transaction.debit_account_id)
      const creditAccount = accountBalances.get(transaction.credit_account_id)

      if (debitAccount) {
        if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
          debitAccount.balance += transaction.amount
        } else {
          debitAccount.balance -= transaction.amount
        }
      }

      if (creditAccount) {
        if (creditAccount.type === 'asset' || creditAccount.type === 'expense') {
          creditAccount.balance -= transaction.amount
        } else {
          creditAccount.balance += transaction.amount
        }
      }
    })

    const assets = Array.from(accountBalances.values()).filter(acc => acc.type === 'asset')
    const liabilities = Array.from(accountBalances.values()).filter(acc => acc.type === 'liability')
    const equity = Array.from(accountBalances.values()).filter(acc => acc.type === 'equity')

    const totalAssets = assets.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)
    const totalEquity = equity.reduce((sum, acc) => sum + Math.abs(acc.balance), 0)

    return {
      data: {
        assets,
        liabilities,
        equity,
        totalAssets,
        totalLiabilities,
        totalEquity
      },
      error: null
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getCashFlowData = async (userId: string, startDate: string, endDate: string) => {
  try {
    const { data: transactions, error } = await getTransactions(userId, startDate, endDate)
    if (error) throw error

    // Get cash account
    const { data: cashAccount } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('code', '1000')
      .single()

    if (!cashAccount) {
      throw new Error('Cash account not found')
    }

    // Calculate opening balance
    const { data: openingTransactions } = await getTransactions(userId, undefined, startDate)
    let openingBalance = 0
    
    openingTransactions?.forEach(transaction => {
      if (transaction.debit_account_id === cashAccount.id) {
        openingBalance += transaction.amount
      }
      if (transaction.credit_account_id === cashAccount.id) {
        openingBalance -= transaction.amount
      }
    })

    // Categorize cash flows
    const operating: any[] = []
    const investing: any[] = []
    const financing: any[] = []

    let netCashFlow = 0

    transactions?.forEach(transaction => {
      if (transaction.debit_account_id === cashAccount.id || transaction.credit_account_id === cashAccount.id) {
        const amount = transaction.debit_account_id === cashAccount.id ? transaction.amount : -transaction.amount
        netCashFlow += amount

        // Categorize based on account codes (simplified logic)
        const otherAccountId = transaction.debit_account_id === cashAccount.id 
          ? transaction.credit_account_id 
          : transaction.debit_account_id
        
        const otherAccount = transaction.debit_account_id === cashAccount.id 
          ? transaction.credit_account 
          : transaction.debit_account

        if (otherAccount?.code?.startsWith('4') || otherAccount?.code?.startsWith('5') || otherAccount?.code?.startsWith('6')) {
          operating.push({
            description: transaction.description,
            amount,
            type: amount > 0 ? 'inflow' : 'outflow'
          })
        } else if (otherAccount?.code?.startsWith('15')) {
          investing.push({
            description: transaction.description,
            amount,
            type: amount > 0 ? 'inflow' : 'outflow'
          })
        } else {
          financing.push({
            description: transaction.description,
            amount,
            type: amount > 0 ? 'inflow' : 'outflow'
          })
        }
      }
    })

    return {
      data: {
        openingCash: openingBalance,
        operating,
        investing,
        financing,
        netCashFlow,
        closingCash: openingBalance + netCashFlow
      },
      error: null
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getTrialBalanceData = async (userId: string, asOfDate: string) => {
  try {
    const { data: accounts, error: accountsError } = await getAccounts(userId)
    if (accountsError) throw accountsError

    const { data: transactions, error: transactionsError } = await getTransactions(userId, undefined, asOfDate)
    if (transactionsError) throw transactionsError

    const trialBalance = accounts?.map(account => {
      let debitTotal = 0
      let creditTotal = 0

      transactions?.forEach(transaction => {
        if (transaction.debit_account_id === account.id) {
          debitTotal += transaction.amount
        }
        if (transaction.credit_account_id === account.id) {
          creditTotal += transaction.amount
        }
      })

      return {
        account: account.name,
        code: account.code,
        type: account.type,
        debit: account.type === 'asset' || account.type === 'expense' ? Math.max(0, debitTotal - creditTotal) : 0,
        credit: account.type === 'liability' || account.type === 'equity' || account.type === 'revenue' ? Math.max(0, creditTotal - debitTotal) : 0
      }
    }) || []

    const totalDebits = trialBalance.reduce((sum, item) => sum + item.debit, 0)
    const totalCredits = trialBalance.reduce((sum, item) => sum + item.credit, 0)

    return {
      data: {
        accounts: trialBalance,
        totalDebits,
        totalCredits,
        isBalanced: Math.abs(totalDebits - totalCredits) < 0.01
      },
      error: null
    }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const getAgedReceivables = async (userId: string, asOfDate: string) => {
  try {
    const { data, error } = await supabase.rpc('get_aged_receivables', {
      user_uuid: userId,
      as_of_date: asOfDate
    })

    if (error) throw error

    return { data: data || [], error: null }
  } catch (error: any) {
    // Fallback to manual calculation if function doesn't exist
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select(`
        *,
        invoice_items(*)
      `)
      .eq('user_id', userId)
      .in('status', ['sent', 'overdue'])

    if (invoicesError) return { data: null, error: invoicesError.message }

    const receivables = new Map()

    invoices?.forEach(invoice => {
      const total = invoice.invoice_items?.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0) || 0
      const dueDate = new Date(invoice.due_date)
      const asOf = new Date(asOfDate)
      const daysDiff = Math.floor((asOf.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      if (!receivables.has(invoice.client_name)) {
        receivables.set(invoice.client_name, {
          customer_name: invoice.client_name,
          current_amount: 0,
          days_30: 0,
          days_60: 0,
          days_90: 0,
          total_amount: 0
        })
      }

      const customer = receivables.get(invoice.client_name)
      customer.total_amount += total

      if (daysDiff < 0) {
        customer.current_amount += total
      } else if (daysDiff <= 30) {
        customer.days_30 += total
      } else if (daysDiff <= 60) {
        customer.days_60 += total
      } else {
        customer.days_90 += total
      }
    })

    return { data: Array.from(receivables.values()), error: null }
  }
}

// Create default accounts for new users
export const createDefaultAccounts = async (userId: string) => {
  try {
    const { error } = await supabase.rpc('create_default_accounts', {
      user_uuid: userId
    })
    return { error }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Check if user has accounts initialized
export const checkAccountsExist = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (error) throw error
    return { hasAccounts: data && data.length > 0, error: null }
  } catch (error: any) {
    return { hasAccounts: false, error: error.message }
  }
}

// Initialize accounts for user if they don't exist
export const ensureAccountsExist = async (userId: string) => {
  try {
    const { hasAccounts, error: checkError } = await checkAccountsExist(userId)

    if (checkError) throw new Error(checkError)

    if (!hasAccounts) {
      console.log('Creating default accounts for user:', userId)
      const { error: createError } = await createDefaultAccounts(userId)
      if (createError) throw new Error(createError)
      return { initialized: true, error: null }
    }

    return { initialized: false, error: null }
  } catch (error: any) {
    return { initialized: false, error: error.message }
  }
}

// Auto-create transactions from invoices
export const createTransactionFromInvoice = async (invoice: any) => {
  try {
    const { data: accounts } = await getAccounts(invoice.user_id)
    if (!accounts) return { error: 'No accounts found' }

    const cashAccount = accounts.find(acc => acc.code === '1000') // Cash
    const receivableAccount = accounts.find(acc => acc.code === '1100') // Accounts Receivable
    const revenueAccount = accounts.find(acc => acc.code === '4000') // Sales Revenue

    if (!cashAccount || !receivableAccount || !revenueAccount) {
      return { error: 'Required accounts not found' }
    }

    const total = invoice.items?.reduce((sum: number, item: any) => sum + (item.quantity * item.rate), 0) || 0

    // Check if transaction already exists for this invoice
    const { data: existingTransaction } = await supabase
      .from('transactions')
      .select('id')
      .eq('invoice_id', invoice.id)
      .maybeSingle()

    if (existingTransaction) {
      console.log('Transaction already exists for this invoice')
      return { error: null }
    }

    // Create transaction based on invoice status
    if (invoice.status === 'sent') {
      // When invoice is sent: Debit Accounts Receivable, Credit Revenue
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: invoice.user_id,
          reference: invoice.number,
          description: `Sale to ${invoice.client_name}`,
          transaction_date: invoice.issue_date,
          amount: total,
          debit_account_id: receivableAccount.id,
          credit_account_id: revenueAccount.id,
          invoice_id: invoice.id
        })

      return { error }
    } else if (invoice.status === 'paid') {
      // When invoice is paid: Create two transactions
      // 1. Record the sale (if not already recorded)
      const { error: saleError } = await supabase
        .from('transactions')
        .insert({
          user_id: invoice.user_id,
          reference: invoice.number,
          description: `Sale to ${invoice.client_name}`,
          transaction_date: invoice.issue_date,
          amount: total,
          debit_account_id: receivableAccount.id,
          credit_account_id: revenueAccount.id,
          invoice_id: invoice.id
        })

      if (saleError && !saleError.message.includes('duplicate')) {
        return { error: saleError }
      }

      // 2. Record the payment: Debit Cash, Credit Accounts Receivable
      const { error: paymentError } = await supabase
        .from('transactions')
        .insert({
          user_id: invoice.user_id,
          reference: `${invoice.number}-PAYMENT`,
          description: `Payment received from ${invoice.client_name}`,
          transaction_date: new Date().toISOString().split('T')[0],
          amount: total,
          debit_account_id: cashAccount.id,
          credit_account_id: receivableAccount.id,
          invoice_id: invoice.id
        })

      return { error: paymentError }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}