
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Staff {
  id: string;
  name?: string;
  full_name?: string;
  position?: string;
  email?: string;
  phone?: string;
}

export const useStaffByService = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffByService = useCallback(async (serviceId: number, date?: Date) => {
    if (!serviceId) {
      console.error('useStaffByService: No serviceId provided');
      setError('Service ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('useStaffByService: Fetching staff for service:', serviceId, 'date:', date);
      
      // First try using the Supabase function for available staff by service and date
      if (date) {
        const dateString = date.toISOString().split('T')[0];
        console.log('useStaffByService: Using date-based function with date:', dateString);
        
        const { data: availableStaff, error: functionError } = await supabase
          .rpc('get_available_staff_by_service_and_date', {
            service_id: serviceId,
            reservation_date: dateString
          });

        if (functionError) {
          console.error('useStaffByService: Function error:', functionError);
        } else if (availableStaff && availableStaff.length > 0) {
          console.log('useStaffByService: Found available staff:', availableStaff);
          const mappedStaff = availableStaff.map((s: any) => ({
            id: s.user_id,
            full_name: s.full_name,
            name: s.full_name
          }));
          setStaff(mappedStaff);
          setLoading(false);
          return;
        }
      }

      // Fallback: Get all staff with this service specialization
      console.log('useStaffByService: Using fallback method');
      const { data: staffWithService, error: staffError } = await supabase
        .rpc('get_staff_by_service', {
          service_id: serviceId
        });

      if (staffError) {
        console.error('useStaffByService: Staff function error:', staffError);
        setError(`Failed to fetch staff: ${staffError.message}`);
        setStaff([]);
      } else if (staffWithService && staffWithService.length > 0) {
        console.log('useStaffByService: Found staff with service:', staffWithService);
        const mappedStaff = staffWithService.map((s: any) => ({
          id: s.user_id,
          full_name: s.full_name,
          name: s.full_name
        }));
        setStaff(mappedStaff);
      } else {
        console.log('useStaffByService: No staff found for service');
        setStaff([]);
      }
    } catch (err) {
      console.error('useStaffByService: Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    staff,
    loading,
    error,
    fetchStaffByService
  };
};
