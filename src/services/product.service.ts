import { supabase } from '@/integrations/supabase/client';
import { Product, ProductFormData } from '@/models/product.model';

/**
 * Get all products
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) throw error;
  return data || [];
}

/**
 * Get products by category ID
 */
export async function getProductsByCategory(categoryId: number | string) {
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
export async function getProductById(id: number | string) {
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
export async function createProduct(productData: ProductFormData) {
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
export async function updateProduct(id: number | string, productData: Partial<Product>) {
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
export async function deleteProduct(id: number | string) {
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
export async function getFeaturedProducts(limit: number = 6) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data || [];
}
