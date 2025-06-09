import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, InvoiceItem, TaxRate } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  createInvoice: () => void;
  saveInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
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

const DEFAULT_INVOICE: Omit<Invoice, 'id'> = {
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
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  // Load invoices from localStorage
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      try {
        const parsed = JSON.parse(savedInvoices);
        // Migrate old invoices to new format
        const migratedInvoices = parsed.map((invoice: any) => ({
          ...invoice,
          discountType: invoice.discountType || 'percentage',
          discountValue: invoice.discountValue || 0,
          taxRates: invoice.taxRates || [],
          currency: invoice.currency || 'USD',
        }));
        setInvoices(migratedInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
        setInvoices([]);
      }
    }
  }, []);

  // Save invoices to localStorage when they change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const createInvoice = () => {
    const newInvoice: Invoice = {
      id: uuidv4(),
      ...DEFAULT_INVOICE,
    };
    setCurrentInvoice(newInvoice);
  };

  const saveInvoice = (invoice: Invoice) => {
    const existingIndex = invoices.findIndex(inv => inv.id === invoice.id);
    
    if (existingIndex >= 0) {
      // Update existing invoice
      const updatedInvoices = [...invoices];
      updatedInvoices[existingIndex] = invoice;
      setInvoices(updatedInvoices);
    } else {
      // Add new invoice
      setInvoices([...invoices, invoice]);
    }
    
    setCurrentInvoice(null);
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
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
    setCurrentInvoice,
    createInvoice,
    saveInvoice,
    deleteInvoice,
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