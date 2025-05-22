
import { useState } from 'react';
import { Product, ProductFormData } from '@/models/product.model';
import { productService } from '@/services';
import { useToast } from '@/hooks/use-toast';

export const useProductActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false); // Added this state
  const [isUpdating, setIsUpdating] = useState(false); // Added this state
  const [isDeleting, setIsDeleting] = useState(false); // Added this state
  const { toast } = useToast();

  const createProduct = async (productData: ProductFormData): Promise<Product | null> => {
    setLoading(true);
    setIsCreating(true); // Set the creating state
    setError(null);
    
    try {
      const response = await productService.create(productData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: "Məhsul yaradıldı",
        description: "Məhsul uğurla əlavə edildi"
      });
      
      return response.data || null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Məhsul yaradılarkən xəta baş verdi';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: errorMsg
      });
      return null;
    } finally {
      setLoading(false);
      setIsCreating(false); // Reset the creating state
    }
  };

  const updateProduct = async (id: string | number, productData: Partial<ProductFormData>): Promise<Product | null> => {
    setLoading(true);
    setIsUpdating(true); // Set the updating state
    setError(null);
    
    try {
      const response = await productService.update(id, productData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: "Məhsul yeniləndi",
        description: "Məhsul uğurla yeniləndi"
      });
      
      return response.data || null;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Məhsul yenilərkən xəta baş verdi';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: errorMsg
      });
      return null;
    } finally {
      setLoading(false);
      setIsUpdating(false); // Reset the updating state
    }
  };

  const deleteProduct = async (id: string | number): Promise<boolean> => {
    setLoading(true);
    setIsDeleting(true); // Set the deleting state
    setError(null);
    
    try {
      const response = await productService.delete(id);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      toast({
        title: "Məhsul silindi",
        description: "Məhsul uğurla silindi"
      });
      
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Məhsul silinərkən xəta baş verdi';
      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: errorMsg
      });
      return false;
    } finally {
      setLoading(false);
      setIsDeleting(false); // Reset the deleting state
    }
  };

  return {
    loading,
    error,
    isCreating,  // Add these states to the return object
    isUpdating,
    isDeleting,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
