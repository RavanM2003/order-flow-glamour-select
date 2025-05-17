
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { productService } from '@/services';
import { Product, ProductFormData } from '@/models/product.model';

export function useProducts() {
  const api = useApi<Product[]>();
  const [products, setProducts] = useState<Product[]>([]);
  
  const fetchProducts = useCallback(async () => {
    const data = await api.execute(
      () => productService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load products'
      }
    );
    
    if (data) {
      setProducts(data);
    }
  }, [api]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const getProduct = useCallback(async (id: number | string) => {
    const response = await productService.getById(id);
    return response.data;
  }, []);
  
  const getProductsByService = useCallback(async (serviceId: number | string) => {
    const response = await productService.getByServiceId(serviceId);
    return response.data || [];
  }, []);

  const createProduct = useCallback(async (data: ProductFormData) => {
    const result = await api.execute(
      () => productService.create(data),
      {
        showSuccessToast: true,
        successMessage: 'Product created successfully',
        errorPrefix: 'Failed to create product',
        onSuccess: () => {
          fetchProducts();
        }
      }
    );
    
    return result;
  }, [api, fetchProducts]);
  
  const updateProduct = useCallback(async (id: number | string, data: Partial<ProductFormData>) => {
    const result = await api.execute(
      () => productService.update(id, data),
      {
        showSuccessToast: true,
        successMessage: 'Product updated successfully',
        errorPrefix: 'Failed to update product',
        onSuccess: () => {
          fetchProducts();
        }
      }
    );
    
    return result;
  }, [api, fetchProducts]);
  
  const deleteProduct = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => productService.delete(id),
      {
        showSuccessToast: true,
        successMessage: 'Product deleted successfully',
        errorPrefix: 'Failed to delete product',
        onSuccess: () => {
          fetchProducts();
        }
      }
    );
    
    return result;
  }, [api, fetchProducts]);
  
  return {
    products,
    isLoading: api.isLoading,
    error: api.error,
    fetchProducts,
    getProduct,
    getProductsByService,
    createProduct,
    updateProduct,
    deleteProduct
  };
}
