
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-details/:orderId" element={<BookingDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/customers" element={<Admin />} />
          <Route path="/admin/services" element={<Admin />} />
          <Route path="/admin/products" element={<Admin />} />
          <Route path="/admin/appointments" element={<Admin />} />
          <Route path="/admin/cash" element={<Admin />} />
          <Route path="/admin/staff" element={<Admin />} />
          <Route path="/admin/settings" element={<Admin />} />
          <Route path="/admin/profile" element={<Admin />} />
          <Route path="/admin/customers/:customerId" element={<CustomerDetailPage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
