
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HelpCircle, Calendar, ChevronRight, Lock, ShoppingBag, Scissors, Shield } from 'lucide-react';
import { config } from '@/config/env';

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
                
                {/* Admin Login Button */}
                <div className="mt-8">
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/login">
                      <Lock className="mr-2 h-4 w-4" />
                      Admin panelə daxil ol
                    </Link>
                  </Button>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Calendar className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Təyinat İdarəetməsi</h3>
                <p className="text-muted-foreground">Təyinatları asanlıqla təşkil edin, planlaşdırın və idarə edin.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <ShoppingBag className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">İnventarın İdarə Edilməsi</h3>
                <p className="text-muted-foreground">Məhsullarınızı izləyin və stokdan çıxdıqda avtomatik bildirişlər alın.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Scissors className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Xidmət Kataloqu</h3>
                <p className="text-muted-foreground">Xidmətlərinizi qurun və müştərilərin onlayn bron etməsinə imkan verin.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Təhlükəsiz Ödənişlər</h3>
                <p className="text-muted-foreground">Təhlükəsiz və etibarlı ödəniş üsulları ilə müştəri məmnuniyyətini artırın.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <HelpCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Müştəri Dəstəyi</h3>
                <p className="text-muted-foreground">Müştərilərinizə yüksək səviyyəli dəstək təmin edin.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <Lock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Rol Əsaslı Giriş</h3>
                <p className="text-muted-foreground">Müxtəlif istifadəçi səviyyələri üçün rol əsaslı giriş nəzarəti.</p>
              </div>
            </div>
            
            {/* Environment Indicator (for development) */}
            {config.featureFlags.showDebugInfo && (
              <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded text-amber-800">
                <p className="text-center text-sm">
                  {config.mode === 'local' ? 'Local Development Mode' : 'API Mode'}: {config.usesMockData ? 'Using Mock Data' : 'Using Real API'}
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
