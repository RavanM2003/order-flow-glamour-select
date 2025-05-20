
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, Calendar, ChevronRight, Lock } from 'lucide-react';
import { config } from '@/config/env';
import FeaturedServices from '@/components/FeaturedServices';
import FeaturedProducts from '@/components/FeaturedProducts';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/10 to-primary/5 px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
                  Gözəllik salonunuz üçün mükəmməl idarəetmə həlli
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  Müştərilər, təyinatlar və inventarınızı vahid platformada asanlıqla idarə edin.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg" className="font-semibold">
                    <Link to="/booking">
                      Təyinat edin
                      <Calendar className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/services">
                      Xidmətlərə baxın
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                {/* Admin Login Button - Made more prominent */}
                <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
                  <h3 className="font-medium text-amber-800 mb-2">Salon idarəetmə panelinə daxil ol</h3>
                  <Button asChild variant="default" size="lg" className="w-full">
                    <Link to="/login">
                      <Lock className="mr-2 h-5 w-5" />
                      Admin panelə daxil ol
                    </Link>
                  </Button>
                  <p className="mt-2 text-xs text-amber-700">
                    Demo rejimdə test istifadəçiləri ilə giriş edə bilərsiniz
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
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
            <h2 className="text-3xl font-bold text-center mb-12">Bizim platforma üstünlükləri</h2>
            
            <div className="space-y-12">
              {/* Services Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">Xidmətlər</h3>
                <FeaturedServices />
              </div>
              
              {/* Products Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-center">Məhsullar</h3>
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
