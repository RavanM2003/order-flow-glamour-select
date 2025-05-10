
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Settings, 
  Users, 
  Home,
  ChevronRight, 
  Calendar, 
  PieChart,
  Scissors,
  Package,
  Calendar as CalendarIcon,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardTab from '@/components/admin/DashboardTab';
import CustomersTab from '@/components/admin/CustomersTab';
import ServicesTab from '@/components/admin/ServicesTab';
import ProductsTab from '@/components/admin/ProductsTab';
import AppointmentsTab from '@/components/admin/AppointmentsTab';
import SettingsTab from '@/components/admin/SettingsTab';
import StaffTab from '@/components/admin/StaffTab';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
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
            
            {activeTab === "customers" && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                Add Customer
              </Button>
            )}
            
            {activeTab === "services" && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                Add Service
              </Button>
            )}
            
            {activeTab === "products" && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            )}
            
            {activeTab === "appointments" && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                New Appointment
              </Button>
            )}
            
            {activeTab === "staff" && (
              <Button className="bg-glamour-700 hover:bg-glamour-800">
                <Plus size={16} className="mr-2" />
                Add Staff Member
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
