/*
  # Enhanced Chart of Accounts Features

  ## Overview
  This migration adds advanced account management features including tags, reconciliation tracking, 
  budgets, audit trails, and account notes.

  ## New Tables

  ### 1. `account_tags`
  Stores custom tags for accounts (e.g., Tax-deductible, Auditable)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `name` (text) - Tag name
  - `color` (text) - Hex color code for display
  - `created_at` (timestamptz)

  ### 2. `account_tag_assignments`
  Maps tags to accounts (many-to-many)
  - `id` (uuid, primary key)
  - `account_id` (uuid, foreign key to accounts)
  - `tag_id` (uuid, foreign key to account_tags)
  - `created_at` (timestamptz)

  ### 3. `account_reconciliations`
  Tracks account reconciliation history
  - `id` (uuid, primary key)
  - `account_id` (uuid, foreign key to accounts)
  - `reconciliation_date` (date)
  - `statement_balance` (numeric)
  - `book_balance` (numeric)
  - `difference` (numeric)
  - `reconciled_by` (text) - User who reconciled
  - `notes` (text)
  - `status` (text) - 'pending', 'completed', 'discrepancy'
  - `created_at` (timestamptz)

  ### 4. `account_budgets`
  Budget assignments for accounts
  - `id` (uuid, primary key)
  - `account_id` (uuid, foreign key to accounts)
  - `fiscal_year` (integer)
  - `budget_amount` (numeric)
  - `actual_amount` (numeric)
  - `variance` (numeric)
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ### 5. `account_notes`
  Documentation and notes for accounts
  - `id` (uuid, primary key)
  - `account_id` (uuid, foreign key to accounts)
  - `note` (text)
  - `created_by` (text)
  - `is_important` (boolean)
  - `created_at` (timestamptz)

  ### 6. `account_audit_log`
  Complete audit trail for account changes
  - `id` (uuid, primary key)
  - `account_id` (uuid, foreign key to accounts)
  - `action` (text) - 'created', 'updated', 'deactivated', 'activated'
  - `field_name` (text)
  - `old_value` (text)
  - `new_value` (text)
  - `changed_by` (text)
  - `created_at` (timestamptz)

  ## Column Additions to `accounts` table
  - `description` (text) - Account description
  - `tax_relevant` (boolean) - For tax reporting
  - `budget_enabled` (boolean) - Enable budget tracking
  - `last_reconciled` (date) - Last reconciliation date
  - `reconciliation_required` (boolean) - Requires regular reconciliation
  - `archived` (boolean) - Soft delete for historical data
  - `archived_at` (timestamptz) - When archived
  - `sort_order` (integer) - Custom sorting

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Create indexes for performance
*/

-- Add new columns to accounts table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'description') THEN
    ALTER TABLE accounts ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'tax_relevant') THEN
    ALTER TABLE accounts ADD COLUMN tax_relevant boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'budget_enabled') THEN
    ALTER TABLE accounts ADD COLUMN budget_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'last_reconciled') THEN
    ALTER TABLE accounts ADD COLUMN last_reconciled date;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'reconciliation_required') THEN
    ALTER TABLE accounts ADD COLUMN reconciliation_required boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'archived') THEN
    ALTER TABLE accounts ADD COLUMN archived boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'archived_at') THEN
    ALTER TABLE accounts ADD COLUMN archived_at timestamptz;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'accounts' AND column_name = 'sort_order') THEN
    ALTER TABLE accounts ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

-- Create account_tags table
CREATE TABLE IF NOT EXISTS account_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create account_tag_assignments table
CREATE TABLE IF NOT EXISTS account_tag_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES account_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(account_id, tag_id)
);

-- Create account_reconciliations table
CREATE TABLE IF NOT EXISTS account_reconciliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  reconciliation_date date NOT NULL,
  statement_balance numeric NOT NULL,
  book_balance numeric NOT NULL,
  difference numeric DEFAULT 0,
  reconciled_by text,
  notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'discrepancy')),
  created_at timestamptz DEFAULT now()
);

-- Create account_budgets table
CREATE TABLE IF NOT EXISTS account_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  fiscal_year integer NOT NULL,
  budget_amount numeric NOT NULL,
  actual_amount numeric DEFAULT 0,
  variance numeric DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(account_id, fiscal_year)
);

-- Create account_notes table
CREATE TABLE IF NOT EXISTS account_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  note text NOT NULL,
  created_by text NOT NULL,
  is_important boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create account_audit_log table
CREATE TABLE IF NOT EXISTS account_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL CHECK (action IN ('created', 'updated', 'deactivated', 'activated', 'archived', 'restored')),
  field_name text,
  old_value text,
  new_value text,
  changed_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE account_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for account_tags
CREATE POLICY "Users can view own tags"
  ON account_tags FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tags"
  ON account_tags FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tags"
  ON account_tags FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tags"
  ON account_tags FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for account_tag_assignments
CREATE POLICY "Users can view own account tag assignments"
  ON account_tag_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_tag_assignments.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own account tag assignments"
  ON account_tag_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_tag_assignments.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own account tag assignments"
  ON account_tag_assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_tag_assignments.account_id
      AND accounts.user_id = auth.uid()
    )
  );

-- RLS Policies for account_reconciliations
CREATE POLICY "Users can view own account reconciliations"
  ON account_reconciliations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_reconciliations.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own account reconciliations"
  ON account_reconciliations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_reconciliations.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own account reconciliations"
  ON account_reconciliations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_reconciliations.account_id
      AND accounts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_reconciliations.account_id
      AND accounts.user_id = auth.uid()
    )
  );

-- RLS Policies for account_budgets
CREATE POLICY "Users can view own account budgets"
  ON account_budgets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_budgets.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own account budgets"
  ON account_budgets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_budgets.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own account budgets"
  ON account_budgets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_budgets.account_id
      AND accounts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_budgets.account_id
      AND accounts.user_id = auth.uid()
    )
  );

-- RLS Policies for account_notes
CREATE POLICY "Users can view own account notes"
  ON account_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_notes.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own account notes"
  ON account_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_notes.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own account notes"
  ON account_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_notes.account_id
      AND accounts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_notes.account_id
      AND accounts.user_id = auth.uid()
    )
  );

-- RLS Policies for account_audit_log
CREATE POLICY "Users can view own account audit logs"
  ON account_audit_log FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_audit_log.account_id
      AND accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own account audit logs"
  ON account_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM accounts
      WHERE accounts.id = account_audit_log.account_id
      AND accounts.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_account_tags_user_id ON account_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_account_tag_assignments_account_id ON account_tag_assignments(account_id);
CREATE INDEX IF NOT EXISTS idx_account_tag_assignments_tag_id ON account_tag_assignments(tag_id);
CREATE INDEX IF NOT EXISTS idx_account_reconciliations_account_id ON account_reconciliations(account_id);
CREATE INDEX IF NOT EXISTS idx_account_budgets_account_id ON account_budgets(account_id);
CREATE INDEX IF NOT EXISTS idx_account_budgets_fiscal_year ON account_budgets(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_account_notes_account_id ON account_notes(account_id);
CREATE INDEX IF NOT EXISTS idx_account_audit_log_account_id ON account_audit_log(account_id);
CREATE INDEX IF NOT EXISTS idx_accounts_archived ON accounts(archived);
CREATE INDEX IF NOT EXISTS idx_accounts_sort_order ON accounts(sort_order);