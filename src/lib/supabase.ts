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
  const { error } = await supabase.auth.signOut()
  
  // Handle the case where the session is already invalidated
  if (error && error.message?.includes('session_not_found')) {
    console.warn('Session already invalidated on server side - user is effectively logged out')
    // Clear local session data when server reports session doesn't exist
    await clearInvalidSession()
    return { error: null } // Return success since user is already logged out
  }
  
  return { error }
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