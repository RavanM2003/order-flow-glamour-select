
import { supabase } from '@/integrations/supabase/client';
import { useQueryStore } from '@/stores/useQueryStore';
import { toast } from '@/hooks/use-toast';

// Global API interceptor setup
export const setupApiInterceptors = () => {
  console.log('Setting up API interceptors...');
  
  // Global error handler for authentication errors
  const handleGlobalError = (error: any) => {
    if (error?.code === 'PGRST116') {
      toast({
        title: 'Unauthorized',
        description: 'You need to log in to access this resource',
        variant: 'destructive',
      });
    } else if (error?.code === 'PGRST301') {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this resource',
        variant: 'destructive',
      });
    } else if (error?.message && !error?.message.includes('aborted')) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Success notification helper
  const showSuccessNotification = (operation: string) => {
    const messages = {
      insert: 'Data saved successfully',
      update: 'Data updated successfully',
      delete: 'Data deleted successfully'
    };
    
    toast({
      title: 'Success',
      description: messages[operation as keyof typeof messages] || 'Operation completed successfully',
      variant: 'default',
    });
  };

  // Store reference for use in interceptors
  const setGlobalLoading = (loading: boolean) => {
    useQueryStore.getState().setGlobalLoading(loading);
  };

  console.log('API interceptors setup completed');
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
