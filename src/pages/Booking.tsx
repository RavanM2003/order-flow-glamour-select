
import React from 'react';
import { Button } from "@/components/ui/button";
import { OrderProvider } from '@/context/OrderContext';
import CheckoutFlow from "@/components/CheckoutFlow";
import { Link } from "react-router-dom";

const Booking = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-2xl text-glamour-800">Glamour Studio</div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/services">Services</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">Contact</Link>
            </Button>
            <Button className="bg-glamour-700 hover:bg-glamour-800" asChild>
              <Link to="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-glamour-800 mb-8 text-center">Book Your Appointment</h1>
          <OrderProvider>
            <CheckoutFlow />
          </OrderProvider>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          © 2024 Glamour Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Booking;
