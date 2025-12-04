/*
  # Collection Management System Tables

  ## Overview
  This migration creates tables to support a full-featured collection management system for aged receivables and payables.

  ## New Tables

  ### 1. `customer_vendors`
  Stores detailed customer and vendor information for tracking relationships
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `name` (text) - Customer/vendor name
  - `type` (text) - 'customer' or 'vendor'
  - `email` (text)
  - `phone` (text)
  - `address` (text)
  - `credit_limit` (numeric)
  - `payment_terms_days` (integer) - Default payment terms
  - `risk_rating` (text) - 'low', 'medium', 'high', 'critical'
  - `is_active` (boolean)
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ### 2. `collection_activities`
  Tracks all collection-related activities and communications
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `invoice_id` (uuid, foreign key to invoices) - Optional
  - `customer_vendor_id` (uuid, foreign key to customer_vendors) - Optional
  - `activity_type` (text) - 'call', 'email', 'sms', 'meeting', 'note', 'promise', 'dispute', 'legal'
  - `status` (text) - 'contacted', 'responded', 'no_response', 'escalated'
  - `subject` (text)
  - `description` (text)
  - `outcome` (text)
  - `follow_up_date` (date)
  - `assigned_to` (text) - Collector name
  - `created_at` (timestamptz)

  ### 3. `payment_promises`
  Records promise-to-pay commitments
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `invoice_id` (uuid, foreign key to invoices)
  - `customer_vendor_id` (uuid, foreign key to customer_vendors)
  - `promised_amount` (numeric)
  - `promised_date` (date)
  - `status` (text) - 'pending', 'kept', 'broken', 'partial'
  - `actual_amount` (numeric) - Amount actually paid
  - `actual_date` (date) - Date actually paid
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ### 4. `collection_workflows`
  Manages collection status and escalation stages
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `invoice_id` (uuid, foreign key to invoices)
  - `customer_vendor_id` (uuid, foreign key to customer_vendors)
  - `current_stage` (text) - 'current', 'reminder', 'follow_up', 'escalated', 'legal', 'write_off'
  - `priority` (text) - 'low', 'medium', 'high', 'critical'
  - `assigned_to` (text)
  - `last_contact_date` (date)
  - `next_action_date` (date)
  - `escalation_level` (integer) - 0-5
  - `is_disputed` (boolean)
  - `notes` (text)
  - `created_at`, `updated_at` (timestamptz)

  ### 5. `reminder_templates`
  Email/SMS templates for automated reminders
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `name` (text)
  - `type` (text) - 'email', 'sms'
  - `stage` (text) - 'friendly', 'firm', 'final', 'legal'
  - `subject` (text)
  - `body` (text)
  - `is_active` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
*/

-- Create customer_vendors table
CREATE TABLE IF NOT EXISTS customer_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('customer', 'vendor')),
  email text,
  phone text,
  address text,
  credit_limit numeric DEFAULT 0,
  payment_terms_days integer DEFAULT 30,
  risk_rating text DEFAULT 'low' CHECK (risk_rating IN ('low', 'medium', 'high', 'critical')),
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_activities table
CREATE TABLE IF NOT EXISTS collection_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  customer_vendor_id uuid REFERENCES customer_vendors(id) ON DELETE CASCADE,
  activity_type text NOT NULL CHECK (activity_type IN ('call', 'email', 'sms', 'meeting', 'note', 'promise', 'dispute', 'legal')),
  status text DEFAULT 'contacted' CHECK (status IN ('contacted', 'responded', 'no_response', 'escalated')),
  subject text NOT NULL,
  description text,
  outcome text,
  follow_up_date date,
  assigned_to text,
  created_at timestamptz DEFAULT now()
);

-- Create payment_promises table
CREATE TABLE IF NOT EXISTS payment_promises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  customer_vendor_id uuid REFERENCES customer_vendors(id) ON DELETE CASCADE,
  promised_amount numeric NOT NULL,
  promised_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'kept', 'broken', 'partial')),
  actual_amount numeric DEFAULT 0,
  actual_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_workflows table
CREATE TABLE IF NOT EXISTS collection_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  customer_vendor_id uuid REFERENCES customer_vendors(id) ON DELETE CASCADE,
  current_stage text DEFAULT 'current' CHECK (current_stage IN ('current', 'reminder', 'follow_up', 'escalated', 'legal', 'write_off')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to text,
  last_contact_date date,
  next_action_date date,
  escalation_level integer DEFAULT 0,
  is_disputed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reminder_templates table
CREATE TABLE IF NOT EXISTS reminder_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'sms')),
  stage text NOT NULL CHECK (stage IN ('friendly', 'firm', 'final', 'legal')),
  subject text,
  body text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customer_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_promises ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_vendors
CREATE POLICY "Users can view own customer/vendors"
  ON customer_vendors FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer/vendors"
  ON customer_vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customer/vendors"
  ON customer_vendors FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own customer/vendors"
  ON customer_vendors FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for collection_activities
CREATE POLICY "Users can view own collection activities"
  ON collection_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collection activities"
  ON collection_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collection activities"
  ON collection_activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collection activities"
  ON collection_activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for payment_promises
CREATE POLICY "Users can view own payment promises"
  ON payment_promises FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment promises"
  ON payment_promises FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment promises"
  ON payment_promises FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment promises"
  ON payment_promises FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for collection_workflows
CREATE POLICY "Users can view own collection workflows"
  ON collection_workflows FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own collection workflows"
  ON collection_workflows FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collection workflows"
  ON collection_workflows FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own collection workflows"
  ON collection_workflows FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for reminder_templates
CREATE POLICY "Users can view own reminder templates"
  ON reminder_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminder templates"
  ON reminder_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminder templates"
  ON reminder_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminder templates"
  ON reminder_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_vendors_user_id ON customer_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_vendors_type ON customer_vendors(type);
CREATE INDEX IF NOT EXISTS idx_collection_activities_user_id ON collection_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_activities_invoice_id ON collection_activities(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_promises_user_id ON payment_promises(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_promises_invoice_id ON payment_promises(invoice_id);
CREATE INDEX IF NOT EXISTS idx_collection_workflows_user_id ON collection_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_workflows_invoice_id ON collection_workflows(invoice_id);
CREATE INDEX IF NOT EXISTS idx_reminder_templates_user_id ON reminder_templates(user_id);