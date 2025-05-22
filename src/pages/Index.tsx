import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, ChevronRight, Lock } from 'lucide-react';
import { config } from '@/config/env';
import FeaturedServices from '@/components/FeaturedServices';
import FeaturedProducts from '@/components/FeaturedProducts';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import * as serviceService from '@/services/service.service';
import * as productService from '@/services/product.service';

const Index = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  // Pre-fetch services and products for faster navigation
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    // Fix the function call to use getServices
    queryFn: () => import('@/services/service.service').then(module => module.getServices()),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    // Fix the function call to use getProducts
    queryFn: () => import('@/services/product.service').then(module => module.getProducts()),
  });

  useEffect(() => {
    // Simulate loading state for smoother UI transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        // Use the serviceService.getAll method instead of listServices
        const services = await serviceService.getAll();
        setServices(services.slice(0, 6)); // Show just the first 6 services
        setLoadingServices(false);
      } catch (error) {
        console.error('Error loading services:', error);
        setLoadingServices(false);
      }
    };

    // Modify the product fetching to use the correct method
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        // Use the productService.getAll method 
        const products = await productService.getAll();
        setProducts(products.slice(0, 6)); // Show just the first 6 products
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoadingProducts(false);
      }
    };

    fetchServices();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-primary/5 px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in">
                  {t('home.title')}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  {t('home.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <Button asChild size="lg" className="font-semibold">
                    <Link to="/booking">
                      {t('home.makeAppointment')}
                      <Calendar className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/services">
                      {t('home.viewServices')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                {/* Admin Login Button - Made more prominent */}
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: '0.6s'}}>
                  <h3 className="font-medium text-amber-800 mb-2">{t('admin.login')}</h3>
                  <Button asChild variant="default" size="lg" className="w-full">
                    <Link to="/login">
                      <Lock className="mr-2 h-5 w-5" />
                      {t('admin.login')}
                    </Link>
                  </Button>
                  <p className="mt-2 text-xs text-amber-700">
                    Demo rejimdə test istifadəçiləri ilə giriş edə bilərsiniz
                  </p>
                </div>
              </div>
              <div className="hidden lg:block animate-fade-in" style={{animationDelay: '0.4s'}}>
                <img 
                  src="/placeholder.svg" 
                  alt="Salon Management System" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Feature Section */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">{t('home.platform')}</h2>
            
            <div className="space-y-12">
              {/* Services Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">{t('home.services')}</h3>
                <FeaturedServices />
              </div>
              
              {/* Products Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">{t('home.products')}</h3>
                <FeaturedProducts />
              </div>
            </div>
            
            {/* Environment Indicator (for development) */}
            {config.features.debugMode && (
              <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded text-amber-800">
                <p className="text-center text-sm">
                  {config.usesMockData ? 'Local Development Mode' : 'API Mode'}: {config.usesMockData ? 'Using Mock Data' : 'Using Real API'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
