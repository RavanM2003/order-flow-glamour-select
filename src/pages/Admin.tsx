
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import AdminVerticalNav from '@/components/admin/AdminVerticalNav';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardTab from '@/components/admin/DashboardTab';
import CustomersTab from '@/components/admin/CustomersTab';
import ServicesTab from '@/components/admin/ServicesTab';
import ProductsTab from '@/components/admin/ProductsTab';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import StaffTab from '@/components/admin/StaffTab';
import AdminProfile from '@/components/admin/AdminProfile';
import CustomerDetailPage from './CustomerDetailPage';
import { useLocation, useParams } from 'react-router-dom';
import CashTab from '@/components/admin/CashTab';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { config } from '@/config/env';

interface AdminProps {
  initialTab?: string;
}

const tabFromPath = (pathname: string) => {
  if (pathname.endsWith('/profile')) return 'profile';
  if (pathname.endsWith('/products')) return 'products';
  if (pathname.endsWith('/customers')) return 'customers';
  if (pathname.endsWith('/services')) return 'services';
  if (pathname.endsWith('/appointments')) return 'appointments';
  if (pathname.endsWith('/staff')) return 'staff';
  if (pathname.endsWith('/settings')) return 'settings';
  if (pathname.endsWith('/cash')) return 'cash';
  return 'dashboard';
};

const Admin: React.FC<AdminProps> = ({ initialTab }) => {
  const location = useLocation();
  const { customerId } = useParams();
  const isCustomerDetail = location.pathname.startsWith('/admin/customers/') && customerId;
  const [activeTab, setActiveTab] = useState(tabFromPath(location.pathname));
  const [notifications] = useState(90); // Example notifications count
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);
  
  // Close sidebar when changing tabs on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [activeTab, isMobile]);
  
  // Log environment info when admin loads (helpful for debugging)
  useEffect(() => {
    if (config.features.showDebugInfo) {
      console.log('Admin loaded in', config.usesMockData ? 'mock mode' : 'API mode');
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "z-20 transition-all duration-300",
          isMobile ? "fixed left-0 top-0 bottom-0" : "relative",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <AdminVerticalNav 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          notifications={notifications} 
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <AdminHeader />
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 z-30"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold text-glamour-800">
              {isCustomerDetail
                ? "Customer Details"
                : activeTab === "dashboard" ? "Dashboard"
                : activeTab === "customers" ? "Customers"
                : activeTab === "services" ? "Services"
                : activeTab === "products" ? "Products"  
                : activeTab === "appointments" ? "Appointments"
                : activeTab === "cash" ? "Cash Management"
                : activeTab === "staff" ? "Staff"
                : activeTab === "settings" ? "Settings"
                : activeTab === "profile" ? "Profile"
                : ""
              }
            </h1>
          </div>
          {isCustomerDetail ? (
            <CustomerDetailPage />
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardTab />}
              {activeTab === "customers" && <CustomersTab />}
              {activeTab === "services" && <ServicesTab />}
              {activeTab === "products" && <ProductsTab />}
              {activeTab === "appointments" && <AppointmentsTab />}
              {activeTab === "cash" && <CashTab />}
              {activeTab === "settings" && <SettingsTab />}
              {activeTab === "staff" && <StaffTab />}
              {activeTab === "profile" && <AdminProfile />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
