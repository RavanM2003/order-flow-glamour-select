
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";
import { Product } from "@/models/product.model";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import DiscountBadge from "@/components/ui/discount-badge";
import PriceDisplay from "@/components/ui/price-display";
import { useLanguage } from "@/context/LanguageContext";

const HomeProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3)
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

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-6" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
            <DiscountBadge discount={product.discount || 0} />
            
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-16 w-16 text-glamour-600" />
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold text-glamour-800">{product.name}</h3>
                <PriceDisplay 
                  price={product.price} 
                  discount={product.discount}
                  className="ml-4"
                />
              </div>
              <p className="text-gray-600 mb-6 line-clamp-3">{product.description || t('products.noDescription')}</p>
              <Button className="w-full bg-glamour-700 hover:bg-glamour-800" asChild>
                <Link to={`/products/${product.id}`}>
                  {t('home.viewDetails')}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {products.length > 0 && (
        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/products">
              {t('home.viewAllProducts')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
      
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-6">{t('products.noProductsAdded')}</p>
          <Button asChild variant="outline">
            <Link to="/products">{t('products.viewProductsPage')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomeProductsSection;
