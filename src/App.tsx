import { Route, Routes, BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import { AuthProvider } from "@/hooks/use-auth";
import RequireAuth from "@/components/auth/RequireAuth";
import Login from "@/pages/Login";
import LoginPage from "@/pages/LoginPage";
import ServiceDetail from "@/pages/ServiceDetail";
import Services from "@/pages/Services";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Booking from "@/pages/Booking";
import BookingDetails from "@/pages/BookingDetails";
import ScrollToTop from "@/components/ScrollToTop";
import CustomerDetailPage from "@/pages/CustomerDetailPage";
import { config } from "@/config/env";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserProvider } from "@/context/UserContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/services" element={<Services />} />
    <Route path="/services/:id" element={<ServiceDetail />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/booking" element={<Booking />} />
    <Route path="/booking/:id" element={<BookingDetails />} />
    <Route path="/login" element={<Login />} />
    <Route path="/auth" element={<LoginPage />} />

    {/* Admin routes */}
    <Route
      path="/admin"
      element={
        <RequireAuth>
          <Admin initialTab="dashboard" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/customers"
      element={
        <RequireAuth>
          <Admin initialTab="customers" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/customers/:customerId"
      element={
        <RequireAuth>
          <CustomerDetailPage />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/services"
      element={
        <RequireAuth>
          <Admin initialTab="services" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/products"
      element={
        <RequireAuth>
          <Admin initialTab="products" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/appointments"
      element={
        <RequireAuth>
          <Admin initialTab="appointments" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/staff"
      element={
        <RequireAuth>
          <Admin initialTab="staff" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <RequireAuth>
          <Admin initialTab="settings" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/profile"
      element={
        <RequireAuth>
          <Admin initialTab="profile" />
        </RequireAuth>
      }
    />
    <Route
      path="/admin/cash"
      element={
        <RequireAuth>
          <Admin initialTab="cash" />
        </RequireAuth>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AuthProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const UserProviders = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <AuthProviders>{children}</AuthProviders>
  </UserProvider>
);

const LanguageProviders = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>
    <UserProviders>{children}</UserProviders>
  </LanguageProvider>
);

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProviders>{children}</LanguageProviders>
    </BrowserRouter>
  </QueryClientProvider>
);

function App() {
  useEffect(() => {
    document.title = config.title;
  }, []);

  return (
    <AppProviders>
      <ScrollToTop />
      <AppRoutes />
      <Toaster />
    </AppProviders>
  );
}

export default App;
