/*
  # Create demo user for testing

  This migration creates a demo user account that can be used for testing the application
  without requiring users to sign up with real credentials.
  
  Demo credentials:
  - Email: demo@invoicebeautifier.com
  - Password: demo123456
*/

-- First, check if the demo user already exists and delete if present
-- This ensures we can recreate the user cleanly
DELETE FROM auth.users WHERE email = 'demo@invoicebeautifier.com';

-- Insert demo user into auth.users table
-- Note: We're using a fixed UUID for consistency
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
  role,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  last_sign_in_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
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
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo User"}',
  false,
  now()
);

-- Create corresponding profile in public.users table
-- This will be handled by the trigger, but we'll ensure it exists
INSERT INTO public.users (
  id,
  email,
  full_name,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'demo@invoicebeautifier.com',
  'Demo User',
  now(),
  now()
);