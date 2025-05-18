
import { useState, useCallback, useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { productService } from '@/services/product.service';
import { Product } from '@/models/product.model';

export function useProductData() {
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

  return {
    products,
    isLoading: api.isLoading,
    error: api.error,
    fetchProducts,
    getProduct,
    getProductsByService
  };
}
