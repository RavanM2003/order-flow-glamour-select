
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/use-auth";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CustomerDetailPage from './pages/CustomerDetailPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-details/:orderId" element={<BookingDetails />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <RequireAuth allowedRoles={['admin', 'staff', 'cashier']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/customers" element={
              <RequireAuth allowedRoles={['admin', 'staff']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/services" element={
              <RequireAuth allowedRoles={['admin', 'staff']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/products" element={
              <RequireAuth allowedRoles={['admin', 'staff', 'cashier']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/appointments" element={
              <RequireAuth allowedRoles={['admin', 'staff']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/cash" element={
              <RequireAuth allowedRoles={['admin', 'cashier']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/staff" element={
              <RequireAuth allowedRoles={['admin']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/settings" element={
              <RequireAuth allowedRoles={['admin']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/profile" element={
              <RequireAuth allowedRoles={['admin', 'staff', 'cashier']}>
                <Admin />
              </RequireAuth>
            } />
            <Route path="/admin/customers/:customerId" element={
              <RequireAuth allowedRoles={['admin', 'staff']}>
                <CustomerDetailPage />
              </RequireAuth>
            } />
            
            {/* Public Routes */}
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
