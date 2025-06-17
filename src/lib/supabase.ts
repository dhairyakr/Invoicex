import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getInvoices = async (userId: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items(*),
      tax_rates(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createInvoice = async (invoice: any) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();
  
  return { data, error };
};

export const updateInvoice = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('invoices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);
  
  return { error };
};

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
    .subscribe();
};