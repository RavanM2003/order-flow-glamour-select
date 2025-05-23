
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingBag, Calendar, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from '@/context/LanguageContext';
import { Service } from "@/models/service.model";
import { Product } from "@/models/product.model";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Fetch service details
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (!id) throw new Error('Service ID is required');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', parseInt(id, 10))
        .single();
      
      if (error) throw error;
      return data as Service;
    }
  });
  
  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!id) return;
      
      try {
        // First get product_ids related to this service
        const { data: serviceProducts, error: spError } = await supabase
          .from('service_products')
          .select('product_id')
          .eq('service_id', parseInt(id, 10));
        
        if (spError || !serviceProducts || serviceProducts.length === 0) {
          // If no direct relations, just fetch some products
          const { data: someProducts, error: productsError } = await supabase
            .from('products')
            .select('*')
            .limit(3);
          
          if (!productsError && someProducts) {
            setRelatedProducts(someProducts as Product[]);
          }
          return;
        }
        
        // Get product details
        const productIds = serviceProducts.map(sp => sp.product_id);
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        
        if (!productsError && products) {
          setRelatedProducts(products as Product[]);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      }
    };
    
    fetchRelatedProducts();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Button variant="outline" className="mb-6" asChild>
            <Link to="/services">
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('service.backToServices')}
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
  
  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('service.notFound')}</h1>
          <p className="text-gray-600 mb-8">{t('service.notFoundMessage')}</p>
          <Button asChild>
            <Link to="/services">{t('service.browseServices')}</Link>
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
          <Link to="/services">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('service.backToServices')}
          </Link>
        </Button>
        
        {/* Service Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Service Image */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            {service.image_urls && service.image_urls.length > 0 ? (
              <img 
                src={service.image_urls[0]} 
                alt={service.name}
                className="w-full h-96 object-cover object-center"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">No service image available</p>
              </div>
            )}
          </div>
          
          {/* Service Info */}
          <div>
            <h1 className="text-3xl font-bold text-glamour-800 mb-2">{service.name}</h1>
            
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-semibold text-glamour-700">{service.price} AZN</div>
              <div className="bg-gray-100 px-3 py-1 rounded text-gray-600">
                {service.duration} {t('service.minutes')}
              </div>
            </div>
            
            {service.description && (
              <div className="mb-6">
                <p className="text-gray-600">{service.description}</p>
              </div>
            )}
            
            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-glamour-800 mb-3">{t('service.benefits')}</h2>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-glamour-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-glamour-700 hover:bg-glamour-800" onClick={() => navigate('/booking')}>
                <Calendar className="mr-2 h-5 w-5" />
                {t('service.bookNow')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-glamour-800 mb-6">{t('service.recommendedProducts')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-500">No image</p>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-semibold text-glamour-800">{product.name}</h3>
                      <span className="font-semibold text-glamour-700">{product.price} AZN</span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/products/${product.id}`}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {t('service.viewProductDetails')}
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

export default ServiceDetail;
