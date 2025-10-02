export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          price: number;
          currency: string;
          category: string;
          sku: string | null;
          stock: number | null;
          unit: string;
          taxable: boolean;
          is_active: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          price: number;
          currency?: string;
          category: string;
          sku?: string | null;
          stock?: number | null;
          unit?: string;
          taxable?: boolean;
          is_active?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          price?: number;
          currency?: string;
          category?: string;
          sku?: string | null;
          stock?: number | null;
          unit?: string;
          taxable?: boolean;
          is_active?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          number: string;
          issue_date: string;
          due_date: string;
          company_name: string;
          company_email: string;
          company_phone: string;
          company_address: string;
          company_logo: string | null;
          client_name: string;
          client_email: string;
          client_address: string;
          notes: string | null;
          template: string;
          accent_color: string;
          font: string;
          show_footer: boolean;
          discount_type: string;
          discount_value: number;
          currency: string;
          status: string;
          tags: string[];
          payment_method: string | null;
          payment_details: string | null;
          payment_qr_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          number: string;
          issue_date: string;
          due_date: string;
          company_name: string;
          company_email: string;
          company_phone: string;
          company_address: string;
          company_logo?: string | null;
          client_name: string;
          client_email: string;
          client_address: string;
          notes?: string | null;
          template?: string;
          accent_color?: string;
          font?: string;
          show_footer?: boolean;
          discount_type?: string;
          discount_value?: number;
          currency?: string;
          status?: string;
          tags?: string[];
          payment_method?: string | null;
          payment_details?: string | null;
          payment_qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          number?: string;
          issue_date?: string;
          due_date?: string;
          company_name?: string;
          company_email?: string;
          company_phone?: string;
          company_address?: string;
          company_logo?: string | null;
          client_name?: string;
          client_email?: string;
          client_address?: string;
          notes?: string | null;
          template?: string;
          accent_color?: string;
          font?: string;
          show_footer?: boolean;
          discount_type?: string;
          discount_value?: number;
          currency?: string;
          status?: string;
          tags?: string[];
          payment_method?: string | null;
          payment_details?: string | null;
          payment_qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          rate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          description: string;
          quantity: number;
          rate: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          description?: string;
          quantity?: number;
          rate?: number;
          created_at?: string;
        };
      };
      tax_rates: {
        Row: {
          id: string;
          invoice_id: string;
          name: string;
          rate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          name: string;
          rate: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          name?: string;
          rate?: number;
          created_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          name: string;
          type: string;
          subtype: string | null;
          parent_id: string | null;
          is_active: boolean;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          name: string;
          type: string;
          subtype?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          name?: string;
          type?: string;
          subtype?: string | null;
          parent_id?: string | null;
          is_active?: boolean;
          balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          description: string;
          transaction_date: string;
          amount: number;
          debit_account_id: string;
          credit_account_id: string;
          invoice_id: string | null;
          journal_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference: string;
          description: string;
          transaction_date: string;
          amount: number;
          debit_account_id: string;
          credit_account_id: string;
          invoice_id?: string | null;
          journal_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reference?: string;
          description?: string;
          transaction_date?: string;
          amount?: number;
          debit_account_id?: string;
          credit_account_id?: string;
          invoice_id?: string | null;
          journal_id?: string | null;
          created_at?: string;
        };
      };
      journals: {
        Row: {
          id: string;
          user_id: string;
          reference: string;
          description: string;
          journal_date: string;
          total_amount: number;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reference: string;
          description: string;
          journal_date: string;
          total_amount: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          reference?: string;
          description?: string;
          journal_date?: string;
          total_amount?: number;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          invoice_id: string | null;
          amount: number;
          payment_date: string;
          payment_method: string;
          reference: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          invoice_id?: string | null;
          amount: number;
          payment_date: string;
          payment_method: string;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          invoice_id?: string | null;
          amount?: number;
          payment_date?: string;
          payment_method?: string;
          reference?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      financial_periods: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_closed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          start_date: string;
          end_date: string;
          is_closed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          is_closed?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}