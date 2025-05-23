
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Scissors, Info, Phone, Package, Calendar } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/hooks/use-settings';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { getLocalizedSetting } = useSettings();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleBookingClick = () => {
    navigate('/booking');
  };

  const siteName = getLocalizedSetting('site_name') || 'Glamour Studio';
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-glamour-800">{siteName}</div>
          <div className="flex items-center space-x-4">
            <Button variant={isActive('/') ? 'default' : 'ghost'} className={isActive('/') ? "bg-glamour-700" : ""} asChild>
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                <span>{t('nav.home')}</span>
              </Link>
            </Button>
            <Button variant={isActive('/services') ? 'default' : 'ghost'} className={isActive('/services') ? "bg-glamour-700" : ""} asChild>
              <Link to="/services" className="flex items-center">
                <Scissors className="h-4 w-4 mr-2" />
                <span>{t('nav.services')}</span>
              </Link>
            </Button>
            <Button variant={isActive('/products') ? 'default' : 'ghost'} className={isActive('/products') ? "bg-glamour-700" : ""} asChild>
              <Link to="/products" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                <span>{t('nav.products')}</span>
              </Link>
            </Button>
            <Button variant={isActive('/about') ? 'default' : 'ghost'} className={isActive('/about') ? "bg-glamour-700" : ""} asChild>
              <Link to="/about" className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                <span>{t('nav.about')}</span>
              </Link>
            </Button>
            <Button variant={isActive('/contact') ? 'default' : 'ghost'} className={isActive('/contact') ? "bg-glamour-700" : ""} asChild>
              <Link to="/contact" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{t('nav.contact')}</span>
              </Link>
            </Button>
            <LanguageSelector />
            <Button className="bg-glamour-700 hover:bg-glamour-800" onClick={handleBookingClick}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>{t('nav.bookNow')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header - Only show icons on mobile */}
      <div className="md:hidden">
        {/* Section 1: Brand Name */}
        <div className="border-b px-4 py-3 bg-white sticky top-0 z-50">
          <div className="text-center">
            <h1 className="font-bold text-xl text-glamour-800">{siteName}</h1>
          </div>
        </div>

        {/* Section 2: Icon Navigation */}
        <div className="border-b px-2 py-2 bg-white sticky top-[60px] z-40">
          <div className="flex items-center justify-around">
            <Button variant={isActive('/') ? 'default' : 'ghost'} size="sm" className={isActive('/') ? "bg-glamour-700" : ""} asChild>
              <Link to="/" className="flex flex-col items-center p-2">
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant={isActive('/services') ? 'default' : 'ghost'} size="sm" className={isActive('/services') ? "bg-glamour-700" : ""} asChild>
              <Link to="/services" className="flex flex-col items-center p-2">
                <Scissors className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant={isActive('/products') ? 'default' : 'ghost'} size="sm" className={isActive('/products') ? "bg-glamour-700" : ""} asChild>
              <Link to="/products" className="flex flex-col items-center p-2">
                <Package className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant={isActive('/about') ? 'default' : 'ghost'} size="sm" className={isActive('/about') ? "bg-glamour-700" : ""} asChild>
              <Link to="/about" className="flex flex-col items-center p-2">
                <Info className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant={isActive('/contact') ? 'default' : 'ghost'} size="sm" className={isActive('/contact') ? "bg-glamour-700" : ""} asChild>
              <Link to="/contact" className="flex flex-col items-center p-2">
                <Phone className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Section 3: Booking CTA */}
        <div className="px-4 py-3 bg-white sticky top-[120px] z-30">
          <div className="flex items-center justify-between">
            <LanguageSelector />
            <Button className="bg-glamour-700 hover:bg-glamour-800 flex-1 ml-4" onClick={handleBookingClick}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>{t('nav.bookNow')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
