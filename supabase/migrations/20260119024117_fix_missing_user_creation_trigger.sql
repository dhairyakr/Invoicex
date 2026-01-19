/*
  # Fix Missing User Creation Trigger

  This migration fixes the missing trigger that automatically creates user profile records
  when new users sign up through Supabase Auth.

  ## Problem
  The `on_auth_user_created` trigger was missing from the database, causing sign-ups to fail
  with "Database connection error" because user records weren't being created automatically.

  ## Changes
  1. Recreate the trigger on auth.users table
  2. Ensure the handle_new_user function has proper permissions
  3. Verify RLS policies allow the trigger to function

  ## Security
  - Function uses SECURITY DEFINER to bypass RLS when creating user records
  - Only triggered on INSERT to auth.users (controlled by Supabase Auth)
*/

-- Ensure the function exists and has proper security settings
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

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;

-- Verify RLS is enabled on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist for user access
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

  -- Recreate policies
  CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);
END $$;
