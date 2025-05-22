
import { useState } from 'react';
import { Product, ProductFormData } from '@/models/product.model';
import { productService } from '@/services/product.service';
import { useToast } from '@/hooks/use-toast';

export const useProductActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createProduct = async (productData: ProductFormData): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.createProduct(productData);
      
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
    }
  };

  const updateProduct = async (id: string | number, productData: Partial<ProductFormData>): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.updateProduct(id, productData);
      
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
    }
  };

  const deleteProduct = async (id: string | number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await productService.deleteProduct(id);
      
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
    }
  };

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct
  };
};
