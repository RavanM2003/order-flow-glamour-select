
import { useState, useEffect } from 'react';
import { Product } from '@/models/product.model';
import { productService } from '@/services/product.service';

export const useProductData = (productId?: string | number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts();
        if (response.error) {
          throw new Error(response.error);
        }
        setProducts(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Məhsullar yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    if (!productId) {
      fetchProducts();
    }
  }, [productId]);

  // Fetch single product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      setLoading(true);
      try {
        const response = await productService.getProductById(productId);
        if (response.error) {
          throw new Error(response.error);
        }
        setProduct(response.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Məhsul yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { products, product, loading, error };
};
