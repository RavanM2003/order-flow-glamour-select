
import React, { useState, useMemo } from 'react';
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

const ProductSelection = () => {
  const { products, isLoading, error } = useProducts();
  const { orderState, addProduct, removeProduct } = useOrder();
  const { t } = useLanguage();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedProducts = orderState?.selectedProducts || [];
  const selectedServices = orderState?.selectedServices || [];

  // Get recommended products based on selected services
  const recommendedProductIds = useMemo(() => {
    // This would typically come from service-product relationships
    // For now, return first few product IDs as recommended
    return products.slice(0, 3).map(p => p.id);
  }, [products, selectedServices]);

  const isProductSelected = (productId: number) => {
    return selectedProducts.some(p => p.id === productId);
  };

  const getProductQuantity = (productId: number) => {
    // Get quantity from orderState instead of product itself
    const orderProduct = selectedProducts.find(p => p.id === productId);
    return orderProduct?.quantity || 0;
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
        products={products}
        recommendedProductIds={recommendedProductIds}
        onFilteredProductsChange={setFilteredProducts}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {selectedProducts.length > 0 && (
        <Card className="p-4 bg-glamour-50">
          <h3 className="font-medium text-glamour-800 mb-3">{t('booking.selectedProducts')}</h3>
          <div className="space-y-2">
            {selectedProducts.map((product) => {
              // Get quantity from orderState
              const orderProduct = selectedProducts.find(p => p.id === product.id);
              const quantity = orderProduct?.quantity || 1;
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
    </div>
  );
};

export default ProductSelection;
