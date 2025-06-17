import { useState, useEffect } from 'react';
import { Invoice } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  getInvoices, 
  createInvoice as createSupabaseInvoice,
  updateInvoice as updateSupabaseInvoice,
  deleteInvoice as deleteSupabaseInvoice,
  subscribeToInvoices 
} from '../lib/supabase';
import { supabase } from '../lib/supabase';

export const useSupabaseInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load invoices from Supabase
  const loadInvoices = async () => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await getInvoices(user.id);
      
      if (error) {
        setError(error.message);
        return;
      }

      // Transform Supabase data to Invoice format
      const transformedInvoices: Invoice[] = (data || []).map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        issueDate: invoice.issue_date,
        dueDate: invoice.due_date,
        company: {
          name: invoice.company_name,
          email: invoice.company_email,
          phone: invoice.company_phone,
          address: invoice.company_address,
          logo: invoice.company_logo || undefined,
        },
        client: {
          name: invoice.client_name,
          email: invoice.client_email,
          address: invoice.client_address,
        },
        items: invoice.invoice_items?.map(item => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })) || [],
        notes: invoice.notes || '',
        template: invoice.template,
        accentColor: invoice.accent_color,
        font: invoice.font,
        showFooter: invoice.show_footer,
        discountType: invoice.discount_type as 'percentage' | 'fixed',
        discountValue: invoice.discount_value,
        taxRates: invoice.tax_rates?.map(tax => ({
          id: tax.id,
          name: tax.name,
          rate: tax.rate,
        })) || [],
        currency: invoice.currency,
        status: invoice.status as 'draft' | 'sent' | 'paid' | 'overdue',
        tags: invoice.tags || [],
        paymentInfo: invoice.payment_method ? {
          method: invoice.payment_method,
          details: invoice.payment_details || '',
          qrCode: invoice.payment_qr_code || undefined,
        } : undefined,
        createdAt: invoice.created_at,
        updatedAt: invoice.updated_at,
      }));

      setInvoices(transformedInvoices);
      setError(null);
    } catch (err) {
      setError('Failed to load invoices');
      console.error('Error loading invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create invoice in Supabase
  const createInvoice = async (invoice: Invoice) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      // Insert main invoice
      const { data: invoiceData, error: invoiceError } = await createSupabaseInvoice({
        user_id: user.id,
        number: invoice.number,
        issue_date: invoice.issueDate,
        due_date: invoice.dueDate,
        company_name: invoice.company.name,
        company_email: invoice.company.email,
        company_phone: invoice.company.phone,
        company_address: invoice.company.address,
        company_logo: invoice.company.logo,
        client_name: invoice.client.name,
        client_email: invoice.client.email,
        client_address: invoice.client.address,
        notes: invoice.notes,
        template: invoice.template,
        accent_color: invoice.accentColor,
        font: invoice.font,
        show_footer: invoice.showFooter,
        discount_type: invoice.discountType,
        discount_value: invoice.discountValue,
        currency: invoice.currency,
        status: invoice.status,
        tags: invoice.tags,
        payment_method: invoice.paymentInfo?.method,
        payment_details: invoice.paymentInfo?.details,
        payment_qr_code: invoice.paymentInfo?.qrCode,
      });

      if (invoiceError) return { error: invoiceError.message };

      // Insert invoice items
      if (invoice.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            invoice.items.map(item => ({
              invoice_id: invoiceData.id,
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
            }))
          );

        if (itemsError) return { error: itemsError.message };
      }

      // Insert tax rates
      if (invoice.taxRates.length > 0) {
        const { error: taxError } = await supabase
          .from('tax_rates')
          .insert(
            invoice.taxRates.map(tax => ({
              invoice_id: invoiceData.id,
              name: tax.name,
              rate: tax.rate,
            }))
          );

        if (taxError) return { error: taxError.message };
      }

      await loadInvoices(); // Refresh the list
      return { data: invoiceData, error: null };
    } catch (err) {
      return { error: 'Failed to create invoice' };
    }
  };

  // Update invoice in Supabase
  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await updateSupabaseInvoice(id, {
        number: updates.number,
        issue_date: updates.issueDate,
        due_date: updates.dueDate,
        company_name: updates.company?.name,
        company_email: updates.company?.email,
        company_phone: updates.company?.phone,
        company_address: updates.company?.address,
        company_logo: updates.company?.logo,
        client_name: updates.client?.name,
        client_email: updates.client?.email,
        client_address: updates.client?.address,
        notes: updates.notes,
        template: updates.template,
        accent_color: updates.accentColor,
        font: updates.font,
        show_footer: updates.showFooter,
        discount_type: updates.discountType,
        discount_value: updates.discountValue,
        currency: updates.currency,
        status: updates.status,
        tags: updates.tags,
        payment_method: updates.paymentInfo?.method,
        payment_details: updates.paymentInfo?.details,
        payment_qr_code: updates.paymentInfo?.qrCode,
        updated_at: new Date().toISOString(),
      });

      if (error) return { error: error.message };

      await loadInvoices(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { error: 'Failed to update invoice' };
    }
  };

  // Delete invoice from Supabase
  const deleteInvoice = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await deleteSupabaseInvoice(id);
      if (error) return { error: error.message };

      await loadInvoices(); // Refresh the list
      return { error: null };
    } catch (err) {
      return { error: 'Failed to delete invoice' };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = subscribeToInvoices(user.id, (payload) => {
      console.log('Real-time update:', payload);
      loadInvoices(); // Refresh invoices on any change
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Load invoices when user changes
  useEffect(() => {
    loadInvoices();
  }, [user]);

  return {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refreshInvoices: loadInvoices,
  };
};