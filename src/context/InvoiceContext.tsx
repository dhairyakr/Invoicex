import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, InvoiceItem, TaxRate, InvoiceFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { createTransactionFromInvoice, supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useSupabaseInvoices } from '../hooks/useSupabaseInvoices';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  filters: InvoiceFilters;
  filteredInvoices: Invoice[];
  setCurrentInvoice: (invoice: Invoice | null) => void;
  setFilters: (filters: InvoiceFilters) => void;
  createInvoice: () => void;
  duplicateInvoice: (id: string) => void;
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  updateInvoiceStatus: (id: string, status: string) => void;
  updateInvoiceField: (field: string, value: any) => void;
  addInvoiceItem: () => void;
  updateInvoiceItem: (id: string, field: string, value: any) => void;
  removeInvoiceItem: (id: string) => void;
  addTaxRate: () => void;
  updateTaxRate: (id: string, field: string, value: any) => void;
  removeTaxRate: (id: string) => void;
  calculateTotals: () => {
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    total: number;
  };
}

const DEFAULT_INVOICE: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
  number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  company: {
    name: '',
    email: '',
    phone: '',
    address: '',
  },
  client: {
    name: '',
    email: '',
    address: '',
  },
  items: [
    {
      id: uuidv4(),
      description: '',
      quantity: 1,
      rate: 0,
    },
  ],
  notes: '',
  template: 'elegant',
  accentColor: '#223141',
  font: 'inter',
  showFooter: true,
  discountType: 'percentage',
  discountValue: 0,
  taxRates: [],
  currency: 'USD',
  status: 'draft',
  tags: [],
};

const DEFAULT_FILTERS: InvoiceFilters = {
  search: '',
  status: '',
  dateRange: {
    start: '',
    end: '',
  },
  tags: [],
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);
  const { user } = useAuth();
  const {
    invoices,
    loading,
    error,
    createInvoice: createSupabaseInvoice,
    updateInvoice: updateSupabaseInvoice,
    deleteInvoice: deleteSupabaseInvoice,
    refreshInvoices
  } = useSupabaseInvoices();

  // Migrate localStorage invoices to Supabase on first load
  useEffect(() => {
    const migrateLocalStorageInvoices = async () => {
      if (!user) return;

      const localInvoices = localStorage.getItem('invoices');
      if (localInvoices) {
        try {
          const parsed = JSON.parse(localInvoices);
          console.log(`Found ${parsed.length} invoices in localStorage, migrating to Supabase...`);

          for (const invoice of parsed) {
            // Check if invoice already exists in Supabase
            const { data: existing } = await supabase
              .from('invoices')
              .select('id')
              .eq('id', invoice.id)
              .maybeSingle();

            if (!existing) {
              await createSupabaseInvoice(invoice);
            }
          }

          // Clear localStorage after successful migration
          localStorage.removeItem('invoices');
          console.log('✅ Migration complete');
          refreshInvoices();
        } catch (error) {
          console.error('Error migrating invoices:', error);
        }
      }
    };

    migrateLocalStorageInvoices();
  }, [user]);

  // Filter invoices based on current filters
  const filteredInvoices = invoices.filter(invoice => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        invoice.number.toLowerCase().includes(searchLower) ||
        invoice.client.name.toLowerCase().includes(searchLower) ||
        invoice.company.name.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status && invoice.status !== filters.status) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start && invoice.issueDate < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && invoice.issueDate > filters.dateRange.end) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        invoice.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  const createInvoice = () => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      id: uuidv4(),
      ...DEFAULT_INVOICE,
      number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now,
      updatedAt: now,
    };
    setCurrentInvoice(newInvoice);
  };

  const duplicateInvoice = async (id: string) => {
    const originalInvoice = invoices.find(inv => inv.id === id);
    if (!originalInvoice) return;

    const now = new Date().toISOString();
    const duplicatedInvoice: Invoice = {
      ...originalInvoice,
      id: uuidv4(),
      number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      items: originalInvoice.items.map(item => ({
        ...item,
        id: uuidv4(),
      })),
      taxRates: originalInvoice.taxRates.map(tax => ({
        ...tax,
        id: uuidv4(),
      })),
    };

    await createSupabaseInvoice(duplicatedInvoice);
    setCurrentInvoice(duplicatedInvoice);
  };

  const saveInvoice = async (invoice: Invoice) => {
    if (!user) return;

    const now = new Date().toISOString();
    const updatedInvoice = {
      ...invoice,
      updatedAt: now,
    };

    const existingInvoice = invoices.find(inv => inv.id === invoice.id);
    const previousStatus = existingInvoice?.status;

    if (existingInvoice) {
      // Update existing invoice
      await updateSupabaseInvoice(invoice.id, updatedInvoice);

      // Create transaction if status changed to sent or paid
      if (previousStatus !== invoice.status && (invoice.status === 'sent' || invoice.status === 'paid')) {
        await createTransactionFromInvoice({
          id: invoice.id,
          user_id: user.id,
          number: invoice.number,
          items: invoice.items,
          client_name: invoice.client.name,
          issue_date: invoice.issueDate,
          status: invoice.status
        }).catch(error => {
          console.warn('Failed to create accounting transaction:', error);
        });
      }
    } else {
      // Add new invoice
      await createSupabaseInvoice(updatedInvoice);

      // Create accounting transaction if invoice is sent or paid
      if (invoice.status === 'sent' || invoice.status === 'paid') {
        await createTransactionFromInvoice({
          id: invoice.id,
          user_id: user.id,
          number: invoice.number,
          items: invoice.items,
          client_name: invoice.client.name,
          issue_date: invoice.issueDate,
          status: invoice.status
        }).catch(error => {
          console.warn('Failed to create accounting transaction:', error);
        });
      }
    }

    setCurrentInvoice(null);
  };

  const deleteInvoice = async (id: string) => {
    await deleteSupabaseInvoice(id);
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
    }
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    if (!user) return;

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    const previousStatus = invoice.status;
    const now = new Date().toISOString();

    await updateSupabaseInvoice(id, { status, updatedAt: now });

    // Create transaction if status changed to sent or paid
    if (previousStatus !== status && (status === 'sent' || status === 'paid')) {
      await createTransactionFromInvoice({
        id: invoice.id,
        user_id: user.id,
        number: invoice.number,
        items: invoice.items,
        client_name: invoice.client.name,
        issue_date: invoice.issueDate,
        status: status
      }).catch(error => {
        console.warn('Failed to create accounting transaction:', error);
      });
    }
  };

  const updateInvoiceField = (field: string, value: any) => {
    if (!currentInvoice) return;

    // Handle nested fields
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setCurrentInvoice({
        ...currentInvoice,
        [section]: {
          ...currentInvoice[section as keyof Invoice],
          [subField]: value,
        },
      });
    } else {
      setCurrentInvoice({
        ...currentInvoice,
        [field]: value,
      });
    }
  };

  const addInvoiceItem = () => {
    if (!currentInvoice) return;
    
    const newItem: InvoiceItem = {
      id: uuidv4(),
      description: '',
      quantity: 1,
      rate: 0,
    };
    
    setCurrentInvoice({
      ...currentInvoice,
      items: [...currentInvoice.items, newItem],
    });
  };

  const updateInvoiceItem = (id: string, field: string, value: any) => {
    if (!currentInvoice) return;
    
    const updatedItems = currentInvoice.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setCurrentInvoice({
      ...currentInvoice,
      items: updatedItems,
    });
  };

  const removeInvoiceItem = (id: string) => {
    if (!currentInvoice) return;
    
    setCurrentInvoice({
      ...currentInvoice,
      items: currentInvoice.items.filter(item => item.id !== id),
    });
  };

  const addTaxRate = () => {
    if (!currentInvoice) return;
    
    const newTaxRate: TaxRate = {
      id: uuidv4(),
      name: 'Tax',
      rate: 0,
    };
    
    setCurrentInvoice({
      ...currentInvoice,
      taxRates: [...currentInvoice.taxRates, newTaxRate],
    });
  };

  const updateTaxRate = (id: string, field: string, value: any) => {
    if (!currentInvoice) return;
    
    const updatedTaxRates = currentInvoice.taxRates.map(tax => {
      if (tax.id === id) {
        return { ...tax, [field]: value };
      }
      return tax;
    });
    
    setCurrentInvoice({
      ...currentInvoice,
      taxRates: updatedTaxRates,
    });
  };

  const removeTaxRate = (id: string) => {
    if (!currentInvoice) return;
    
    setCurrentInvoice({
      ...currentInvoice,
      taxRates: currentInvoice.taxRates.filter(tax => tax.id !== id),
    });
  };

  const calculateTotals = () => {
    if (!currentInvoice) {
      return { subtotal: 0, discountAmount: 0, taxAmount: 0, total: 0 };
    }

    const subtotal = currentInvoice.items.reduce(
      (sum, item) => sum + (item.quantity * item.rate),
      0
    );

    let discountAmount = 0;
    if (currentInvoice.discountValue > 0) {
      if (currentInvoice.discountType === 'percentage') {
        discountAmount = (subtotal * currentInvoice.discountValue) / 100;
      } else {
        discountAmount = currentInvoice.discountValue;
      }
    }

    const afterDiscount = subtotal - discountAmount;

    const taxAmount = currentInvoice.taxRates.reduce(
      (sum, tax) => sum + (afterDiscount * tax.rate) / 100,
      0
    );

    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const value = {
    invoices,
    currentInvoice,
    filters,
    filteredInvoices,
    setCurrentInvoice,
    setFilters,
    createInvoice,
    duplicateInvoice,
    saveInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    updateInvoiceField,
    addInvoiceItem,
    updateInvoiceItem,
    removeInvoiceItem,
    addTaxRate,
    updateTaxRate,
    removeTaxRate,
    calculateTotals,
  };

  return <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>;
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};