import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
  
  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);
  
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Vertical Sidebar */}
      <AdminVerticalNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-glamour-800">
              {isCustomerDetail
                ? "Customer Details"
                : activeTab === "dashboard" ? "Dashboard"
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
