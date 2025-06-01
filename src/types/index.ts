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