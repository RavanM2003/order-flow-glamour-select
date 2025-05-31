
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { LanguageProvider } from '@/context/LanguageContext';
import { UserProvider } from '@/context/UserContext';
import { OrderProvider } from '@/context/OrderContext';

// Import pages
import Index from '@/pages/Index';
import Services from '@/pages/Services';
import ServiceDetail from '@/pages/ServiceDetail';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Booking from '@/pages/Booking';
import BookingDetails from '@/pages/BookingDetails';
import Auth from '@/pages/Auth';
import Admin from '@/pages/Admin';
import OptimizedAdmin from '@/pages/OptimizedAdmin';
import CustomerDetailPage from '@/pages/CustomerDetailPage';
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
          <UserProvider>
            <OrderProvider>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <ScrollToTop />
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route 
                        path="/booking" 
                        element={
                          <ProtectedRoute>
                            <Booking />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/booking/:id" 
                        element={
                          <ProtectedRoute>
                            <BookingDetails />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/auth" 
                        element={
                          <ProtectedRoute requireAuth={false}>
                            <Auth />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute>
                            <Admin />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin-v2" 
                        element={
                          <ProtectedRoute>
                            <OptimizedAdmin />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/customers/:id" 
                        element={
                          <ProtectedRoute>
                            <CustomerDetailPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
                <Toaster />
              </Router>
            </OrderProvider>
          </UserProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
