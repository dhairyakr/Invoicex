export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo?: string;
}

export interface Client {
  name: string;
  email: string;
  address: string;
}

export interface TaxRate {
  id: string;
  name: string;
  rate: number; // percentage
}

export interface PaymentInfo {
  method: string;
  details: string;
  qrCode?: string;
}

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  company: Company;
  client: Client;
  items: InvoiceItem[];
  notes: string;
  template: string;
  accentColor: string;
  font: string;
  showFooter: boolean;
  // New fields for tax and discount
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRates: TaxRate[];
  currency: string;
  // New fields for enhanced features
  paymentInfo?: PaymentInfo;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// New Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  sku?: string;
  stock?: number;
  unit: string; // e.g., 'piece', 'hour', 'kg', 'meter'
  taxable: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ProductFilters {
  search: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  tags: string[];
  isActive: boolean;
}

export type TemplateType = {
  id: string;
  name: string;
  description: string;
}

export type FontType = {
  id: string;
  name: string;
}

export interface InvoiceFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  tags: string[];
}