
import { ApiService } from './api.service';
import { Product, ProductFormData } from '@/models/product.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockProducts } from '@/lib/mock-data';
import { supabaseService } from './supabase.service';

export class ProductService extends ApiService {
  // Get all products
  async getAll(): Promise<ApiResponse<Product[]>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return { data: [...mockProducts] };
    }
    
    if (config.useSupabase) {
      return await supabaseService.getProducts();
    }
    
    return this.get<Product[]>('/products');
  }
  
  // Get products related to a service
  async getByServiceId(serviceId: number | string): Promise<ApiResponse<Product[]>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // Filter products that are marked as service-related
      const products = mockProducts.filter(p => p.isServiceRelated === true);
      return { data: [...products] };
    }
    
    if (config.useSupabase) {
      return await supabaseService.getServiceProducts(Number(serviceId));
    }
    
    return this.get<Product[]>(`/services/${serviceId}/products`);
  }
  
  // Get a single product by id
  async getById(id: number | string): Promise<ApiResponse<Product>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const product = mockProducts.find(p => p.id === Number(id));
      return { data: product ? {...product} : undefined, error: product ? undefined : 'Product not found' };
    }
    
    if (config.useSupabase) {
      return await supabaseService.getProductById(Number(id));
    }
    
    return this.get<Product>(`/products/${id}`);
  }
  
  // Create a new product
  async create(data: ProductFormData): Promise<ApiResponse<Product>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...mockProducts.map(p => p.id || 0), 0) + 1;
      const newProduct: Product = { 
        ...data, 
        id: newId,
        stock_quantity: data.stock_quantity || 0
      };
      mockProducts.push(newProduct);
      return { data: newProduct };
    }
    
    if (config.useSupabase) {
      return await supabaseService.createProduct(data);
    }
    
    return this.post<Product>('/products', data);
  }
  
  // Update an existing product
  async update(id: number | string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockProducts.findIndex(p => p.id === Number(id));
      if (index >= 0) {
        mockProducts[index] = { 
          ...mockProducts[index], 
          ...data,
          stock_quantity: data.stock_quantity !== undefined ? data.stock_quantity : mockProducts[index].stock_quantity
        };
        return { data: mockProducts[index] };
      }
      return { error: 'Product not found' };
    }
    
    if (config.useSupabase) {
      return await supabaseService.updateProduct(Number(id), data);
    }
    
    return this.put<Product>(`/products/${id}`, data);
  }
  
  // Delete a product
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    if (!config.useSupabase && config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockProducts.findIndex(p => p.id === Number(id));
      if (index >= 0) {
        mockProducts.splice(index, 1);
        return { data: true };
      }
      return { error: 'Product not found' };
    }
    
    if (config.useSupabase) {
      return await supabaseService.deleteProduct(Number(id));
    }
    
    return super.delete<boolean>(`/products/${id}`);
  }
}

// Create a singleton instance
export const productService = new ProductService();
