
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Scissors,
  Package,
  Settings,
  Home,
  Bell,
  User,
  DollarSign,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { SIDEBAR_ITEMS, SidebarItem, UserRole } from '@/models/role.model';
import { useLanguage } from '@/context/LanguageContext';

interface AdminVerticalNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications?: number;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Home: Home,
  Users: Users,
  Scissors: Scissors,
  Package: Package,
  Calendar: Calendar,
  DollarSign: DollarSign,
  User: User,
  Settings: Settings
};

const tabToUrl: Record<string, string> = {
  dashboard: '/admin',
  customers: '/admin/customers',
  services: '/admin/services',
  products: '/admin/products',
  appointments: '/admin/appointments',
  cash: '/admin/cash',
  staff: '/admin/staff',
  settings: '/admin/settings',
  profile: '/admin/profile',
};

const AdminVerticalNav = ({ activeTab, setActiveTab, notifications = 0 }: AdminVerticalNavProps) => {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Get user role from auth context and ensure it's a valid UserRole
  const userRole = (session.user?.role || 'customer') as UserRole;
  
  // Filter sidebar items based on user role
  const filteredItems = SIDEBAR_ITEMS.filter(item => 
    item.requiredRoles.includes(userRole)
  );
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
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
        {filteredItems.map((item) => {
          const IconComponent = iconMap[item.icon];
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex items-center w-full px-4 py-2.5 rounded-md text-sm transition-colors",
                activeTab === item.id
                  ? "bg-glamour-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              {IconComponent && <IconComponent className="h-5 w-5 mr-3" />}
              {t(`admin.${item.id}`)}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="ml-3">
              <p className="text-sm font-medium">{session.user?.firstName} {session.user?.lastName}</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
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
        <div className="mt-4 space-y-2">
          <a href="/admin/profile" className="block w-full text-center py-2 rounded bg-glamour-700 text-white font-semibold hover:bg-glamour-800 transition-colors">{t('admin.profile')}</a>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('admin.logout')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminVerticalNav;
