
import React from 'react';
import {
  Calendar,
  Users,
  Scissors,
  Package,
  Settings,
  Home,
  Bell,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "customers", label: "Customers", icon: Users },
  { id: "services", label: "Services", icon: Scissors },
  { id: "products", label: "Products", icon: Package },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "staff", label: "Staff", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

interface AdminVerticalNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications?: number;
}

const AdminVerticalNav = ({ activeTab, setActiveTab, notifications = 0 }: AdminVerticalNavProps) => {
  return (
    <div className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-glamour-700 flex items-center justify-center text-white font-bold">
            GS
          </div>
          <span className="font-bold text-lg">Glamour Studio</span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center w-full px-4 py-2.5 rounded-md text-sm",
              activeTab === item.id
                ? "bg-glamour-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@glamour.com</p>
            </div>
          </div>
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                {notifications > 9 ? '9+' : notifications}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVerticalNav;
