
import { ApiService } from './api.service';
import { Role } from '@/models/role.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';

export class RoleService extends ApiService {
  // Get all roles
  async getAll(): Promise<ApiResponse<Role[]>> {
    if (config.usesMockData) {
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
        }
      ];
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: mockRoles };
    }
    
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('id');
      
      if (error) {
        throw error;
      }
      
      return { data: data as Role[] };
    } catch (error) {
      console.error('Error fetching roles:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch roles' };
    }
  }

  // Get role by ID
  async getById(id: number): Promise<ApiResponse<Role>> {
    if (config.usesMockData) {
      const roles = await this.getAll();
      const role = roles.data?.find(r => r.id === id);
      
      if (!role) {
        return { error: 'Role not found' };
      }
      
      return { data: role };
    }
    
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return { data: data as Role };
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
