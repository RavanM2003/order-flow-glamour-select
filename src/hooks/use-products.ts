import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { productService } from '@/services';
import { Product, ProductFormData } from '@/models/product.model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useProducts() {
  const api = useApi<Product[]>();
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchedRef, setFetchedRef] = useState(false);
  
  const fetchProducts = useCallback(async () => {
    try {
      // First try using the service abstraction
      const data = await api.execute(
        () => productService.getAll(),
        {
          showErrorToast: false, // We'll handle errors ourselves
        }
      );
      
      if (data && data.length > 0) {
        setProducts(data);
        setFetchedRef(true);
        return;
      }
      
      // If that fails or returns empty, try direct Supabase query
      console.log('Fetching products directly from Supabase...');
      const { data: supabaseData, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) {
        console.error('Error fetching products from Supabase:', error);
        toast({
          variant: "destructive",
          title: "Products not loaded",
          description: error.message
        });
        return;
      }
      
      if (supabaseData && supabaseData.length > 0) {
        setProducts(supabaseData);
        setFetchedRef(true);
        console.log('Products loaded directly from Supabase:', supabaseData.length);
      } else {
        console.log('No products found in Supabase');
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      toast({
        variant: "destructive",
        title: "Products not loaded",
        description: "Failed to load products data"
      });
    }
  }, [api]);
  
  useEffect(() => {
    if (!fetchedRef) {
      fetchProducts();
    }
  }, [fetchProducts, fetchedRef]);
  
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
