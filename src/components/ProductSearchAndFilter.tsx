
import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Product } from '@/models/product.model';
import { useLanguage } from '@/context/LanguageContext';

interface ProductSearchAndFilterProps {
  products: Product[];
  recommendedProductIds?: number[];
  onFilteredProductsChange: (products: Product[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  productsPerPage?: number;
}

const ProductSearchAndFilter: React.FC<ProductSearchAndFilterProps> = ({
  products,
  recommendedProductIds = [],
  onFilteredProductsChange,
  currentPage,
  onPageChange,
  productsPerPage = 6
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const recommendedProducts = useMemo(() => {
    return products.filter(product => 
      recommendedProductIds.includes(product.id)
    );
  }, [products, recommendedProductIds]);

  const filteredProducts = useMemo(() => {
    const productsToFilter = recommendedProducts.length > 0 ? recommendedProducts : products;
    
    if (!searchTerm.trim()) {
      return productsToFilter;
    }
    
    return productsToFilter.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, recommendedProducts, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(0, endIndex); // Show cumulative results
  }, [filteredProducts, currentPage, productsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const hasMore = currentPage < totalPages;

  React.useEffect(() => {
    onFilteredProductsChange(paginatedProducts);
  }, [paginatedProducts, onFilteredProductsChange]);

  const handleLoadMore = () => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onPageChange(1);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t('booking.searchProducts')}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="text-sm text-gray-600">
        {recommendedProducts.length > 0 ? (
          <span>{t('booking.showingRecommended')} ({paginatedProducts.length}/{filteredProducts.length})</span>
        ) : (
          <span>{t('booking.showingAll')} ({paginatedProducts.length}/{filteredProducts.length})</span>
        )}
      </div>
      
      {paginatedProducts.length < filteredProducts.length && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={!hasMore}
          >
            {t('booking.loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductSearchAndFilter;
