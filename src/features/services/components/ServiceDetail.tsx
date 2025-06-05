
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Service } from '@/models/service.model';
import { Product } from '@/models/product.model';
import { supabase } from '@/integrations/supabase/client';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (id) {
      fetchServiceAndProducts(id); // Use string ID directly
    }
  }, [id]);

  const fetchServiceAndProducts = async (serviceId: string) => { // Changed parameter type
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId) // Use string UUID directly
        .single();

      if (serviceError) {
        if (serviceError.code === 'PGRST116') {
          // No rows returned - service not found
          navigate('/404');
          return;
        }
        throw serviceError;
      }

      setService(serviceData as Service);

      // Fetch related products
      const { data: serviceProductsData, error: serviceProductsError } = await supabase
        .from('service_products')
        .select('product_id')
        .eq('service_id', serviceId); // Use string UUID directly

      if (serviceProductsError) {
        console.error('Error fetching service products:', serviceProductsError);
      } else if (serviceProductsData && serviceProductsData.length > 0) {
        const productIds = serviceProductsData.map(sp => sp.product_id);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else if (productsData) {
          setRelatedProducts(productsData as Product[]);
        }
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      setError('Xidmət məlumatları yüklənə bilmədi');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <Skeleton className="h-10 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-6" />
          <Skeleton className="h-80 w-full mb-8" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-8" />
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
          <h1 className="text-4xl font-bold text-glamour-800 mb-6">Xidmət tapılmadı</h1>
          <p className="text-lg text-gray-600 mb-8">
            {error || "Axtardığınız xidmət mövcud deyil və ya silinib."}
          </p>
          <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/services">Bütün xidmətlərə bax</Link>
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
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-glamour-800 mb-4">{service.name}</h1>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center text-glamour-600">
                <Clock className="mr-2 h-5 w-5" />
                <span>{service.duration} dəq</span>
              </div>
              <div className="flex items-center text-glamour-700 font-semibold">
                <DollarSign className="mr-1 h-5 w-5" />
                <span>{service.price} AZN</span>
              </div>
            </div>
            
            <div className="h-80 mb-8 rounded-lg overflow-hidden">
              {service.image_urls && service.image_urls.length > 0 ? (
                <img 
                  src={service.image_urls[0]} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 h-full rounded-lg flex items-center justify-center">
                  <p className="text-glamour-600">Şəkil mövcud deyil</p>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Təsvir</h2>
              <p className="text-gray-700 mb-6">{service.description || "Təsvir mövcud deyil."}</p>
              
              {service.benefits && service.benefits.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Faydalar</h2>
                  <ul className="space-y-2 mb-6">
                    {service.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-glamour-100 text-glamour-800 font-semibold rounded-full p-1 mr-2">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-glamour-800 mb-4">Bu xidməti sifariş edin</h3>
                <p className="text-gray-600 mb-6">
                  {service.name.toLowerCase()} xidmətimizin faydalarını hiss etməyə hazırsınız? Bu gün təyinatınızı edin.
                </p>
                
                <Button className="w-full bg-glamour-700 hover:bg-glamour-800 mb-4" size="lg" asChild>
                  <Link to="/booking">İndi sifariş et</Link>
                </Button>
                
                {relatedProducts && relatedProducts.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-glamour-800 mt-8 mb-4">Tövsiyə olunan məhsullar</h3>
                    <div className="space-y-4">
                      {relatedProducts.map(product => (
                        <div key={product.id} className="border rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{product.name}</h4>
                            <span className="text-glamour-700 font-semibold">{product.price} AZN</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description || "Məhsul haqqında məlumat yoxdur"}
                          </p>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to={`/products/${product.id}`}>
                              Ətraflı bax
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
