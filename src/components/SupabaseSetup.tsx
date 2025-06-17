import React, { useState } from 'react';
import { Database, Settings, CheckCircle, AlertCircle, ExternalLink, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';

interface SupabaseSetupProps {
  error?: string;
}

const SupabaseSetup: React.FC<SupabaseSetupProps> = ({ error }) => {
  const [step, setStep] = useState(1);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<'url' | 'key' | 'env' | null>(null);

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
      title: 'Restart Development Server',
      description: 'Restart your server to apply the changes',
      action: 'Restart',
      link: null
    }
  ];

  const handleCopy = async (text: string, type: 'url' | 'key' | 'env') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const envFileContent = `# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl || 'your_supabase_project_url'}
VITE_SUPABASE_ANON_KEY=${supabaseKey || 'your_supabase_anon_key'}

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here`;

  const sqlSchema = `-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  category TEXT NOT NULL,
  sku TEXT,
  stock INTEGER,
  unit TEXT DEFAULT 'piece',
  taxable BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
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
  discount_value NUMERIC DEFAULT 0,
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
  rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_rates table
CREATE TABLE IF NOT EXISTS public.tax_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for products
CREATE POLICY "Users can view own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for invoices
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for invoice items
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

-- Create policies for tax rates
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl mb-6 shadow-2xl">
            <Database className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Supabase Setup Required
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your Invoice Beautifier needs to connect to Supabase for cloud storage, real-time sync, and user authentication.
          </p>
          
          {/* Error Display */}
          {error && (
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <div className="bg-red-100 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2">Common Solutions:</h4>
                      <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>Check if your .env file exists in the project root</li>
                        <li>Verify your Supabase URL starts with https://</li>
                        <li>Ensure your API key is the anon/public key, not the service role key</li>
                        <li>Confirm your Supabase project is active and not paused</li>
                        <li>Restart your development server after making changes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((stepItem, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                step > index + 1
                  ? 'bg-green-50 border-green-200 shadow-lg'
                  : step === index + 1
                  ? 'bg-blue-50 border-blue-200 ring-4 ring-blue-100 shadow-xl'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > index + 1
                    ? 'bg-green-500 text-white'
                    : step === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > index + 1 ? <CheckCircle size={20} /> : index + 1}
                </div>
                {step > index + 1 && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
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
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-100 hover:bg-blue-200 px-3 py-2 rounded-lg transition-colors"
                >
                  {stepItem.action}
                  <ExternalLink size={14} className="ml-2" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="w-8 h-8 mr-4 text-blue-600" />
            Environment Configuration
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Supabase Project URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                  placeholder="https://your-project-id.supabase.co"
                />
                {supabaseUrl && (
                  <button
                    onClick={() => handleCopy(supabaseUrl, 'url')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy URL"
                  >
                    {copied === 'url' ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Find this in your Supabase Dashboard → Settings → API → Project URL
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Supabase Anon Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-4 py-4 pr-20 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                  placeholder="Your anon key here"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {supabaseKey && (
                    <button
                      onClick={() => handleCopy(supabaseKey, 'key')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy key"
                    >
                      {copied === 'key' ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Find this in your Supabase Dashboard → Settings → API → Project API keys → anon public
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-3 text-lg">
                  Create .env file in your project root
                </h4>
                <p className="text-yellow-700 mb-4">
                  Create a file named <code className="bg-yellow-200 px-2 py-1 rounded font-mono text-sm">.env</code> in your project root directory and add these variables:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm relative">
                  <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto">
                    {envFileContent}
                  </pre>
                  <button
                    onClick={() => handleCopy(envFileContent, 'env')}
                    className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                    title="Copy .env content"
                  >
                    {copied === 'env' ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Restart Instructions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <RefreshCw className="w-6 h-6 text-blue-600 mr-4" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Important: Restart Required</h4>
                <p className="text-blue-700 mb-3">
                  After creating/updating your .env file, you must restart your development server:
                </p>
                <div className="bg-gray-900 rounded-lg p-3 font-mono text-green-400 text-sm">
                  npm run dev
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SQL Schema */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Database Schema Setup
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            After connecting to Supabase, copy and paste this SQL into your Supabase SQL Editor to create the required tables:
          </p>
          
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto relative">
            <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
              {sqlSchema}
            </pre>
            <button
              onClick={() => handleCopy(sqlSchema, 'env')}
              className="absolute top-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
              title="Copy SQL"
            >
              {copied === 'env' ? <CheckCircle size={20} className="text-green-400" /> : <Copy size={20} />}
            </button>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle size={16} className="mr-2" />
              Run this SQL in your Supabase dashboard under SQL Editor
            </div>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Open Supabase Dashboard
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Almost Ready!
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Once you've completed the setup and restarted your development server, your Invoice Beautifier will be connected to Supabase and ready to use.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-green-400 text-lg max-w-md mx-auto">
              npm run dev
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;