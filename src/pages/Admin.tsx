
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AdminVerticalNav from '@/components/admin/AdminVerticalNav';
import DashboardTab from '@/components/admin/DashboardTab';
import CustomersTab from '@/components/admin/CustomersTab';
import ServicesTab from '@/components/admin/ServicesTab';
import ProductsTab from '@/components/admin/ProductsTab';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import StaffTab from '@/components/admin/StaffTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications] = useState(5); // Example notifications count
  
  const getAddButtonText = () => {
    switch (activeTab) {
      case "customers":
        return "Add Customer";
      case "services":
        return "Add Service";
      case "products":
        return "Add Product";
      case "appointments":
        return "New Appointment";
      case "staff":
        return "Add Staff Member";
      default:
        return "";
    }
  };
  
  const showAddButton = ["customers", "services", "products", "appointments", "staff"].includes(activeTab);
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Vertical Sidebar */}
      <AdminVerticalNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications} 
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-glamour-800">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "customers" && "Customers"}
              {activeTab === "services" && "Services"}
              {activeTab === "products" && "Products"}
              {activeTab === "appointments" && "Appointments"}
              {activeTab === "settings" && "Settings"}
              {activeTab === "staff" && "Staff Management"}
            </h1>
            
            {showAddButton && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                {getAddButtonText()}
              </Button>
            )}
          </div>
          
          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "customers" && <CustomersTab />}
          {activeTab === "services" && <ServicesTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "appointments" && <AppointmentsTab />}
          {activeTab === "settings" && <SettingsTab />}
          {activeTab === "staff" && <StaffTab />}
        </main>
      </div>
    </div>
  );
};

export default Admin;
