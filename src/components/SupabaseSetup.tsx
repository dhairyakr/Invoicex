import React, { useState } from 'react';
import { Database, Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const SupabaseSetup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const steps = [
    {
      title: 'Create Supabase Project',
      description: 'Sign up and create a new project on Supabase',
      action: 'Go to Supabase',
      link: 'https://supabase.com/dashboard'
    },
    {
      title: 'Get Project Credentials',
      description: 'Copy your project URL and anon key from Settings > API',
      action: 'Open Settings',
      link: null
    },
    {
      title: 'Set Environment Variables',
      description: 'Add your credentials to the .env file',
      action: 'Configure',
      link: null
    },
    {
      title: 'Run Database Migration',
      description: 'Create the required tables in your database',
      action: 'Run Migration',
      link: null
    }
  ];

  const sqlSchema = `-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  number TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_phone TEXT NOT NULL,
  company_address TEXT NOT NULL,
  company_logo TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_address TEXT NOT NULL,
  notes TEXT,
  template TEXT DEFAULT 'elegant',
  accent_color TEXT DEFAULT '#223141',
  font TEXT DEFAULT 'inter',
  show_footer BOOLEAN DEFAULT true,
  discount_type TEXT DEFAULT 'percentage',
  discount_value DECIMAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft',
  tags TEXT[] DEFAULT '{}',
  payment_method TEXT,
  payment_details TEXT,
  payment_qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  rate DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_rates table
CREATE TABLE IF NOT EXISTS public.tax_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  rate DECIMAL NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own invoice items" ON public.invoice_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own tax rates" ON public.tax_rates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = tax_rates.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own tax rates" ON public.tax_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = tax_rates.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supabase Database Setup
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your Invoice Beautifier to Supabase for cloud storage, real-time sync, and user authentication.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((stepItem, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                step > index + 1
                  ? 'bg-green-50 border-green-200'
                  : step === index + 1
                  ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-100'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > index + 1 ? <CheckCircle size={16} /> : index + 1}
                </div>
                {step > index + 1 && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {stepItem.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {stepItem.description}
              </p>
              
              {stepItem.link && (
                <a
                  href={stepItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {stepItem.action}
                  <ExternalLink size={14} className="ml-1" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-3" />
            Environment Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-project-id.supabase.co"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supabase Anon Key
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your anon key here"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-1">
                  Create .env file
                </h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Create a <code>.env</code> file in your project root with these variables:
                </p>
                <div className="bg-yellow-100 rounded p-3 font-mono text-sm">
                  <div>VITE_SUPABASE_URL={supabaseUrl || 'your_supabase_project_url'}</div>
                  <div>VITE_SUPABASE_ANON_KEY={supabaseKey || 'your_supabase_anon_key'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Schema */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Database Schema
          </h2>
          <p className="text-gray-600 mb-4">
            Copy and paste this SQL into your Supabase SQL Editor to create the required tables:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {sqlSchema}
            </pre>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle size={16} className="mr-2" />
              Run this SQL in your Supabase dashboard under SQL Editor
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(sqlSchema)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy SQL
            </button>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Go!
            </h3>
            <p className="text-gray-600 mb-6">
              Once you've completed the setup, restart your development server to connect to Supabase.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-green-400 text-sm">
              npm run dev
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;