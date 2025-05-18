
import { useCallback } from 'react';
import { useApi } from '@/hooks/use-api';
import { productService } from '@/services/product.service';
import { ProductFormData, Product } from '@/models/product.model';
import { toast } from '@/components/ui/use-toast';

export function useProductActions(onSuccess?: () => void) {
  const api = useApi<Product>();
  
  const createProduct = useCallback(async (data: ProductFormData) => {
    return await api.execute(
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
  }, [api, onSuccess]);
  
  const updateProduct = useCallback(async (id: number | string, data: Partial<ProductFormData>) => {
    return await api.execute(
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
    error: api.error
  };
}
