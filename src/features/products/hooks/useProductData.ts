
import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { productService } from '@/services';
import { Product } from '@/models/product.model';

export function useProductData() {
  const api = useApi<Product[]>();
  const [products, setProducts] = useState<Product[]>([]);
  
  const fetchProducts = useCallback(async () => {
    const response = await api.execute(
      () => productService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load products'
      }
    );
    
    if (response?.data) {
      setProducts(response.data);
    }
  }, [api]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const getProduct = useCallback(async (id: number | string) => {
    try {
      const response = await productService.getById(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  }, []);
  
  const getProductsByService = useCallback(async (serviceId: number | string) => {
    try {
      const response = await productService.getByServiceId(serviceId);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products by service:", error);
      return [];
    }
  }, []);

  return {
    products,
    isLoading: api.isLoading,
    error: api.error,
    fetchProducts,
    getProduct,
    getProductsByService
  };
}
