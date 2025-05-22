
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductFormData } from '@/models/product.model';

// Define the ApiResponse interface for consistent return types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

/**
 * Get products by category ID
 */
export async function getProductsByCategory(categoryId: number | string): Promise<Product[]> {
  // Convert string to number if needed
  const numericId = typeof categoryId === 'string' 
    ? parseInt(categoryId, 10) 
    : categoryId;
  
  const { data, error } = await supabase
    .from('product_categories')
    .select('product_id')
    .eq('category_id', numericId);

  if (error) throw error;

  if (data && data.length > 0) {
    const productIds = data.map(item => item.product_id);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError) throw productsError;
    return products || [];
  }
  
  return [];
}

/**
 * Get product by ID
 */
export async function getProductById(id: number | string): Promise<Product> {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new product
 */
export async function createProduct(productData: ProductFormData): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing product
 */
export async function updateProduct(id: number | string, productData: Partial<Product>): Promise<Product> {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { data, error } = await supabase
    .from('products')
    .update({
      ...productData,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: number | string): Promise<boolean> {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', numericId);

  if (error) throw error;
  return true;
}

/**
 * Get featured products (limited number for display)
 */
export async function getFeaturedProducts(limit: number = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Export all functions as productService object with ApiResponse wrapper
export const productService = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const data = await getProducts();
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  getById: async (id: number | string): Promise<ApiResponse<Product>> => {
    try {
      const data = await getProductById(id);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  getByCategory: async (categoryId: number | string): Promise<ApiResponse<Product[]>> => {
    try {
      const data = await getProductsByCategory(categoryId);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  getByServiceId: async (serviceId: number | string): Promise<ApiResponse<Product[]>> => {
    try {
      // Placeholder implementation
      return { data: [] };
    } catch (error) {
      return { error: String(error) };
    }
  },
  create: async (product: ProductFormData): Promise<ApiResponse<Product>> => {
    try {
      const data = await createProduct(product);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  update: async (id: number | string, product: Partial<Product>): Promise<ApiResponse<Product>> => {
    try {
      const data = await updateProduct(id, product);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  delete: async (id: number | string): Promise<ApiResponse<boolean>> => {
    try {
      const data = await deleteProduct(id);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  },
  getFeatured: async (limit: number = 6): Promise<ApiResponse<Product[]>> => {
    try {
      const data = await getFeaturedProducts(limit);
      return { data };
    } catch (error) {
      return { error: String(error) };
    }
  }
};
