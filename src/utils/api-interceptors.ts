
import { supabase } from '@/integrations/supabase/client';
import { useQueryStore } from '@/stores/useQueryStore';
import { toast } from '@/hooks/use-toast';

// Request interceptor for global loading states
export const setupApiInterceptors = () => {
  // Override the default supabase methods to add interceptors
  const originalFrom = supabase.from.bind(supabase);
  
  supabase.from = function(table: string) {
    const query = originalFrom(table);
    const { setGlobalLoading } = useQueryStore.getState();
    
    // Override select method
    const originalSelect = query.select.bind(query);
    query.select = function(...args: any[]) {
      setGlobalLoading(true);
      
      const result = originalSelect(...args);
      
      // Add promise interceptor
      if (result && typeof result.then === 'function') {
        return result
          .then((response: any) => {
            setGlobalLoading(false);
            return response;
          })
          .catch((error: any) => {
            setGlobalLoading(false);
            
            // Global error handling
            if (error.code === 'PGRST116') {
              toast({
                title: 'Unauthorized',
                description: 'You need to log in to access this resource',
                variant: 'destructive',
              });
            } else if (error.code === 'PGRST301') {
              toast({
                title: 'Access Denied',
                description: 'You do not have permission to access this resource',
                variant: 'destructive',
              });
            }
            
            throw error;
          });
      }
      
      return result;
    };
    
    // Override insert method
    const originalInsert = query.insert.bind(query);
    query.insert = function(...args: any[]) {
      setGlobalLoading(true);
      
      const result = originalInsert(...args);
      
      if (result && typeof result.then === 'function') {
        return result
          .then((response: any) => {
            setGlobalLoading(false);
            
            // Success notification for mutations
            toast({
              title: 'Success',
              description: 'Data saved successfully',
              variant: 'default',
            });
            
            return response;
          })
          .catch((error: any) => {
            setGlobalLoading(false);
            throw error;
          });
      }
      
      return result;
    };
    
    // Override update method
    const originalUpdate = query.update.bind(query);
    query.update = function(...args: any[]) {
      setGlobalLoading(true);
      
      const result = originalUpdate(...args);
      
      if (result && typeof result.then === 'function') {
        return result
          .then((response: any) => {
            setGlobalLoading(false);
            
            toast({
              title: 'Success',
              description: 'Data updated successfully',
              variant: 'default',
            });
            
            return response;
          })
          .catch((error: any) => {
            setGlobalLoading(false);
            throw error;
          });
      }
      
      return result;
    };
    
    // Override delete method
    const originalDelete = query.delete.bind(query);
    query.delete = function(...args: any[]) {
      setGlobalLoading(true);
      
      const result = originalDelete(...args);
      
      if (result && typeof result.then === 'function') {
        return result
          .then((response: any) => {
            setGlobalLoading(false);
            
            toast({
              title: 'Success',
              description: 'Data deleted successfully',
              variant: 'default',
            });
            
            return response;
          })
          .catch((error: any) => {
            setGlobalLoading(false);
            throw error;
          });
      }
      
      return result;
    };
    
    return query;
  };
};

// Validation helpers
export const validateApiResponse = <T>(response: any): response is { data: T; error: null } => {
  return response && response.error === null && response.data !== null;
};

export const extractApiError = (response: any): string => {
  if (response?.error) {
    if (typeof response.error === 'string') {
      return response.error;
    }
    
    if (response.error.message) {
      return response.error.message;
    }
    
    if (response.error.details) {
      return response.error.details;
    }
    
    return 'An unknown error occurred';
  }
  
  return 'Request failed';
};
