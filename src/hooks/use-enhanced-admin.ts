
import { useState, useEffect } from 'react';
import { enhancedUserService, enhancedServiceService, enhancedAppointmentService } from '@/services/api/enhanced-supabase.service';
import { toast } from '@/hooks/use-toast';

export const useEnhancedAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiCall = async <T>(
    apiCall: () => Promise<{ data?: T; error?: string; status?: string }>,
    successMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      
      if (result.error) {
        setError(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return null;
      }
      
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      
      return result.data || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleApiCall,
    userService: enhancedUserService,
    serviceService: enhancedServiceService,
    appointmentService: enhancedAppointmentService
  };
};
