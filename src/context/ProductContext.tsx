import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductFilters } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
  setFilters: (filters: ProductFilters) => void;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<{ data?: Product; error?: string }>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<{ data?: Product; error?: string }>;
  deleteProduct: (id: string) => Promise<{ error?: string }>;
  refreshProducts: () => Promise<void>;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  priceRange: { min: 0, max: 10000 },
  tags: [],
  isActive: true,
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from Supabase
  const loadProducts = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        sku: product.sku || undefined,
        stock: product.stock || undefined,
        unit: product.unit,
        taxable: product.taxable,
        isActive: product.is_active,
        tags: product.tags || [],
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        userId: product.user_id,
      }));

      setProducts(transformedProducts);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          name: productData.name,
          description: productData.description,
          price: productData.price,
          currency: productData.currency,
          category: productData.category,
          sku: productData.sku,
          stock: productData.stock,
          unit: productData.unit,
          taxable: productData.taxable,
          is_active: productData.isActive,
          tags: productData.tags,
        })
        .select()
        .single();

      if (error) return { error: error.message };

      await loadProducts();
      return { data: data as Product };
    } catch (err) {
      return { error: 'Failed to create product' };
    }
  };

  // Update product
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          currency: updates.currency,
          category: updates.category,
          sku: updates.sku,
          stock: updates.stock,
          unit: updates.unit,
          taxable: updates.taxable,
          is_active: updates.isActive,
          tags: updates.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return { error: error.message };

      await loadProducts();
      return { data: data as Product };
    } catch (err) {
      return { error: 'Failed to update product' };
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) return { error: error.message };

      await loadProducts();
      return {};
    } catch (err) {
      return { error: 'Failed to delete product' };
    }
  };

  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        product.tags.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && product.isActive !== filters.isActive) {
      return false;
    }

    return true;
  });

  // Helper functions
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category && product.isActive);
  };

  const searchProducts = (query: string) => {
    const searchLower = query.toLowerCase();
    return products.filter(product => 
      product.isActive && (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower))
      )
    );
  };

  // Load products when user changes
  useEffect(() => {
    loadProducts();
  }, [user]);

  const value = {
    products,
    filteredProducts,
    filters,
    loading,
    error,
    setFilters,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts,
    getProductsByCategory,
    searchProducts,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};