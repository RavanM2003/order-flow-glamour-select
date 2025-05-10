
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Home, Scissors, Info, Phone, Package, ChevronRight, Calendar } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container flex h-16 items-center justify-between">
        <div className="font-bold text-2xl text-glamour-800">Glamour Studio</div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button variant={isActive('/') ? 'default' : 'ghost'} className={isActive('/') ? "bg-glamour-700" : ""} asChild>
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </Button>
          <Button variant={isActive('/services') ? 'default' : 'ghost'} className={isActive('/services') ? "bg-glamour-700" : ""} asChild>
            <Link to="/services" className="flex items-center">
              <Scissors className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Services</span>
            </Link>
          </Button>
          <Button variant={isActive('/products') ? 'default' : 'ghost'} className={isActive('/products') ? "bg-glamour-700" : ""} asChild>
            <Link to="/products" className="flex items-center">
              <Package className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Products</span>
            </Link>
          </Button>
          <Button variant={isActive('/about') ? 'default' : 'ghost'} className={isActive('/about') ? "bg-glamour-700" : ""} asChild>
            <Link to="/about" className="flex items-center">
              <Info className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">About</span>
            </Link>
          </Button>
          <Button variant={isActive('/contact') ? 'default' : 'ghost'} className={isActive('/contact') ? "bg-glamour-700" : ""} asChild>
            <Link to="/contact" className="flex items-center">
              <Phone className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Contact</span>
            </Link>
          </Button>
          <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
            <Link to="/booking" className="flex items-center">
              <Calendar className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Book Now</span>
              <ChevronRight className="h-4 w-4 md:ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
