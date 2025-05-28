
import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '@/hooks/use-products';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/models/product.model';
import DiscountBadge from '@/components/ui/discount-badge';
import PriceDisplay from '@/components/ui/price-display';
import { useLanguage } from '@/context/LanguageContext';
import ProductSearchAndFilter from './ProductSearchAndFilter';
import { supabase } from '@/integrations/supabase/client';

const ProductSelection = () => {
  const { products, isLoading, error } = useProducts();
  const { orderState, addProduct, removeProduct } = useOrder();
  const { t } = useLanguage();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [allLoadedProducts, setAllLoadedProducts] = useState<Product[]>([]);

  const selectedProducts = orderState?.selectedProducts || [];
  const selectedServices = orderState?.selectedServices || [];

  // Get recommended products based on selected services
  const recommendedProductIds = useMemo(() => {
    return products.slice(0, 3).map(p => p.id);
  }, [products, selectedServices]);

  // Server-side search for recommended products
  const performRecommendedSearch = async (term: string, page: number) => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .order('name');

      if (term.trim()) {
        query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
      }

      const limit = 6;
      const from = (page - 1) * limit;
      query = query.range(from, from + limit - 1);

      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  };

  // Handle search with server-side functionality
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    const results = await performRecommendedSearch(term, 1);
    setAllLoadedProducts(results);
    setFilteredProducts(results);
  };

  // Handle load more with append functionality
  const handleLoadMore = async () => {
    const nextPage = currentPage + 1;
    const newResults = await performRecommendedSearch(searchTerm, nextPage);
    setCurrentPage(nextPage);
    setAllLoadedProducts(prev => [...prev, ...newResults]);
    setFilteredProducts(prev => [...prev, ...newResults]);
  };

  // Initialize with recommended products
  useEffect(() => {
    if (products.length > 0 && allLoadedProducts.length === 0) {
      const initialProducts = products.slice(0, 6);
      setAllLoadedProducts(initialProducts);
      setFilteredProducts(initialProducts);
    }
  }, [products, allLoadedProducts.length]);

  const isProductSelected = (productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const getProductQuantity = (productId: number) => {
    const isSelected = selectedProducts.some(p => p.id === productId);
    return isSelected ? 1 : 0;
  };

  const handleProductToggle = (product: Product) => {
    if (isProductSelected(product.id)) {
      removeProduct(product.id);
    } else {
      addProduct(product.id);
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error}</div>;

  return (
    <div className="space-y-4">
      <ProductSearchAndFilter
        products={allLoadedProducts}
        recommendedProductIds={recommendedProductIds}
        onFilteredProductsChange={setFilteredProducts}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
      />

      {selectedProducts.length > 0 && (
        <Card className="p-4 bg-glamour-50">
          <h3 className="font-medium text-glamour-800 mb-3">{t('booking.selectedProducts')}</h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => {
              const quantity = 1; // Default quantity is always 1
              return (
                <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <span className="font-medium">{product.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{quantity}x</Badge>
                    <PriceDisplay 
                      price={(product.price || 0) * quantity} 
                      className="text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                    >
                      {t('common.remove')}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const isSelected = isProductSelected(product.id);
          const quantity = getProductQuantity(product.id);
          const isRecommended = recommendedProductIds.includes(product.id);
          
          return (
            <Card 
              key={product.id}
              className={`transition-all cursor-pointer ${
                isSelected ? 'border-glamour-700 bg-glamour-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleProductToggle(product)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      {isRecommended && (
                        <Badge variant="secondary" className="text-xs">
                          {t('booking.recommended')}
                        </Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center space-x-1">
                      <PriceDisplay 
                        price={product.price} 
                        discount={product.discount}
                        className="text-right"
                      />
                      {product.discount && product.discount > 0 && (
                        <DiscountBadge discount={product.discount} />
                      )}
                    </div>
                    {isSelected && quantity > 0 && (
                      <Badge variant="default">{quantity}x</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {t('booking.inStock')}: {product.stock}
                  </span>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                  >
                    {isSelected ? t('booking.selected') : t('booking.select')}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-4">
        <Button 
          variant="outline" 
          onClick={handleLoadMore}
          disabled={isLoading}
        >
          {isLoading ? t('common.loading') : t('booking.loadMore')}
        </Button>
      </div>
    </div>
  );
};

export default ProductSelection;
