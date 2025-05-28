
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import OptimizedAdminLayout from '@/components/admin/OptimizedAdminLayout';
import OptimizedDashboard from '@/components/admin/OptimizedDashboard';
import CustomersTab from '@/components/admin/CustomersTab';
import ServicesTab from '@/components/admin/ServicesTab';
import ProductsTab from '@/components/admin/ProductsTab';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import StaffTab from '@/components/admin/StaffTab';
import AdminProfile from '@/components/admin/AdminProfile';
import CustomerDetailPage from './CustomerDetailPage';
import CashTab from '@/components/admin/CashTab';
import ErrorBoundary from '@/components/common/ErrorBoundary';

interface OptimizedAdminProps {
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

const OptimizedAdmin: React.FC<OptimizedAdminProps> = ({ initialTab }) => {
  const location = useLocation();
  const { customerId } = useParams();
  const isCustomerDetail = location.pathname.startsWith('/admin/customers/') && customerId;
  const [activeTab, setActiveTab] = useState(tabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(tabFromPath(location.pathname));
  }, [location.pathname]);

  // Mock data for dashboard
  const dashboardStats = {
    customers: 1250,
    revenue: 45600,
    appointments: 89,
    growth: 12
  };

  const getTabTitle = () => {
    if (isCustomerDetail) return "Müştəri Təfərrüatları";
    
    switch (activeTab) {
      case "dashboard": return "Dashboard";
      case "customers": return "Müştərilər";
      case "services": return "Xidmətlər";
      case "products": return "Məhsullar";
      case "appointments": return "Təyinatlar";
      case "cash": return "Kassa";
      case "staff": return "Personal";
      case "settings": return "Tənzimləmələr";
      case "profile": return "Profil";
      default: return "";
    }
  };

  const renderTabContent = () => {
    if (isCustomerDetail) {
      return <CustomerDetailPage />;
    }

    switch (activeTab) {
      case "dashboard":
        return <OptimizedDashboard stats={dashboardStats} />;
      case "customers":
        return <CustomersTab />;
      case "services":
        return <ServicesTab />;
      case "products":
        return <ProductsTab />;
      case "appointments":
        return <AppointmentsTab />;
      case "cash":
        return <CashTab />;
      case "settings":
        return <SettingsTab />;
      case "staff":
        return <StaffTab />;
      case "profile":
        return <AdminProfile />;
      default:
        return <OptimizedDashboard stats={dashboardStats} />;
    }
  };

  return (
    <ErrorBoundary>
      <OptimizedAdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getTabTitle()}
          </h1>
        </div>
        {renderTabContent()}
      </OptimizedAdminLayout>
    </ErrorBoundary>
  );
};

export default OptimizedAdmin;
