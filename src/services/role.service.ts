import { ApiService } from './api.service';
import { Role } from '@/models/role.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';

export const usesMockData = () => {
  return Boolean(config.features.debugMode);
};

export class RoleService extends ApiService {
  // Get all roles
  async getAll(): Promise<ApiResponse<Role[]>> {
    if (usesMockData()) {
      // Mock roles for development
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'super_admin',
          description: 'Has full access to all system features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'admin',
          description: 'Has access to most system features except super admin features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'cash',
          description: 'Has access to cash management features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 4,
          name: 'appointment',
          description: 'Has access to appointment management features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 5,
          name: 'service',
          description: 'Has access to service management features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 6,
          name: 'product',
          description: 'Has access to product management features',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 7,
          name: 'customer',
          description: 'Regular customer role',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 8,
          name: 'reception',
          description: 'Reception role for managing appointments',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: mockRoles };
    }
    
    try {
      // Since we don't have a roles table in the database anymore,
      // we'll create a list of roles from the role_enum type values
      const roleEnums: string[] = [
        'super_admin', 'admin', 'staff', 'cashier', 'appointment', 
        'service', 'product', 'guest', 'cash', 'customer', 'reception'
      ];
      
      const rolesList: Role[] = roleEnums.map((roleName, index) => ({
        id: index + 1,
        name: roleName,
        description: `Role for ${roleName} users`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      return { data: rolesList };
    } catch (error) {
      console.error('Error creating roles list:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch roles' };
    }
  }

  // Get role by ID
  async getById(id: number): Promise<ApiResponse<Role>> {
    try {
      const roles = await this.getAll();
      const role = roles.data?.find(r => r.id === id);
      
      if (!role) {
        return { error: 'Role not found' };
      }
      
      return { data: role };
    } catch (error) {
      console.error(`Error fetching role with ID ${id}:`, error);
      return { error: error instanceof Error ? error.message : `Failed to fetch role with ID ${id}` };
    }
  }
}

// Create a singleton instance
export const roleService = new RoleService();

// Add to services index
export * from './role.service';
