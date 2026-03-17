# Invoice Beautifier

A complete, production-grade invoicing and accounting platform for freelancers, agencies, and small businesses. Built with React, TypeScript, and Supabase, Invoice Beautifier combines professional invoice creation with full double-entry accounting, financial reporting, and collections management — all in one application.

---
<img width="1438" height="838" alt="image" src="https://github.com/user-attachments/assets/d067609e-3cf2-4fae-96e8-b3d1f40e484b" />
<img width="1439" height="822" alt="image" src="https://github.com/user-attachments/assets/4c4575a4-d31c-4315-a086-f5b08d46d853" />
<img width="1441" height="802" alt="image" src="https://github.com/user-attachments/assets/38dcbc08-b558-4a15-b972-02a169f1e3b5" />
<img width="1446" height="840" alt="image" src="https://github.com/user-attachments/assets/dccf3677-ed0a-4db1-97ac-4eeb0cc3fed3" />
<img width="1447" height="840" alt="image" src="https://github.com/user-attachments/assets/91068a2f-c71f-40cb-8f18-3ebf3cc86f00" />

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Invoice Management](#invoice-management)
  - [Invoice Templates](#invoice-templates)
  - [Design Customization](#design-customization)
  - [Product & Service Catalog](#product--service-catalog)
  - [Financial Reports](#financial-reports)
  - [Accounting & Bookkeeping](#accounting--bookkeeping)
  - [Collections Management](#collections-management)
  - [Payment QR Codes](#payment-qr-codes)
  - [PDF Export & Email](#pdf-export--email)
  - [Settings & Configuration](#settings--configuration)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

Invoice Beautifier is more than an invoice generator. It is a full accounting platform that handles the entire billing and financial lifecycle:

- Create and send beautiful, customizable invoices
- Track payments and manage overdue accounts
- Run real-time financial reports (P&L, Balance Sheet, Cash Flow, Trial Balance)
- Manage a complete chart of accounts with double-entry bookkeeping
- Automate collections with workflows, reminders, and escalation tracking
- Maintain a product/service catalog for quick invoice creation

---

## Features

### Invoice Management

**Create & Edit**
- Three-panel invoice builder: details form, live preview, template selector
- Auto-generated invoice numbers with customizable format
- Company and client information with logo upload
- Dynamic line items — add/remove rows with description, quantity, and rate
- Discount management: percentage-based or fixed-amount discounts
- Multiple tax rates with custom names and percentages
- Multi-currency support: USD, EUR, GBP, CAD, AUD, JPY, INR
- Notes and internal reference fields
- Tag-based organization for filtering and grouping

**Dashboard & Management**
- Invoice statistics: total count, total revenue, paid count, pending/overdue count
- Advanced filtering: by status, date range, tags, and search term
- Status workflow: Draft → Sent → Paid / Overdue
- Inline status updates without leaving the dashboard
- Duplicate invoice with one click
- Quick send via email directly from the list
- Multi-currency revenue tracking with currency selector

**Calculations (real-time)**
- Line item subtotals
- Total before discount
- Discount amount
- Tax amounts (stacked, multiple rates)
- Grand total
- All values update live as you type

---

### Invoice Templates

Twelve professionally designed, fully rendered templates:

| Template | Style Description |
|---|---|
| Elegant | Sophisticated serif typography with decorative header |
| Modern | Contemporary two-column layout with bold accents |
| Corporate | Classic professional layout for formal businesses |
| Creative | Unique artistic layout for creative professionals |
| Boutique | Premium luxury feel for high-end service providers |
| Minimal | Clean whitespace-driven design |
| Dynamic | Bold, striking typography for maximum impact |
| Tech | Futuristic design with geometric elements |
| Vintage | Classic retro styling with aged paper feel |
| Artistic | Creative flair for design studios and artists |
| Professional | Executive-level formal business document |
| Startup | Modern casual design for growing companies |

Each template adapts to your selected accent color, font, and company branding.

---

### Design Customization

- **Colors:** 16 curated professional accent colors plus a full custom color picker for unlimited options
- **Fonts:** 12 font families — Inter, Roboto, Montserrat, Playfair Display, Open Sans, Lato, Poppins, Source Sans Pro, Nunito, Merriweather, Raleway, Crimson Text
- **Live preview:** Every design change reflects instantly in the preview panel
- **Footer toggle:** Show or hide the invoice footer
- **Persistent defaults:** Save your preferred template, colors, and fonts in settings

---

### Product & Service Catalog

- Create and manage a reusable library of products and services
- Fields: name, description, price, SKU, stock quantity, unit type, category, tags
- Unit types: piece, hour, kg, meter, liter, service, project, and more
- Mark items as taxable or non-taxable
- Activate or deactivate items without deleting them
- **Three view modes:** Grid cards, list view, or quick-add table
- Bulk entry via the spreadsheet-style quick-add table
- Search and filter by name, category, tags, or price range
- Inventory value calculation across currencies
- Statistics panel: total products, active/inactive breakdown, total catalog value
- Product selector modal for inserting items directly into invoice line items

---

### Financial Reports

Access six report types from the Reports section, with date range selection, period grouping (monthly, quarterly, yearly), and department filtering.

#### Profit & Loss Statement
- Revenue broken down by account category
- Expenses broken down by type
- Net profit and net margin calculations
- Percentage-of-revenue column for each line
- Trend visualization: area chart, bar chart, or pie chart
- Drill-down to see individual transactions behind any figure
- Monthly, quarterly, or yearly period views
- Department-level filtering (Sales, Marketing, Operations, Admin)

#### Balance Sheet
- Assets section: current assets (cash, accounts receivable, prepaid) and fixed assets (equipment, accumulated depreciation)
- Liabilities section: current liabilities (accounts payable, accrued expenses) and long-term liabilities (loans, debt)
- Equity section: share capital, retained earnings
- **Financial ratio panel:**
  - Current Ratio
  - Quick Ratio
  - Debt-to-Equity Ratio
  - Debt-to-Assets Ratio
  - Working Capital
  - Overall Health Score with color-coded indicator
- Vertical analysis: each line as a percentage of total assets
- Comparative view across multiple periods
- Historical data chart
- Account-level drill-down for every line item

#### Cash Flow Statement
- Operating activities (cash from core business operations)
- Investing activities (capital expenditures, equipment purchases)
- Financing activities (loans, equity, dividends)
- Beginning and ending cash balance reconciliation
- Net cash flow visualization
- Multi-period comparison chart

#### Trial Balance & General Ledger
- All accounts listed with opening balance, debits, credits, and closing balance
- Balance verification (debits must equal credits)
- Variance detection and highlighting
- T-account visual representation for any account
- General ledger transaction drill-down
- Account activity levels and transaction counts
- Reconciliation status per account

#### Aged Receivables & Payables
- Aging buckets: Current, 1-30 days, 31-60 days, 61-90 days, 90+ days
- Customer-level and vendor-level breakdowns
- Outstanding balance totals per bucket
- Collection workflow status indicators
- Customer/vendor profile cards with contact information
- Risk rating display (Low, Medium, High, Critical)
- Direct link to collection activity history from aging entries

#### Chart of Accounts
- Complete account hierarchy with parent-child relationships
- Account codes, names, types, and descriptions
- Account types: Asset, Liability, Equity, Revenue, Expense
- Subtypes for granular classification
- Create, edit, activate, and archive accounts
- Tag assignments (Tax Deductible, Recurring, Priority, Billable)
- Reconciliation requirements per account
- Budget vs. actual tracking
- Account notes with importance flag
- Audit log of all changes

---

### Accounting & Bookkeeping

**Chart of Accounts**

A full double-entry chart of accounts is automatically created when you sign up, covering:
- `1000–1600` Assets: Cash, Accounts Receivable, Inventory, Prepaid Expenses, Equipment, Accumulated Depreciation
- `2000–2500` Liabilities: Accounts Payable, Short-term Loans, Accrued Expenses, Long-term Debt
- `3000–3100` Equity: Share Capital, Retained Earnings
- `4000–4900` Revenue: Sales Revenue, Service Revenue, Other Income
- `5000–6900` Expenses: COGS, Salaries, Rent, Marketing, Office Expenses, Utilities, Professional Services, Other Expenses

**Journal Entries**
- Manual journal entry creation with multiple debit/credit lines
- Debit and credit account selection from the chart of accounts
- Amount, date, reference number, and description fields
- Balance verification: entries must balance before saving
- Status management: Draft or Posted
- Batch entry for multiple journal lines per entry

**Transactions**
- Every invoice, payment, and journal entry creates a double-entry transaction record
- Transaction types: Invoice, Payment, Journal, Adjustment, Opening Balance, Closing Entry
- Reference numbers, descriptions, and timestamps on every record
- Linked to invoices and journals for full traceability
- Quick Transaction Entry panel for fast posting without the full journal entry form

**Financial Periods**
- Define fiscal years and quarters
- Close periods to lock historical data
- Period selection in all reports for accurate comparative analysis

**Account Reconciliation**
- Mark accounts as reconciled after matching bank statements
- Reconciliation date, statement balance, and book balance fields
- Discrepancy detection with highlighted variances
- Reconciliation status visible in the chart of accounts

**Budget Management**
- Set annual budget amounts per expense account
- Track actual spending vs. budget in real time
- Variance calculations with visual indicators

---

### Collections Management

A full accounts receivable collections module built into the platform.

**Customer & Vendor Profiles**
- Separate customer and vendor records with full contact details
- Credit limits and payment terms (days)
- Risk rating: Low, Medium, High, Critical
- Active/inactive status
- Free-text notes per contact

**Collection Activities**
Log every customer interaction against specific invoices:
- Activity types: Call, Email, SMS, Meeting, Note, Payment Promise, Dispute, Legal Action
- Outcome and status recording per activity
- Follow-up date scheduling
- Assigned-to field for team-based collections
- Full chronological activity feed per invoice and per customer

**Payment Promises**
- Record customer promises to pay with expected amount and date
- Track fulfillment: Pending, Kept, Broken, Partial
- Actual amount and actual date fields when promises are fulfilled
- Broken promise tracking for escalation decisions

**Collection Workflows**
- Automated workflow stages: Current → Reminder → Follow Up → Escalated → Legal → Write-Off
- Priority levels: Low, Medium, High, Critical
- Escalation level tracking (0–5)
- Disputed invoice flag
- Last contact date and next action date
- Notes per workflow for team handoffs

**Reminder Templates**
- Pre-built email and SMS reminder templates
- Template stages: Friendly, Firm, Final Notice, Legal
- Placeholder variables: `{{client_name}}`, `{{invoice_number}}`, `{{amount}}`, `{{due_date}}`, `{{days_overdue}}`
- Active/inactive toggle per template
- Custom subject lines for email templates

---

### Payment QR Codes

Generate scannable QR codes for payment collection and embed them directly in invoices.

| Provider | Supported Currencies | Notes |
|---|---|---|
| UPI Direct | INR | For Indian market, direct UPI payment |
| Google Pay | INR, USD, EUR, GBP | UPI and card payments |
| PayPal | USD, EUR, GBP, CAD, AUD | PayPal.me payment links |
| Stripe | All major currencies | Stripe payment link integration |
| Generic | All currencies | Universal payment information QR |

QR codes can include the invoice amount, recipient name, and reference number, so clients can scan and pay in seconds.

---

### PDF Export & Email

**PDF Export**
- High-quality PDF generation preserving the full template design
- A4 paper size (210mm x 297mm)
- All custom colors, fonts, and logos rendered accurately
- Automatic filename: `Invoice-{number}.pdf`
- Download locally or attach to email

**Email Integration**
- Send invoices with PDF attachments via:
  - Gmail
  - Outlook
  - Yahoo Mail
  - Apple Mail
  - Thunderbird
- Auto-fills recipient email from invoice client details
- Auto-generated subject line with invoice number and amount
- Professional email body template

**Print**
- Print-optimized CSS for physical copies
- Page break handling for multi-page invoices
- All elements print correctly including logos and custom colors

---

### Settings & Configuration

**Profile**
- Full name and email display
- Avatar/profile picture upload
- Account preferences

**Business Information**
- Company name, registration number, tax ID / VAT number
- Business address and contact details
- Industry type
- Default banking information and payment methods

**Invoice Defaults**
- Default template selection
- Default accent color
- Default font family
- Default payment terms (number of days)
- Default tax rate
- Default discount settings
- Invoice number format and starting number
- Default footer content

**Notifications**
- Email notification preferences per event type
- Invoice due-date reminders
- Payment received notifications
- Overdue invoice alerts
- Notification frequency controls

**Security**
- Change password
- Two-factor authentication settings
- Active session management
- Security alert preferences

**Data & Privacy**
- Export all account data
- Data deletion controls
- Privacy policy and terms of service links
- GDPR compliance information

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.5.3 | Type-safe JavaScript |
| Vite | 5.4.2 | Build tool and dev server |
| React Router DOM | 6.22.3 | Client-side routing |
| Tailwind CSS | 3.4.1 | Utility-first CSS |
| Lucide React | 0.344.0 | Icon library |
| Recharts | 3.5.1 | Charts and data visualization |

### Backend & Database
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL database, authentication, real-time subscriptions |
| Row Level Security (RLS) | Per-user data isolation and security |
| Supabase Auth | Email/password authentication with session management |
| Supabase Edge Functions | Serverless backend logic |

### Libraries & Utilities
| Library | Version | Purpose |
|---|---|---|
| jsPDF | 2.5.1 | PDF document generation |
| jsPDF-AutoTable | 5.0.2 | Table rendering in PDF files |
| html2canvas | 1.4.1 | HTML to image/canvas conversion for PDF export |
| qrcode | 1.5.3 | QR code image generation |
| uuid | 9.0.1 | Unique identifier generation |

---

## Database Schema

The full schema is applied via migrations in `supabase/migrations/`. Key tables:

| Table | Description |
|---|---|
| `users` | User profiles, extends `auth.users` |
| `invoices` | Invoice headers with all billing details |
| `invoice_items` | Line items belonging to invoices |
| `tax_rates` | Tax rate entries per invoice |
| `products` | Product and service catalog |
| `accounts` | Chart of accounts (assets, liabilities, equity, revenue, expenses) |
| `transactions` | Double-entry transaction records |
| `journals` | Manual journal entry headers |
| `payments` | Payment records linked to invoices |
| `financial_periods` | Fiscal years and quarters |
| `customer_vendors` | Customer and vendor contact profiles |
| `collection_activities` | Collections activity log per invoice/contact |
| `payment_promises` | Promise-to-pay records with fulfillment tracking |
| `collection_workflows` | Collections workflow stages and escalation |
| `reminder_templates` | Email and SMS reminder templates |
| `account_tags` | Custom labels for accounts |
| `account_tag_assignments` | Many-to-many tag assignments |
| `account_reconciliations` | Bank reconciliation records |
| `account_budgets` | Budget vs. actual per account per fiscal year |
| `account_notes` | Free-text notes per account |
| `account_audit_log` | Audit trail of all account changes |

All tables have Row Level Security enabled. Users can only access their own data.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account (free tier is sufficient)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd invoice-beautifier
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Apply database migrations by running each file in `supabase/migrations/` in order through the Supabase SQL Editor, or using the Supabase CLI:
   ```bash
   supabase db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

### First Run

1. Open the app and click **Sign Up** to create your account
2. You will be automatically redirected to the Dashboard
3. A default chart of accounts is created for you automatically
4. To populate the app with realistic demo data, navigate to `/setup` and use the sample data tool
5. Begin by creating your first invoice via the **New Invoice** button

---

## Project Structure

```
invoice-beautifier/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── Auth/                  # Login, signup, auth modal
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── AuthPage.tsx
│   │   │   └── AuthModal.tsx
│   │   ├── Products/              # Product catalog management
│   │   │   ├── ProductManager.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductSelector.tsx
│   │   │   └── QuickAddTable.tsx
│   │   ├── reports/               # All financial report components
│   │   │   ├── ProfitLoss.tsx
│   │   │   ├── EnhancedBalanceSheet.tsx
│   │   │   ├── EnhancedCashFlow.tsx
│   │   │   ├── EnhancedTrialBalanceLedger.tsx
│   │   │   ├── EnhancedAgedReceivablesPayables.tsx
│   │   │   ├── EnhancedAccountManagement.tsx
│   │   │   ├── JournalEntryModal.tsx
│   │   │   ├── QuickTransactionEntry.tsx
│   │   │   ├── PaymentRecordModal.tsx
│   │   │   ├── AccountDetailsModal.tsx
│   │   │   ├── TAccountVisualization.tsx
│   │   │   ├── CustomerVendorProfile.tsx
│   │   │   ├── AgingCharts.tsx
│   │   │   ├── AgingFilters.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── ReminderModal.tsx
│   │   ├── Settings/              # Settings section components
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── BusinessInfoSection.tsx
│   │   │   ├── InvoiceDefaultsSection.tsx
│   │   │   ├── NotificationSection.tsx
│   │   │   ├── SecuritySection.tsx
│   │   │   └── PrivacySection.tsx
│   │   ├── Dashboard.tsx          # Main invoice dashboard
│   │   ├── FinancialReports.tsx   # Reports navigation hub
│   │   ├── InvoiceForm.tsx        # Invoice creation and editing
│   │   ├── InvoicePreview.tsx     # All 12 template renderers
│   │   ├── TemplateSelector.tsx   # Template browser
│   │   ├── PaymentQRGenerator.tsx # QR code generation
│   │   ├── SampleDataSetup.tsx    # Demo data tool
│   │   ├── Header.tsx             # App navigation
│   │   ├── ErrorBoundary.tsx      # Error handling wrapper
│   │   ├── LoadingAnimation.tsx   # Loading states
│   │   ├── SkeletonLoader.tsx     # Skeleton screens
│   │   └── ConnectionStatus.tsx   # Sync status indicator
│   ├── context/
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── InvoiceContext.tsx     # Invoice CRUD and state
│   │   └── ProductContext.tsx     # Product catalog state
│   ├── hooks/
│   │   ├── useSupabaseInvoices.ts # Invoice data fetching hook
│   │   ├── useFinancialData.ts    # Financial data aggregation hook
│   │   └── useReportCache.ts      # Report caching hook
│   ├── lib/
│   │   └── supabase.ts            # Supabase client singleton
│   ├── pages/
│   │   └── Settings.tsx           # Settings page layout
│   ├── types/
│   │   ├── index.ts               # Application type definitions
│   │   ├── database.ts            # Supabase database types
│   │   └── google-pay.d.ts        # Google Pay type declarations
│   ├── utils/
│   │   ├── pdfExport.ts           # PDF generation logic
│   │   ├── qrCode.ts              # QR code utilities
│   │   ├── helpers.ts             # General helper functions
│   │   ├── fileHandling.ts        # File upload utilities
│   │   ├── communication.ts       # Email integration utilities
│   │   ├── seedData.ts            # Demo data generation
│   │   ├── financialRatios.ts     # Financial ratio calculations
│   │   ├── agingAnalytics.ts      # Accounts receivable aging logic
│   │   ├── trialBalanceUtils.ts   # Trial balance computations
│   │   ├── trialBalanceExport.ts  # Trial balance PDF export
│   │   └── googlePay.ts           # Google Pay integration
│   ├── App.tsx                    # Root component and routing
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── supabase/
│   ├── functions/                 # Supabase Edge Functions
│   │   └── seed-sample-data/      # Demo data seeder function
│   └── migrations/                # Database migration files
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | Dashboard | Invoice management dashboard |
| `/auth` | AuthPage | Login/signup landing |
| `/login` | LoginPage | User login |
| `/signup` | SignUpPage | New account registration |
| `/create` | InvoiceForm | Create a new invoice |
| `/edit/:id` | InvoiceForm | Edit an existing invoice |
| `/preview/:id` | InvoicePreview | View invoice preview |
| `/templates` | TemplateSelector | Browse and select templates |
| `/products` | ProductManager | Product and service catalog |
| `/reports` | FinancialReports | Financial reports and accounting |
| `/settings` | Settings | Account and application settings |
| `/setup` | SampleDataSetup | Sample data population tool |

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code conventions
4. Ensure the project builds without errors: `npm run build`
5. Commit your changes: `git commit -m "Add your feature description"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request with a clear description of your changes

**Development guidelines:**
- Use TypeScript for all new code
- Follow existing component patterns and naming conventions
- Use Tailwind CSS utility classes for styling; avoid inline styles
- Keep components focused on a single responsibility
- Add RLS policies for any new database tables
- Never expose secrets or credentials in client-side code

---

## License

This project is licensed under the MIT License.

---

