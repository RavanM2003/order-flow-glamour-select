
import React from 'react';
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

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <PieChart size={20} /> },
    { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
    { id: 'services', label: 'Services', icon: <Scissors size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { id: 'staff', label: 'Staff', icon: <Users size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];
  
  return (
    <div className={`bg-white border-r flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-width duration-300 ease-in-out`}>
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
            {!collapsed && <span>Back to Site</span>}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
