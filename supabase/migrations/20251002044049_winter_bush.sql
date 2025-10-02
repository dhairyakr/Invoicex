/*
  # Financial Reports Database Schema

  1. New Tables
    - `accounts` - Chart of accounts for financial reporting
    - `transactions` - All financial transactions with double-entry bookkeeping
    - `journals` - Manual journal entries for adjustments
    - `payments` - Payment records linked to invoices
    - `financial_periods` - Accounting periods for reporting

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own financial data

  3. Functions
    - Automated transaction creation from invoices
    - Balance calculation functions
    - Aging analysis functions
*/

-- Create accounts table (Chart of Accounts)
CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  subtype text,
  parent_id uuid REFERENCES public.accounts(id),
  is_active boolean DEFAULT true,
  balance numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, code)
);

-- Create transactions table (Double-entry bookkeeping)
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reference text NOT NULL,
  description text NOT NULL,
  transaction_date date NOT NULL,
  amount numeric NOT NULL,
  debit_account_id uuid REFERENCES public.accounts(id) NOT NULL,
  credit_account_id uuid REFERENCES public.accounts(id) NOT NULL,
  invoice_id uuid REFERENCES public.invoices(id),
  journal_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create journals table (Manual entries)
CREATE TABLE IF NOT EXISTS public.journals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reference text NOT NULL,
  description text NOT NULL,
  journal_date date NOT NULL,
  total_amount numeric NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'posted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES public.invoices(id),
  amount numeric NOT NULL,
  payment_date date NOT NULL,
  payment_method text NOT NULL,
  reference text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create financial_periods table
CREATE TABLE IF NOT EXISTS public.financial_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_closed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_periods ENABLE ROW LEVEL SECURITY;

-- Create policies for accounts
CREATE POLICY "Users can view own accounts" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own accounts" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own accounts" ON public.accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own accounts" ON public.accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for journals
CREATE POLICY "Users can view own journals" ON public.journals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journals" ON public.journals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals" ON public.journals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals" ON public.journals
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for payments
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" ON public.payments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments" ON public.payments
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for financial_periods
CREATE POLICY "Users can view own financial_periods" ON public.financial_periods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own financial_periods" ON public.financial_periods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial_periods" ON public.financial_periods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial_periods" ON public.financial_periods
  FOR DELETE USING (auth.uid() = user_id);

-- Insert default chart of accounts for new users
CREATE OR REPLACE FUNCTION public.create_default_accounts(user_uuid uuid)
RETURNS void AS $$
BEGIN
  -- Assets
  INSERT INTO public.accounts (user_id, code, name, type, subtype) VALUES
  (user_uuid, '1000', 'Cash', 'asset', 'current'),
  (user_uuid, '1100', 'Accounts Receivable', 'asset', 'current'),
  (user_uuid, '1200', 'Inventory', 'asset', 'current'),
  (user_uuid, '1300', 'Prepaid Expenses', 'asset', 'current'),
  (user_uuid, '1500', 'Equipment', 'asset', 'fixed'),
  (user_uuid, '1600', 'Accumulated Depreciation', 'asset', 'fixed');
  
  -- Liabilities
  INSERT INTO public.accounts (user_id, code, name, type, subtype) VALUES
  (user_uuid, '2000', 'Accounts Payable', 'liability', 'current'),
  (user_uuid, '2100', 'Short-term Loans', 'liability', 'current'),
  (user_uuid, '2200', 'Accrued Expenses', 'liability', 'current'),
  (user_uuid, '2500', 'Long-term Debt', 'liability', 'long-term');
  
  -- Equity
  INSERT INTO public.accounts (user_id, code, name, type, subtype) VALUES
  (user_uuid, '3000', 'Share Capital', 'equity', 'capital'),
  (user_uuid, '3100', 'Retained Earnings', 'equity', 'retained');
  
  -- Revenue
  INSERT INTO public.accounts (user_id, code, name, type, subtype) VALUES
  (user_uuid, '4000', 'Sales Revenue', 'revenue', 'operating'),
  (user_uuid, '4100', 'Service Revenue', 'revenue', 'operating'),
  (user_uuid, '4900', 'Other Income', 'revenue', 'other');
  
  -- Expenses
  INSERT INTO public.accounts (user_id, code, name, type, subtype) VALUES
  (user_uuid, '5000', 'Cost of Goods Sold', 'expense', 'cogs'),
  (user_uuid, '6000', 'Salaries and Benefits', 'expense', 'operating'),
  (user_uuid, '6100', 'Rent Expense', 'expense', 'operating'),
  (user_uuid, '6200', 'Marketing Expense', 'expense', 'operating'),
  (user_uuid, '6300', 'Office Expenses', 'expense', 'operating'),
  (user_uuid, '6400', 'Utilities', 'expense', 'operating'),
  (user_uuid, '6500', 'Professional Services', 'expense', 'operating'),
  (user_uuid, '6900', 'Other Expenses', 'expense', 'other');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the handle_new_user function to create default accounts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  -- Create default chart of accounts
  PERFORM public.create_default_accounts(NEW.id);
  
  -- Create demo data for demo@invoicebeautifier.com
  IF NEW.email = 'demo@invoicebeautifier.com' THEN
    -- Insert sample transactions for demo user
    INSERT INTO public.transactions (user_id, reference, description, transaction_date, amount, debit_account_id, credit_account_id)
    SELECT 
      NEW.id,
      'DEMO-' || generate_random_uuid()::text,
      'Demo transaction',
      CURRENT_DATE - (random() * 30)::int,
      (random() * 10000 + 1000)::numeric,
      (SELECT id FROM public.accounts WHERE user_id = NEW.id AND code = '1000' LIMIT 1),
      (SELECT id FROM public.accounts WHERE user_id = NEW.id AND code = '4000' LIMIT 1)
    FROM generate_series(1, 10);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate account balances
CREATE OR REPLACE FUNCTION public.calculate_account_balance(account_uuid uuid, end_date date DEFAULT CURRENT_DATE)
RETURNS numeric AS $$
DECLARE
  account_type text;
  debit_total numeric := 0;
  credit_total numeric := 0;
  balance numeric := 0;
BEGIN
  -- Get account type
  SELECT type INTO account_type FROM public.accounts WHERE id = account_uuid;
  
  -- Calculate debit total
  SELECT COALESCE(SUM(amount), 0) INTO debit_total
  FROM public.transactions 
  WHERE debit_account_id = account_uuid 
  AND transaction_date <= end_date;
  
  -- Calculate credit total
  SELECT COALESCE(SUM(amount), 0) INTO credit_total
  FROM public.transactions 
  WHERE credit_account_id = account_uuid 
  AND transaction_date <= end_date;
  
  -- Calculate balance based on account type
  IF account_type IN ('asset', 'expense') THEN
    balance := debit_total - credit_total;
  ELSE
    balance := credit_total - debit_total;
  END IF;
  
  RETURN balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get aged receivables
CREATE OR REPLACE FUNCTION public.get_aged_receivables(user_uuid uuid, as_of_date date DEFAULT CURRENT_DATE)
RETURNS TABLE(
  customer_name text,
  current_amount numeric,
  days_30 numeric,
  days_60 numeric,
  days_90 numeric,
  total_amount numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.client_name,
    COALESCE(SUM(CASE 
      WHEN i.due_date >= as_of_date THEN 
        (SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)
      ELSE 0 
    END), 0) as current_amount,
    COALESCE(SUM(CASE 
      WHEN i.due_date < as_of_date AND i.due_date >= as_of_date - INTERVAL '30 days' THEN 
        (SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)
      ELSE 0 
    END), 0) as days_30,
    COALESCE(SUM(CASE 
      WHEN i.due_date < as_of_date - INTERVAL '30 days' AND i.due_date >= as_of_date - INTERVAL '60 days' THEN 
        (SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)
      ELSE 0 
    END), 0) as days_60,
    COALESCE(SUM(CASE 
      WHEN i.due_date < as_of_date - INTERVAL '60 days' THEN 
        (SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)
      ELSE 0 
    END), 0) as days_90,
    COALESCE(SUM((SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)), 0) as total_amount
  FROM public.invoices i
  WHERE i.user_id = user_uuid 
    AND i.status IN ('sent', 'overdue')
  GROUP BY i.client_name
  HAVING SUM((SELECT SUM(ii.quantity * ii.rate) FROM public.invoice_items ii WHERE ii.invoice_id = i.id)) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;