/*
  # Create demo user for testing

  This migration creates a demo user that can be used for testing the application
  without requiring actual email verification.
  
  Demo credentials:
  - Email: demo@invoicebeautifier.com
  - Password: demo123456
*/

-- Create demo user using Supabase's auth functions
-- This is safer than directly inserting into auth.users
DO $$
DECLARE
    demo_user_id uuid := '11111111-1111-1111-1111-111111111111';
    demo_email text := 'demo@invoicebeautifier.com';
    demo_password text := 'demo123456';
BEGIN
    -- Check if demo user already exists in public.users
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = demo_email) THEN
        -- Insert directly into public.users table
        -- The auth user will be created when they first sign up through the UI
        INSERT INTO public.users (
            id,
            email,
            full_name,
            created_at,
            updated_at
        ) VALUES (
            demo_user_id,
            demo_email,
            'Demo User',
            now(),
            now()
        );
        
        RAISE NOTICE 'Demo user profile created. Use email: % and password: % to sign up through the UI', demo_email, demo_password;
    ELSE
        RAISE NOTICE 'Demo user already exists';
    END IF;
END $$;

-- Create some sample data for the demo user
DO $$
DECLARE
    demo_user_id uuid := '11111111-1111-1111-1111-111111111111';
BEGIN
    -- Only create sample data if the user exists
    IF EXISTS (SELECT 1 FROM public.users WHERE id = demo_user_id) THEN
        
        -- Create sample products
        INSERT INTO public.products (
            user_id,
            name,
            description,
            price,
            currency,
            category,
            sku,
            stock,
            unit,
            taxable,
            is_active,
            tags
        ) VALUES 
        (
            demo_user_id,
            'Web Development Service',
            'Professional website development and design services',
            1500.00,
            'USD',
            'Services',
            'WEB-001',
            NULL,
            'hour',
            true,
            true,
            ARRAY['web', 'development', 'design']
        ),
        (
            demo_user_id,
            'Logo Design',
            'Custom logo design for businesses and startups',
            500.00,
            'USD',
            'Design',
            'LOGO-001',
            NULL,
            'piece',
            true,
            true,
            ARRAY['logo', 'design', 'branding']
        ),
        (
            demo_user_id,
            'Consulting Session',
            'One-on-one business consulting and strategy session',
            200.00,
            'USD',
            'Consulting',
            'CONS-001',
            NULL,
            'hour',
            true,
            true,
            ARRAY['consulting', 'strategy', 'business']
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE 'Sample products created for demo user';
    END IF;
END $$;