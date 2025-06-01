
import { Link, useNavigate } from "react-router-dom";
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
  LogOut,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-simple-auth";
import { Button } from "@/components/ui/button";
import { SIDEBAR_ITEMS, UserRole } from "@/models/role.model";
import { useLanguage } from "@/context/LanguageContext";

interface AdminVerticalNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications?: number;
}

const UserInfo = ({ user }) => (
  <div className="flex items-center">
    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
    <div className="ml-3">
      <p className="text-sm font-medium">
        {user?.full_name || user?.email || "Admin User"}
      </p>
      <p className="text-xs text-gray-500">{user?.email || "admin@glamour.az"}</p>
    </div>
  </div>
);

const NotificationBell = ({ count }) => (
  <div className="relative">
    <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />
    {count > 0 && (
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
        {count > 9 ? "9+" : count}
      </div>
    )}
  </div>
);

const UserProfile = ({ user, notifications, onLogout, t }) => (
  <div className="p-4 border-t">
    <div className="flex items-center justify-between">
      <UserInfo user={user} />
      <NotificationBell count={notifications} />
    </div>
    <div className="mt-4 space-y-2">
      <a
        href="/admin/profile"
        className="block w-full text-center py-2 rounded bg-glamour-700 text-white font-semibold hover:bg-glamour-800 transition-colors"
      >
        {t("admin.profile")}
      </a>
      <Button variant="outline" className="w-full" onClick={onLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        {t("admin.logout")}
      </Button>
    </div>
  </div>
);

const iconMap: Record<string, LucideIcon> = {
  Home,
  Users,
  Scissors,
  Package,
  Calendar,
  DollarSign,
  User,
  Settings,
};

const AdminVerticalNav = ({
  activeTab,
  onTabChange,
  notifications = 0,
}: AdminVerticalNavProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Get user role from user object or default to super_admin for admin users
  const userRole = (user?.role || "super_admin") as UserRole;

  // Filter sidebar items based on user role
  const filteredItems = SIDEBAR_ITEMS.filter((item) =>
    item.requiredRoles.includes(userRole)
  );

  const handleLogout = async () => {
    logout();
    navigate("/admin-login");
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
              onClick={() => onTabChange(item.id)}
            >
              {IconComponent && <IconComponent className="h-5 w-5 mr-3" />}
              {t(`admin.${item.id}`)}
            </Link>
          );
        })}
      </div>

      <UserProfile
        user={user}
        notifications={notifications}
        onLogout={handleLogout}
        t={t}
      />
    </div>
  );
};

export default AdminVerticalNav;
