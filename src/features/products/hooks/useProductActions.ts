
import { useCallback, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { productService } from '@/services';
import { ProductFormData, Product } from '@/models/product.model';

export function useProductActions(onSuccess?: () => void) {
  const api = useApi<Product>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const createProduct = useCallback(async (data: ProductFormData) => {
    setIsCreating(true);
    try {
      const response = await api.execute(
        () => productService.create(data),
        {
          showSuccessToast: true,
          successMessage: 'Product created successfully',
          errorPrefix: 'Failed to create product',
          onSuccess: () => {
            onSuccess?.();
          }
        }
      );
      setIsCreating(false);
      return response?.data;
    } catch (error) {
      setIsCreating(false);
      throw error;
    }
  }, [api, onSuccess]);
  
  const updateProduct = useCallback(async (id: number | string, data: Partial<ProductFormData>) => {
    setIsUpdating(true);
    try {
      const response = await api.execute(
        () => productService.update(id, data),
        {
          showSuccessToast: true,
          successMessage: 'Product updated successfully',
          errorPrefix: 'Failed to update product',
          onSuccess: () => {
            onSuccess?.();
          }
        }
      );
      setIsUpdating(false);
      return response?.data;
    } catch (error) {
      setIsUpdating(false);
      throw error;
    }
  }, [api, onSuccess]);
  
  const deleteProduct = useCallback(async (id: number | string) => {
    return await api.execute(
      () => productService.delete(id),
      {
        showSuccessToast: true,
        successMessage: 'Product deleted successfully',
        errorPrefix: 'Failed to delete product',
        onSuccess: () => {
          onSuccess?.();
        }
      }
    );
  }, [api, onSuccess]);

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    isLoading: api.isLoading,
    isCreating,
    isUpdating,
    error: api.error
  };
}
