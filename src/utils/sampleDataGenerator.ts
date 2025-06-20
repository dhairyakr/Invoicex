import { faker } from '@faker-js/faker';
import { Product, Invoice, InvoiceItem, TaxRate } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a single realistic fake product.
 * @param userId The user ID to associate with the product.
 * @returns A fake Product object.
 */
export const generateFakeProduct = (userId: string): Product => {
  const categories = [
    'Software', 'Hardware', 'Services', 'Consulting', 'Design',
    'Development', 'Marketing', 'Training', 'Support', 'Maintenance',
    'Products', 'Subscriptions', 'Other', 'Electronics', 'Apparel',
    'Home Goods', 'Books', 'Food & Beverage', 'Health & Beauty',
    'Sports', 'Automotive', 'Tools', 'Office Supplies'
  ];
  
  const units = [
    'piece', 'hour', 'day', 'week', 'month', 'year',
    'kg', 'gram', 'pound', 'meter', 'foot', 'inch',
    'liter', 'gallon', 'box', 'pack', 'set', 'license'
  ];
  
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];
  
  const tags = [
    'new', 'sale', 'popular', 'limited', 'eco-friendly', 'bestseller',
    'premium', 'budget', 'trending', 'featured', 'seasonal', 'exclusive'
  ];

  return {
    id: faker.string.uuid(),
    userId: userId,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 1, max: 2000, dec: 2 })),
    currency: faker.helpers.arrayElement(currencies),
    category: faker.helpers.arrayElement(categories),
    sku: faker.string.alphaNumeric(8).toUpperCase(),
    stock: faker.number.int({ min: 0, max: 500 }),
    unit: faker.helpers.arrayElement(units),
    taxable: faker.datatype.boolean(0.8), // 80% chance of being taxable
    isActive: faker.datatype.boolean(0.9), // 90% chance of being active
    tags: faker.helpers.arrayElements(tags, { min: 0, max: 4 }),
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 60 }).toISOString(),
  };
};

/**
 * Generates an array of fake products.
 * @param count The number of products to generate.
 * @param userId The user ID to associate with the products.
 * @returns An array of fake Product objects.
 */
export const generateFakeProducts = (count: number, userId: string): Product[] => {
  return Array.from({ length: count }, () => generateFakeProduct(userId));
};

/**
 * Generates realistic invoice items based on available products.
 * @param products Available products to choose from.
 * @param itemCount Number of items to generate.
 * @returns Array of invoice items.
 */
export const generateInvoiceItems = (products: Product[], itemCount: number = 3): InvoiceItem[] => {
  const items: InvoiceItem[] = [];
  
  for (let i = 0; i < itemCount; i++) {
    const product = faker.helpers.arrayElement(products);
    items.push({
      id: uuidv4(),
      description: product.name,
      quantity: faker.number.int({ min: 1, max: 10 }),
      rate: product.price,
    });
  }
  
  return items;
};

/**
 * Generates realistic tax rates for an invoice.
 * @returns Array of tax rates.
 */
export const generateTaxRates = (): TaxRate[] => {
  const taxTypes = [
    { name: 'VAT', rate: 20 },
    { name: 'Sales Tax', rate: 8.5 },
    { name: 'GST', rate: 18 },
    { name: 'Service Tax', rate: 15 },
    { name: 'State Tax', rate: 6 },
  ];
  
  // 70% chance of having tax, 30% chance of no tax
  if (faker.datatype.boolean(0.3)) {
    return [];
  }
  
  const selectedTax = faker.helpers.arrayElement(taxTypes);
  return [{
    id: uuidv4(),
    name: selectedTax.name,
    rate: selectedTax.rate + faker.number.float({ min: -2, max: 2, fractionDigits: 1 }),
  }];
};

/**
 * Generates a realistic company profile.
 * @returns Company object with realistic business information.
 */
export const generateCompanyProfile = () => {
  const companyName = faker.company.name();
  
  return {
    name: companyName,
    email: faker.internet.email({ firstName: 'info', lastName: companyName.toLowerCase().replace(/\s+/g, '') }),
    phone: faker.phone.number(),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
    logo: undefined, // We don't generate actual logo files
  };
};

/**
 * Generates a realistic client profile.
 * @returns Client object with realistic information.
 */
export const generateClientProfile = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const companyName = faker.company.name();
  
  return {
    name: faker.datatype.boolean(0.7) ? `${firstName} ${lastName}` : companyName,
    email: faker.internet.email({ firstName, lastName }),
    address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()} ${faker.location.zipCode()}`,
  };
};

/**
 * Generates a single realistic fake invoice.
 * @param userId The user ID to associate with the invoice.
 * @param products Available products for invoice items.
 * @returns A fake Invoice object.
 */
export const generateFakeInvoice = (userId: string, products: Product[]): Invoice => {
  const issueDate = faker.date.past({ years: 1 });
  const dueDate = faker.date.future({ days: 30, refDate: issueDate });
  
  const statuses = ['draft', 'sent', 'paid', 'overdue'];
  const templates = [
    'elegant', 'minimal', 'corporate', 'modern', 'creative', 
    'boutique', 'dynamic', 'tech', 'vintage', 'artistic', 
    'professional', 'startup'
  ];
  
  const fonts = [
    'inter', 'roboto', 'montserrat', 'playfair', 'opensans',
    'lato', 'poppins', 'sourcesans', 'nunito', 'merriweather'
  ];
  
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];
  
  const invoiceTags = [
    'urgent', 'recurring', 'project', 'consultation', 'maintenance',
    'development', 'design', 'marketing', 'support', 'training'
  ];

  const items = generateInvoiceItems(products, faker.number.int({ min: 1, max: 6 }));
  const taxRates = generateTaxRates();
  
  return {
    id: uuidv4(),
    number: `INV-${faker.date.recent().getFullYear()}-${faker.number.int({ min: 1000, max: 9999 })}`,
    issueDate: issueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    company: generateCompanyProfile(),
    client: generateClientProfile(),
    items: items,
    notes: faker.datatype.boolean(0.6) ? faker.lorem.paragraph() : '',
    template: faker.helpers.arrayElement(templates),
    accentColor: faker.internet.color(),
    font: faker.helpers.arrayElement(fonts),
    showFooter: faker.datatype.boolean(0.8),
    discountType: faker.helpers.arrayElement(['percentage', 'fixed']),
    discountValue: faker.datatype.boolean(0.3) ? faker.number.float({ min: 0, max: 20, fractionDigits: 2 }) : 0,
    taxRates: taxRates,
    currency: faker.helpers.arrayElement(currencies),
    status: faker.helpers.arrayElement(statuses),
    tags: faker.helpers.arrayElements(invoiceTags, { min: 0, max: 3 }),
    paymentInfo: faker.datatype.boolean(0.4) ? {
      method: faker.helpers.arrayElement(['Bank Transfer', 'PayPal', 'Stripe', 'UPI']),
      details: faker.lorem.sentence(),
      qrCode: undefined,
    } : undefined,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  };
};

/**
 * Generates an array of fake invoices.
 * @param count The number of invoices to generate.
 * @param userId The user ID to associate with the invoices.
 * @param products Available products for invoice items.
 * @returns An array of fake Invoice objects.
 */
export const generateFakeInvoices = (count: number, userId: string, products: Product[]): Invoice[] => {
  return Array.from({ length: count }, () => generateFakeInvoice(userId, products));
};

/**
 * Generates a complete realistic dataset for a user.
 * @param userId The user ID to associate with the data.
 * @param productCount Number of products to generate.
 * @param invoiceCount Number of invoices to generate.
 * @returns Object containing products and invoices.
 */
export const generateCompleteDataset = (
  userId: string, 
  productCount: number = 50, 
  invoiceCount: number = 25
) => {
  // Generate products first
  const products = generateFakeProducts(productCount, userId);
  
  // Generate invoices using the products
  const invoices = generateFakeInvoices(invoiceCount, userId, products);
  
  return {
    products,
    invoices,
    summary: {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
      totalRevenue: invoices
        .filter(i => i.status === 'paid')
        .reduce((sum, invoice) => {
          const subtotal = invoice.items.reduce((s, item) => s + (item.quantity * item.rate), 0);
          const discountAmount = invoice.discountType === 'percentage' 
            ? (subtotal * invoice.discountValue) / 100 
            : invoice.discountValue;
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = invoice.taxRates.reduce((s, tax) => s + (afterDiscount * tax.rate) / 100, 0);
          return sum + (afterDiscount + taxAmount);
        }, 0),
    }
  };
};

/**
 * Generates sample data specifically for demonstration purposes.
 * Creates a mix of realistic business scenarios.
 * @param userId The user ID to associate with the data.
 * @returns Curated sample dataset.
 */
export const generateDemoDataset = (userId: string) => {
  // Create specific product categories for a realistic business
  const demoProducts: Partial<Product>[] = [
    // Software Products
    { name: 'Website Development', category: 'Development', price: 2500, unit: 'project', description: 'Custom website development with modern design' },
    { name: 'Mobile App Development', category: 'Development', price: 5000, unit: 'project', description: 'Native mobile application development' },
    { name: 'SEO Optimization', category: 'Marketing', price: 150, unit: 'hour', description: 'Search engine optimization services' },
    { name: 'Logo Design', category: 'Design', price: 300, unit: 'piece', description: 'Professional logo design and branding' },
    { name: 'Content Writing', category: 'Marketing', price: 50, unit: 'hour', description: 'Professional content writing services' },
    
    // Consulting Services
    { name: 'Business Consultation', category: 'Consulting', price: 200, unit: 'hour', description: 'Strategic business consulting' },
    { name: 'Technical Training', category: 'Training', price: 100, unit: 'hour', description: 'Technical skills training sessions' },
    { name: 'Project Management', category: 'Services', price: 120, unit: 'hour', description: 'Professional project management' },
    
    // Products
    { name: 'Premium Software License', category: 'Software', price: 999, unit: 'license', description: 'Annual software license' },
    { name: 'Hardware Setup', category: 'Hardware', price: 800, unit: 'set', description: 'Complete hardware setup and configuration' },
  ];

  // Generate products with some predefined ones
  const products = [
    ...demoProducts.map(partial => ({
      id: uuidv4(),
      userId,
      name: partial.name!,
      description: partial.description!,
      price: partial.price!,
      currency: 'USD',
      category: partial.category!,
      sku: faker.string.alphaNumeric(8).toUpperCase(),
      stock: faker.number.int({ min: 5, max: 100 }),
      unit: partial.unit!,
      taxable: true,
      isActive: true,
      tags: faker.helpers.arrayElements(['featured', 'popular', 'new'], { min: 0, max: 2 }),
      createdAt: faker.date.past({ years: 1 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    })),
    ...generateFakeProducts(40, userId), // Add more random products
  ];

  // Generate realistic invoices
  const invoices = generateFakeInvoices(30, userId, products);

  return {
    products,
    invoices,
    summary: {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(i => i.status === 'paid').length,
    }
  };
};