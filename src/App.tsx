
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider } from "./context/LanguageContext";
import RequireAuth from "./components/auth/RequireAuth";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
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
import { UserRole } from "./models/user.model"; // Fixed import
import { UserProvider } from './context/UserContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Define role access for each route
const routeRoleAccess: Record<string, UserRole[]> = {
  '/admin': ['super_admin', 'admin', 'staff', 'cash', 'appointment', 'service', 'product', 'customer'],
  '/admin/customers': ['super_admin', 'admin', 'appointment'],
  '/admin/services': ['super_admin', 'admin', 'service'],
  '/admin/products': ['super_admin', 'admin', 'cash', 'product'],
  '/admin/appointments': ['super_admin', 'admin', 'staff', 'appointment'],
  '/admin/cash': ['super_admin', 'admin', 'cash'],
  '/admin/staff': ['super_admin', 'admin'],
  '/admin/settings': ['super_admin'],
  '/admin/profile': ['super_admin', 'admin', 'staff', 'cash', 'appointment', 'service', 'product']
};

function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/old-login" element={<Login />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/booking-details/:orderId" element={<BookingDetails />} />
                  
                  {/* Protected Admin Routes */}
                  <Route path="/admin" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/customers" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/customers']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/services" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/services']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/products" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/products']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/appointments" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/appointments']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/cash" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/cash']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/staff" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/staff']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/settings" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/settings']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/profile" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/profile']}>
                      <Admin />
                    </RequireAuth>
                  } />
                  <Route path="/admin/customers/:customerId" element={
                    <RequireAuth allowedRoles={routeRoleAccess['/admin/customers']}>
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
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </UserProvider>
  );
}

export default App;
