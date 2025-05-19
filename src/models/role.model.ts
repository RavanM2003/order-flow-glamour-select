
export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export type RoleName = 'super_admin' | 'admin' | 'cash' | 'appointment' | 'service' | 'product';

export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  super_admin: ['all'],
  admin: ['manage_staff', 'manage_services', 'manage_products', 'manage_appointments', 'manage_cash'],
  cash: ['view_cash', 'manage_cash', 'view_products'],
  appointment: ['view_appointments', 'manage_appointments', 'view_staff', 'view_services'],
  service: ['view_services', 'manage_services'],
  product: ['view_products', 'manage_products']
};
