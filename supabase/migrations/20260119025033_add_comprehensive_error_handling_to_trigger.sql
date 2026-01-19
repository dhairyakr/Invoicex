/*
  # Add Comprehensive Error Handling to User Creation Trigger

  This migration improves the user creation trigger with better error handling
  and logging to diagnose signup failures.

  ## Changes
  1. Add exception handling to the trigger function
  2. Add detailed logging for debugging
  3. Ensure all operations use proper error recovery

  ## Security
  - Maintains SECURITY DEFINER to bypass RLS
  - Proper error handling prevents partial user creation
*/

-- Improved trigger function with comprehensive error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_error_message text;
BEGIN
  -- Log the trigger start
  RAISE LOG 'handle_new_user: Starting for user %', NEW.id;
  
  BEGIN
    -- Insert into users table
    INSERT INTO public.users (id, email, full_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    );
    
    RAISE LOG 'handle_new_user: User record created for %', NEW.id;
  EXCEPTION
    WHEN unique_violation THEN
      RAISE LOG 'handle_new_user: User already exists for %', NEW.id;
      RETURN NEW;
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE WARNING 'handle_new_user: Error creating user record: %', v_error_message;
      RAISE EXCEPTION 'Failed to create user record: %', v_error_message;
  END;

  BEGIN
    -- Create default chart of accounts
    PERFORM public.create_default_accounts(NEW.id);
    
    RAISE LOG 'handle_new_user: Default accounts created for %', NEW.id;
  EXCEPTION
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
      RAISE WARNING 'handle_new_user: Error creating default accounts: %', v_error_message;
      RAISE EXCEPTION 'Failed to create default accounts: %', v_error_message;
  END;

  -- Create demo data for demo user
  IF NEW.email = 'demo@invoicebeautifier.com' THEN
    BEGIN
      INSERT INTO public.transactions (user_id, reference, description, transaction_date, amount, debit_account_id, credit_account_id)
      SELECT 
        NEW.id,
        'DEMO-' || gen_random_uuid()::text,
        'Demo transaction',
        CURRENT_DATE - (random() * 30)::int,
        (random() * 10000 + 1000)::numeric,
        (SELECT id FROM public.accounts WHERE user_id = NEW.id AND code = '1000' LIMIT 1),
        (SELECT id FROM public.accounts WHERE user_id = NEW.id AND code = '4000' LIMIT 1)
      FROM generate_series(1, 10);
      
      RAISE LOG 'handle_new_user: Demo transactions created for %', NEW.id;
    EXCEPTION
      WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
        RAISE WARNING 'handle_new_user: Error creating demo transactions: %', v_error_message;
    END;
  END IF;

  RAISE LOG 'handle_new_user: Completed successfully for %', NEW.id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    GET STACKED DIAGNOSTICS v_error_message = MESSAGE_TEXT;
    RAISE EXCEPTION 'User creation failed: %', v_error_message;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Ensure RLS is properly configured
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
