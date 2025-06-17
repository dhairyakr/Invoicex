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

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return { success: false, error: error.message }
    }
    console.log('✅ Supabase connection successful')
    return { success: true }
  } catch (err) {
    console.error('Supabase connection test failed:', err)
    return { success: false, error: 'Network error or invalid credentials' }
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
  return await supabase.auth.signOut()
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