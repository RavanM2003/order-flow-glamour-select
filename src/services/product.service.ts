
import { Product, ProductFormData } from '@/models/product.model';
import { ApiService } from './api.service';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';
import { withUserId } from '@/utils/withUserId';

export class ProductService extends ApiService {
  // Get all products
  async getAll(): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      return { data: data as Product[] };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  }

  // Get products by ID
  async getById(id: string | number): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data: data as Product };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      };
    }
  }

  // Get products related to a service
  async getByServiceId(serviceId: string | number): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('service_products')
        .select('product_id')
        .eq('service_id', serviceId);

      if (error) throw error;

      if (data && data.length > 0) {
        const productIds = data.map(item => item.product_id);
        
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) throw productsError;
        
        return { data: products as Product[] };
      }
      
      return { data: [] };
    } catch (error) {
      console.error('Error fetching products for service:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  }

  // Create product
  async create(productData: ProductFormData): Promise<ApiResponse<Product>> {
    try {
      // Prepare data
      const productWithUserId = withUserId({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock_quantity || productData.stock, // Use stock_quantity if available, otherwise stock
        // Add optional fields if present
        ...(productData.category && { category: productData.category }),
        ...(productData.image_url && { image_url: productData.image_url }),
        ...(productData.isServiceRelated && { isServiceRelated: productData.isServiceRelated })
      });

      const { data, error } = await supabase
        .from('products')
        .insert(productWithUserId)
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Product,
        message: 'Product created successfully' 
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to create product'
      };
    }
  }

  // Update product
  async update(id: string | number, updates: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    try {
      // Convert stock_quantity field name if it exists
      const dbUpdates = {
        ...updates,
        ...(updates.stock_quantity !== undefined && { stock: updates.stock_quantity })
      };
      
      // Remove stock_quantity to avoid conflicts
      if ('stock_quantity' in dbUpdates) {
        delete dbUpdates.stock_quantity;
      }

      const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Product,
        message: 'Product updated successfully' 
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to update product'
      };
    }
  }

  // Delete product
  async delete(id: string | number): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { 
        data: true,
        message: 'Product deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { 
        error: error instanceof Error ? error.message : 'Failed to delete product'
      };
    }
  }
}

export const productService = new ProductService();
