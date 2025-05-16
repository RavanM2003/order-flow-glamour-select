
import { ApiService } from './api.service';
import { Product } from '@/models/product.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockProducts } from '@/lib/mock-data';

export class ProductService extends ApiService {
  // Get all products
  async getAll(): Promise<ApiResponse<Product[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return { data: [...mockProducts] };
    }
    
    return this.get<Product[]>('/products');
  }
  
  // Get a single product by id
  async getById(id: number | string): Promise<ApiResponse<Product>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const product = mockProducts.find(p => p.id === Number(id));
      return { data: product ? {...product} : undefined, error: product ? undefined : 'Product not found' };
    }
    
    return this.get<Product>(`/products/${id}`);
  }
}

// Create a singleton instance
export const productService = new ProductService();
