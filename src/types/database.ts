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
      // ==========================================
      // ACCOUNTING MODULE TABLES
      // ==========================================
      accounts: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          name: string;
          group_type: string;
          sub_group: string | null;
          opening_balance: number;
          opening_balance_type: string;
          currency: string;
          cost_center_id: string | null;
          is_active: boolean;
          is_system: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          name: string;
          group_type: string;
          sub_group?: string | null;
          opening_balance?: number;
          opening_balance_type?: string;
          currency?: string;
          cost_center_id?: string | null;
          is_active?: boolean;
          is_system?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          name?: string;
          group_type?: string;
          sub_group?: string | null;
          opening_balance?: number;
          opening_balance_type?: string;
          currency?: string;
          cost_center_id?: string | null;
          is_active?: boolean;
          is_system?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vouchers: {
        Row: {
          id: string;
          user_id: string;
          voucher_type: string;
          voucher_number: string;
          voucher_date: string;
          reference_number: string | null;
          narration: string | null;
          total_amount: number;
          currency: string;
          exchange_rate: number;
          cost_center_id: string | null;
          is_optional: boolean;
          is_reversing: boolean;
          reversal_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          voucher_type: string;
          voucher_number: string;
          voucher_date: string;
          reference_number?: string | null;
          narration?: string | null;
          total_amount: number;
          currency?: string;
          exchange_rate?: number;
          cost_center_id?: string | null;
          is_optional?: boolean;
          is_reversing?: boolean;
          reversal_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          voucher_type?: string;
          voucher_number?: string;
          voucher_date?: string;
          reference_number?: string | null;
          narration?: string | null;
          total_amount?: number;
          currency?: string;
          exchange_rate?: number;
          cost_center_id?: string | null;
          is_optional?: boolean;
          is_reversing?: boolean;
          reversal_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      voucher_entries: {
        Row: {
          id: string;
          voucher_id: string;
          account_id: string;
          debit_amount: number;
          credit_amount: number;
          narration: string | null;
          cost_center_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          voucher_id: string;
          account_id: string;
          debit_amount?: number;
          credit_amount?: number;
          narration?: string | null;
          cost_center_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          voucher_id?: string;
          account_id?: string;
          debit_amount?: number;
          credit_amount?: number;
          narration?: string | null;
          cost_center_id?: string | null;
          created_at?: string;
        };
      };
      gst_details: {
        Row: {
          id: string;
          voucher_id: string;
          hsn_sac_code: string | null;
          taxable_value: number;
          tax_rate: number;
          cgst_amount: number;
          sgst_amount: number;
          igst_amount: number;
          cess_amount: number;
          party_gstin: string | null;
          party_state_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          voucher_id: string;
          hsn_sac_code?: string | null;
          taxable_value: number;
          tax_rate: number;
          cgst_amount?: number;
          sgst_amount?: number;
          igst_amount?: number;
          cess_amount?: number;
          party_gstin?: string | null;
          party_state_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          voucher_id?: string;
          hsn_sac_code?: string | null;
          taxable_value?: number;
          tax_rate?: number;
          cgst_amount?: number;
          sgst_amount?: number;
          igst_amount?: number;
          cess_amount?: number;
          party_gstin?: string | null;
          party_state_code?: string | null;
          created_at?: string;
        };
      };
      cost_centers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          code: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          code: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          code?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exchange_rates: {
        Row: {
          id: string;
          from_currency: string;
          to_currency: string;
          rate: number;
          effective_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          from_currency: string;
          to_currency: string;
          rate: number;
          effective_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          from_currency?: string;
          to_currency?: string;
          rate?: number;
          effective_date?: string;
          created_at?: string;
        };
      };
      bank_reconciliation: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          voucher_entry_id: string | null;
          bank_date: string;
          bank_amount: number;
          bank_reference: string | null;
          is_matched: boolean;
          matched_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          voucher_entry_id?: string | null;
          bank_date: string;
          bank_amount: number;
          bank_reference?: string | null;
          is_matched?: boolean;
          matched_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          voucher_entry_id?: string | null;
          bank_date?: string;
          bank_amount?: number;
          bank_reference?: string | null;
          is_matched?: boolean;
          matched_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          fiscal_year: string;
          period_type: string;
          period_number: number;
          budgeted_amount: number;
          actual_amount: number;
          variance_amount: number;
          variance_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          fiscal_year: string;
          period_type: string;
          period_number: number;
          budgeted_amount: number;
          actual_amount?: number;
          variance_amount?: number;
          variance_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          fiscal_year?: string;
          period_type?: string;
          period_number?: number;
          budgeted_amount?: number;
          actual_amount?: number;
          variance_amount?: number;
          variance_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      fn_generate_voucher_number: {
        Args: {
          p_voucher_type: string;
          p_voucher_date: string;
        };
        Returns: string;
      };
      fn_calculate_gst: {
        Args: {
          p_taxable_value: number;
          p_tax_rate: number;
          p_state_code?: string;
        };
        Returns: {
          cgst_amount: number;
          sgst_amount: number;
          igst_amount: number;
          total_tax: number;
        };
      };
      fn_get_account_balance: {
        Args: {
          p_account_id: string;
          p_as_of_date: string;
        };
        Returns: {
          opening_balance: number;
          debit_total: number;
          credit_total: number;
          closing_balance: number;
        };
      };
      fn_get_exchange_rate: {
        Args: {
          p_from_currency: string;
          p_to_currency: string;
          p_date: string;
        };
        Returns: number;
      };
      fn_get_trial_balance: {
        Args: {
          p_user_id: string;
          p_as_of_date: string;
          p_include_zero_balances: boolean;
        };
        Returns: {
          account_id: string;
          account_code: string;
          account_name: string;
          group_type: string;
          debit_balance: number;
          credit_balance: number;
        }[];
      };
      fn_get_profit_loss: {
        Args: {
          p_user_id: string;
          p_from_date: string;
          p_to_date: string;
        };
        Returns: {
          account_id: string;
          account_name: string;
          group_type: string;
          amount: number;
        }[];
      };
      fn_get_balance_sheet: {
        Args: {
          p_user_id: string;
          p_as_of_date: string;
        };
        Returns: {
          account_id: string;
          account_name: string;
          group_type: string;
          amount: number;
        }[];
      };
      fn_get_cash_book: {
        Args: {
          p_user_id: string;
          p_account_id: string;
          p_from_date: string;
          p_to_date: string;
        };
        Returns: {
          voucher_date: string;
          voucher_number: string;
          voucher_type: string;
          narration: string;
          debit_amount: number;
          credit_amount: number;
          balance: number;
        }[];
      };
      fn_get_ledger_report: {
        Args: {
          p_user_id: string;
          p_account_id: string;
          p_from_date: string;
          p_to_date: string;
        };
        Returns: {
          voucher_date: string;
          voucher_number: string;
          voucher_type: string;
          narration: string;
          debit_amount: number;
          credit_amount: number;
          balance: number;
        }[];
      };
      fn_get_day_book: {
        Args: {
          p_user_id: string;
          p_from_date: string;
          p_to_date: string;
        };
        Returns: {
          voucher_date: string;
          voucher_number: string;
          voucher_type: string;
          account_name: string;
          narration: string;
          debit_amount: number;
          credit_amount: number;
        }[];
      };
      fn_get_gstr_report: {
        Args: {
          p_user_id: string;
          p_report_type: string;
          p_month: number;
          p_year: number;
        };
        Returns: {
          voucher_date: string;
          voucher_number: string;
          party_gstin: string;
          hsn_sac_code: string;
          taxable_value: number;
          tax_rate: number;
          cgst_amount: number;
          sgst_amount: number;
          igst_amount: number;
          total_tax: number;
        }[];
      };
      fn_get_cost_center_report: {
        Args: {
          p_user_id: string;
          p_cost_center_id: string;
          p_from_date: string;
          p_to_date: string;
        };
        Returns: {
          voucher_date: string;
          voucher_number: string;
          account_name: string;
          narration: string;
          debit_amount: number;
          credit_amount: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}