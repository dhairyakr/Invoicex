/*
  # Create demo user for testing

  1. New User Creation
    - Creates a demo user in auth.users table with email 'demo@invoicebeautifier.com'
    - Sets up the user with proper authentication credentials
    - Creates corresponding profile in public.users table

  2. Security
    - Uses secure password hashing
    - Maintains proper foreign key relationships
    - Follows existing RLS policies

  3. Notes
    - This is for demo/testing purposes
    - Password is 'demo123456' as specified in the frontend
    - User will be able to sign in immediately after migration
*/

-- Insert demo user into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'demo@invoicebeautifier.com',
  crypt('demo123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding profile in public.users table
INSERT INTO public.users (
  id,
  email,
  full_name,
  created_at,
  updated_at
) 
SELECT 
  au.id,
  au.email,
  'Demo User',
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'demo@invoicebeautifier.com'
ON CONFLICT (id) DO NOTHING;