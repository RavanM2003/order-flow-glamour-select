
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  PieChart,
  Users,
  Scissors,
  Package,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useLanguage();
  
  const menuItems = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: <PieChart size={20} /> },
    { id: 'customers', label: t('admin.customers'), icon: <Users size={20} /> },
    { id: 'services', label: t('admin.services'), icon: <Scissors size={20} /> },
    { id: 'products', label: t('admin.products'), icon: <Package size={20} /> },
    { id: 'appointments', label: t('admin.appointments'), icon: <Calendar size={20} /> },
    { id: 'staff', label: t('admin.staff'), icon: <Users size={20} /> },
    { id: 'settings', label: t('admin.settings'), icon: <Settings size={20} /> },
  ];
  
  return (
    <div 
      className={`h-screen bg-white border-r flex flex-col ${collapsed ? 'w-16' : 'w-64'} 
        transition-all duration-300 ease-in-out z-10 shadow-sm`}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && <div className="font-bold text-xl text-glamour-800">Admin</div>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <div className="py-4 flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2">
          {menuItems.map(item => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${activeTab === item.id ? 'bg-glamour-100 text-glamour-800' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">
            <Home size={18} className="mr-2" />
            {!collapsed && <span>{t('admin.backToSite')}</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default React.memo(AdminSidebar);
