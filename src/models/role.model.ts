
// User roles and permissions model
export type UserRole = "super_admin" | "admin" | "staff" | "cashier" | "appointment" | "service" | "product" | "guest";

// Define permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ['all'], // Super admins have all permissions
  admin: [
    'dashboard:view',
    'customers:view', 'customers:create', 'customers:edit',
    'services:view', 'services:create', 'services:edit',
    'products:view', 'products:create', 'products:edit',
    'appointments:view', 'appointments:create', 'appointments:edit',
    'cash:view', 'cash:create', 'cash:edit',
    'staff:view', 'staff:create', 'staff:edit',
    'settings:view'
  ],
  staff: [
    'dashboard:view',
    'customers:view',
    'services:view',
    'products:view',
    'appointments:view', 'appointments:create'
  ],
  cashier: [
    'dashboard:view',
    'customers:view',
    'products:view', 'products:create',
    'cash:view', 'cash:create', 'cash:edit'
  ],
  appointment: [
    'dashboard:view',
    'customers:view', 'customers:create', 'customers:edit',
    'appointments:view', 'appointments:create', 'appointments:edit'
  ],
  service: [
    'dashboard:view',
    'services:view', 'services:create', 'services:edit'
  ],
  product: [
    'dashboard:view',
    'products:view', 'products:create', 'products:edit'
  ],
  guest: ['dashboard:view']
};

// Map routes to required permissions
export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/admin': 'dashboard:view',
  '/admin/customers': 'customers:view',
  '/admin/services': 'services:view',
  '/admin/products': 'products:view',
  '/admin/appointments': 'appointments:view',
  '/admin/cash': 'cash:view',
  '/admin/staff': 'staff:view',
  '/admin/settings': 'settings:view'
};

// Define sidebar items with their required roles
export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  requiredRoles: UserRole[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { 
    id: "dashboard", 
    label: "Dashboard", 
    icon: "Home", 
    route: "/admin",
    requiredRoles: ["super_admin", "admin", "staff", "cashier", "appointment", "service", "product", "guest"]
  },
  { 
    id: "customers", 
    label: "Customers", 
    icon: "Users", 
    route: "/admin/customers",
    requiredRoles: ["super_admin", "admin", "appointment"]
  },
  { 
    id: "services", 
    label: "Services", 
    icon: "Scissors", 
    route: "/admin/services",
    requiredRoles: ["super_admin", "admin", "service"]
  },
  { 
    id: "products", 
    label: "Products", 
    icon: "Package", 
    route: "/admin/products",
    requiredRoles: ["super_admin", "admin", "cashier", "product"]
  },
  { 
    id: "appointments", 
    label: "Appointments", 
    icon: "Calendar", 
    route: "/admin/appointments",
    requiredRoles: ["super_admin", "admin", "appointment", "staff"]
  },
  { 
    id: "cash", 
    label: "Cash", 
    icon: "DollarSign", 
    route: "/admin/cash",
    requiredRoles: ["super_admin", "admin", "cashier"]
  },
  { 
    id: "staff", 
    label: "Staff", 
    icon: "User", 
    route: "/admin/staff",
    requiredRoles: ["super_admin", "admin"]
  },
  { 
    id: "settings", 
    label: "Settings", 
    icon: "Settings", 
    route: "/admin/settings",
    requiredRoles: ["super_admin"]
  }
];
