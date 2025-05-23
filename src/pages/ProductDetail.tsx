
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Calendar, Scissors } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/context/LanguageContext';
import { Product } from "@/models/product.model";
import { Service } from "@/models/service.model";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  
  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) throw new Error('Product ID is required');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single();
      
      if (error) throw error;
      return data as Product;
    }
  });
  
  // Fetch related services
  useEffect(() => {
    const fetchRelatedServices = async () => {
      if (!id) return;
      
      try {
        // First get service_ids related to this product
        const { data: serviceProducts, error: spError } = await supabase
          .from('service_products')
          .select('service_id')
          .eq('product_id', parseInt(id, 10));
        
        if (spError || !serviceProducts || serviceProducts.length === 0) {
          // If no direct relations, just fetch some services
          const { data: someServices, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .limit(3);
          
          if (!servicesError && someServices) {
            setRelatedServices(someServices as Service[]);
          }
          return;
        }
        
        // Get service details
        const serviceIds = serviceProducts.map(sp => sp.service_id);
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds);
        
        if (!servicesError && services) {
          setRelatedServices(services as Service[]);
        }
      } catch (err) {
        console.error('Error fetching related services:', err);
      }
    };
    
    fetchRelatedServices();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Button variant="outline" className="mb-6" asChild>
            <Link to="/products">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('product.backToProducts')}
            </Link>
          </Button>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="pt-6">
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('product.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/products">{t('product.browseProducts')}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Back Button */}
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('product.backToProducts')}
          </Link>
        </Button>
        
        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-96 object-cover object-center"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No product image available</p>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-glamour-800 mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-glamour-700 mb-4">{product.price} AZN</p>
            
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
            
            {product.details && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-glamour-800 mb-2">{t('product.details')}</h2>
                <p className="text-gray-600">{product.details}</p>
              </div>
            )}
            
            {product.how_to_use && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-glamour-800 mb-2">{t('product.howToUse')}</h2>
                <p className="text-gray-600">{product.how_to_use}</p>
              </div>
            )}
            
            {product.ingredients && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-glamour-800 mb-2">{t('product.ingredients')}</h2>
                <p className="text-gray-600">{product.ingredients}</p>
              </div>
            )}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" onClick={() => navigate('/booking')}>
                <Calendar className="mr-2 h-5 w-5" />
                {t('product.bookAppointment')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Services Section */}
        {relatedServices.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-glamour-800 mb-6">{t('product.relatedServices')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-glamour-800 mb-2">{service.name}</h3>
                    <div className="flex justify-between text-sm text-gray-600 mb-3">
                      <span>{service.duration} min</span>
                      <span>{service.price} AZN</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/services/${service.id}`}>
                        <Scissors className="mr-2 h-4 w-4" />
                        {t('product.viewServiceDetails')}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
