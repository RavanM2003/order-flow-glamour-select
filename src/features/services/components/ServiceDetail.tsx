import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServiceData } from '../hooks/useServiceData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { service, isLoading, error, fetchService } = useServiceData();
  
  useEffect(() => {
    if (id) {
      fetchService(parseInt(id, 10)).catch(console.error);
    }
  }, [id, fetchService]);
  
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
          <h1 className="text-4xl font-bold text-glamour-800 mb-6">Service Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            {error ? String(error) : "The service you're looking for doesn't exist or has been removed."}
          </p>
          <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/services">Browse All Services</Link>
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
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center text-glamour-700 font-semibold">
                <DollarSign className="mr-1 h-5 w-5" />
                <span>{service.price}</span>
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
                  <p className="text-glamour-600">No image available</p>
                </div>
              )}
            </div>
            
            <div className="prose max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Description</h2>
              <p className="text-gray-700 mb-6">{service.description || "No description available."}</p>
              
              {service.benefits && service.benefits.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold text-glamour-800 mb-4">Benefits</h2>
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
                <h3 className="text-xl font-bold text-glamour-800 mb-4">Book this Service</h3>
                <p className="text-gray-600 mb-6">
                  Ready to experience the benefits of our {service.name.toLowerCase()}? Book your appointment today.
                </p>
                
                <Button className="w-full bg-glamour-700 hover:bg-glamour-800 mb-4" size="lg" asChild>
                  <Link to="/booking">Book Now</Link>
                </Button>
                
                {service.relatedProducts && service.relatedProducts.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold text-glamour-800 mt-8 mb-4">Recommended Products</h3>
                    <div className="space-y-4">
                      {service.relatedProducts.map(productId => (
                        <div key={productId} className="border rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Product #{productId}</h4>
                          </div>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link to={`/products/${productId}`}>
                              View Details
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
