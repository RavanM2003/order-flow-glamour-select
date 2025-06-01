
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-simple-auth';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from '@/context/LanguageContext';

// Import pages
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import BookingPage from '@/pages/BookingPage';
import BookingConfirmation from '@/pages/BookingConfirmation';
import AdminLogin from '@/pages/AdminLogin';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <ScrollToTop />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/booking-confirmation/:id" element={<BookingConfirmation />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
