
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
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('id');
      
      if (error) {
        throw error;
      }
      
      setRoles(data || []);
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
