# Invoice Beautifier

A modern and intuitive web application for creating, managing, and sending professional invoices with ease. Built with React, TypeScript, and Supabase, Invoice Beautifier streamlines your billing process, offering customizable templates, product management, and secure data storage.

## 🚀 Live Demo

**Deployed Application:** [https://comforting-manatee-a901ed.netlify.app](https://comforting-manatee-a901ed.netlify.app)

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Supabase Setup](#supabase-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 **User Authentication**
- Secure sign-up and login powered by Supabase Auth
- Email-based authentication with password validation
- Protected routes and user session management

### 📄 **Invoice Management**
- Create, edit, duplicate, and delete invoices
- Real-time invoice preview as you build
- Dynamic calculation of subtotals, discounts, taxes, and grand totals
- Track invoice status (Draft, Sent, Paid, Overdue)
- Add custom tags for better organization
- Advanced filtering and search capabilities

### 🎨 **Customizable Templates**
Choose from 12 professional invoice templates:
- **Elegant** - Sophisticated design with serif typography
- **Modern** - Contemporary two-column layout
- **Corporate** - Professional business styling
- **Creative** - Unique artistic layout
- **Boutique** - Premium luxury feel
- **Minimal** - Clean and simple design
- **Dynamic** - Bold striking typography
- **Tech** - Futuristic design for technology companies
- **Vintage** - Classic retro appeal
- **Artistic** - Creative flair and unique style
- **Professional** - Executive-level formal business
- **Startup** - Modern casual design for new businesses

### 🎨 **Design Customization**
- 16 predefined professional accent colors
- Custom color picker for unlimited color options
- 12 beautiful font families to choose from
- Real-time preview of design changes

### 📦 **Product & Service Catalog**
- Comprehensive product database management
- Quick-add table for bulk product entry
- Track product stock, categories, and SKUs
- Multi-currency support
- Product search and filtering
- Inventory tracking with stock status indicators

### 📄 **PDF Export & Printing**
- Generate high-quality PDF versions of invoices
- Professional PDF formatting and layout
- Download or email PDFs directly
- Print functionality for physical copies

### 📧 **Email Integration**
- Send invoices with attached PDFs via multiple email services:
  - Gmail, Outlook, Yahoo Mail, Apple Mail, Thunderbird
- Auto-fill recipient email addresses
- Professional email templates

### 💳 **Payment QR Code Generation**
Generate QR codes for various payment methods:
- **UPI Direct** (India) - Pre-configured with developer's UPI ID
- **Google Pay** - UPI & Card payments
- **PayPal** - PayPal.me payment links
- **Stripe** - Stripe payment links
- **Generic** - Basic payment information

### 📱 **Responsive Design**
- Seamless experience across desktop, tablet, and mobile devices
- Modern glass-morphism UI design
- Smooth animations and micro-interactions

## 🛠 Technologies Used

### **Frontend**
- [React 18](https://react.dev/) - Modern React with hooks and context
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Fast build tool and dev server
- [React Router DOM](https://reactrouter.com/) - Client-side routing
- [Lucide React](https://lucide.dev/) - Beautiful icon library

### **Backend & Database**
- [Supabase](https://supabase.com/) - PostgreSQL database with real-time features
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

### **Utilities & Libraries**
- [html2canvas](https://html2canvas.hertzen.com/) - HTML to canvas conversion
- [jsPDF](https://jspdf.org/) - PDF generation
- [QRCode](https://www.npmjs.com/package/qrcode) - QR code generation
- [UUID](https://www.npmjs.com/package/uuid) - Unique identifier generation

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [Supabase Account](https://supabase.com/) (free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd invoice-beautifier
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Supabase Setup

Invoice Beautifier uses Supabase for authentication, database, and real-time features.

1. **Create a Supabase Project:**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Sign up or log in
   - Click "New project" and create a new project

2. **Get Project Credentials:**
   - Navigate to `Project Settings` → `API`
   - Copy your `Project URL` and `anon public` key

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Database Schema:**
   - Go to Supabase Dashboard → `SQL Editor`
   - Run the following SQL to create all necessary tables and policies:

   ```sql
   -- Create users table (extends Supabase auth.users)
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
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 📖 Usage

### Getting Started
1. **Authentication:** Sign up for a new account or log in
2. **Dashboard:** View invoice statistics and manage existing invoices
3. **Create Invoice:** Click "New Invoice" to start building
4. **Product Management:** Add products to your catalog for quick invoice creation
5. **Customize & Export:** Choose templates, colors, and export as PDF

### Key Features Guide

#### Creating an Invoice
1. Fill in company and client details
2. Add invoice items (manually or from product catalog)
3. Apply discounts and taxes as needed
4. Choose a template and customize colors/fonts
5. Generate QR codes for payments
6. Export as PDF or send via email

#### Managing Products
1. Navigate to the Products section
2. Use Quick Add Table for bulk product entry
3. Or use the detailed form for individual products
4. Organize with categories, tags, and stock tracking

#### Payment Integration
- Generate QR codes for various payment methods
- UPI payments pre-configured for Indian market
- Support for international payment providers

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── Products/        # Product management components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── InvoiceForm.tsx  # Invoice creation/editing
│   ├── InvoicePreview.tsx # Invoice preview component
│   └── ...
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication state
│   ├── InvoiceContext.tsx # Invoice management
│   └── ProductContext.tsx # Product management
├── lib/                 # External service configurations
│   └── supabase.ts     # Supabase client setup
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── pdfExport.ts    # PDF generation
│   ├── qrCode.ts       # QR code generation
│   └── ...
└── ...
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Add proper error handling
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Bolt](https://bolt.new) - AI-powered development platform
- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern design systems
- Special thanks to the open-source community

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

---

**Made with ❤️ using modern web technologies**