
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Product } from "@/models/product.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { usePagination } from "@/hooks/use-pagination";
import { useLanguage } from "@/context/LanguageContext";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching products:", error);
        return;
      }
      
      if (data) {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { paginatedItems, hasMore, loadMore } = usePagination({
    items: filteredProducts,
    itemsPerPage: 6
  });

  if (loading) {
    return (
      <div>
        <div className="mb-8 max-w-md">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={`product-skeleton-${index}`} className="bg-white rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-6 w-16 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder={t("products.search")} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedItems.map((product, index) => (
          <div key={`product-${product.id}-${index}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
            <DiscountBadge discount={product.discount || 0} />
            
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-glamour-600">Məhsul şəkli</p>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-glamour-800">{product.name}</h2>
                <PriceDisplay 
                  price={product.price} 
                  discount={product.discount}
                  className="ml-4"
                />
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                Stok: {product.stock || 0}
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {product.description || "Məhsul haqqında məlumat yoxdur"}
              </p>
              
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                <Link to={`/products/${product.id}`}>
                  {t("products.viewDetails")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="px-8"
          >
            {t("products.loadMore")}
          </Button>
        </div>
      )}
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">"{searchTerm}" {t("products.noResults")}</p>
        </div>
      )}
      
      <div className="mt-12 text-center">
        <p className="text-lg text-gray-600 mb-6">{t("products.cta")}</p>
        <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" asChild>
          <Link to="/booking">{t("products.bookNow")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
