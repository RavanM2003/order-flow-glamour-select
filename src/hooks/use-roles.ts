
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Role } from '@/models/role.model';
import { useToast } from './use-toast';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Since we don't have a roles table in the database anymore,
      // we'll create a list of roles from the role_enum type values
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      // Create roles from the role enum types we know are available
      const roleEnums: string[] = [
        'super_admin', 'admin', 'staff', 'cash', 'appointment', 
        'service', 'product', 'guest', 'customer', 'reception'
      ];
      
      const rolesList: Role[] = roleEnums.map((roleName, index) => ({
        id: index + 1,
        name: roleName,
        description: `Role for ${roleName} users`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      setRoles(rolesList);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch roles';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error fetching roles',
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getRoleById = useCallback((id: number): Role | undefined => {
    return roles.find(role => role.id === id);
  }, [roles]);

  const getRoleByName = useCallback((name: string): Role | undefined => {
    return roles.find(role => role.name === name);
  }, [roles]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    isLoading,
    error,
    fetchRoles,
    getRoleById,
    getRoleByName
  };
}
