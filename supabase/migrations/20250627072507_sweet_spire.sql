/*
  # Create demo user data without violating foreign key constraints

  This migration creates sample data that can be used for demo purposes.
  The demo user will need to sign up normally through the UI with:
  - Email: demo@invoicebeautifier.com
  - Password: demo123456
  
  Once they sign up, they will automatically get the sample products created here.
*/

-- Create a function to set up demo data for a user
CREATE OR REPLACE FUNCTION setup_demo_data_for_user(user_id uuid)
RETURNS void AS $$
BEGIN
    -- Create sample products for the user
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
        user_id,
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
        user_id,
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
        user_id,
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
    ),
    (
        user_id,
        'Mobile App Development',
        'Native iOS and Android app development',
        3000.00,
        'USD',
        'Development',
        'APP-001',
        NULL,
        'project',
        true,
        true,
        ARRAY['mobile', 'app', 'ios', 'android']
    ),
    (
        user_id,
        'SEO Optimization',
        'Search engine optimization and digital marketing',
        800.00,
        'USD',
        'Marketing',
        'SEO-001',
        NULL,
        'month',
        true,
        true,
        ARRAY['seo', 'marketing', 'optimization']
    )
    ON CONFLICT DO NOTHING;
    
    -- Create a sample invoice
    INSERT INTO public.invoices (
        user_id,
        number,
        issue_date,
        due_date,
        company_name,
        company_email,
        company_phone,
        company_address,
        client_name,
        client_email,
        client_address,
        notes,
        template,
        accent_color,
        font,
        show_footer,
        discount_type,
        discount_value,
        currency,
        status,
        tags
    ) VALUES (
        user_id,
        'INV-2024-DEMO',
        CURRENT_DATE,
        CURRENT_DATE + INTERVAL '30 days',
        'Demo Company Inc.',
        'demo@invoicebeautifier.com',
        '+1 (555) 123-4567',
        '123 Business Street, Suite 100, Business City, BC 12345',
        'Sample Client Corp',
        'client@example.com',
        '456 Client Avenue, Client City, CC 67890',
        'Thank you for your business! This is a sample invoice created for demonstration purposes.',
        'elegant',
        '#223141',
        'inter',
        true,
        'percentage',
        10.0,
        'USD',
        'draft',
        ARRAY['demo', 'sample']
    )
    ON CONFLICT DO NOTHING;
    
    -- Get the invoice ID for adding items
    INSERT INTO public.invoice_items (
        invoice_id,
        description,
        quantity,
        rate
    )
    SELECT 
        i.id,
        'Web Development Service',
        40,
        75.00
    FROM public.invoices i 
    WHERE i.user_id = user_id AND i.number = 'INV-2024-DEMO'
    ON CONFLICT DO NOTHING;
    
    INSERT INTO public.invoice_items (
        invoice_id,
        description,
        quantity,
        rate
    )
    SELECT 
        i.id,
        'Logo Design',
        1,
        500.00
    FROM public.invoices i 
    WHERE i.user_id = user_id AND i.number = 'INV-2024-DEMO'
    ON CONFLICT DO NOTHING;
    
    -- Add tax rate
    INSERT INTO public.tax_rates (
        invoice_id,
        name,
        rate
    )
    SELECT 
        i.id,
        'Sales Tax',
        8.5
    FROM public.invoices i 
    WHERE i.user_id = user_id AND i.number = 'INV-2024-DEMO'
    ON CONFLICT DO NOTHING;
    
END;
$$ LANGUAGE plpgsql;

-- Update the user creation trigger to set up demo data for demo users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  -- If this is the demo user, set up sample data
  IF NEW.email = 'demo@invoicebeautifier.com' THEN
    PERFORM setup_demo_data_for_user(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a comment for documentation
COMMENT ON FUNCTION setup_demo_data_for_user(uuid) IS 'Sets up sample products and invoices for demo users';
COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile and sets up demo data for demo@invoicebeautifier.com';