
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Staff } from '@/models/staff.model';

interface UseStaffByServiceResult {
  staff: Staff[];
  loading: boolean;
  error: string | null;
  fetchStaffByService: (serviceId: number, date: Date) => Promise<void>;
}

export function useStaffByService(): UseStaffByServiceResult {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffByService = useCallback(async (serviceId: number, date: Date) => {
    console.log('useStaffByService: Starting fetch', { serviceId, date });
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = date.toISOString().split('T')[0];
      console.log('useStaffByService: Calling RPC with:', {
        service_id: serviceId,
        reservation_date: formattedDate
      });
      
      const { data, error } = await supabase
        .rpc('get_available_staff_by_service_and_date', {
          service_id: serviceId,
          reservation_date: formattedDate
        });

      console.log('useStaffByService: RPC response:', { data, error });

      if (error) {
        console.error('useStaffByService: RPC error:', error);
        throw error;
      }

      // Map the RPC response to Staff model format
      const staffData = data?.map((item: any) => {
        console.log('useStaffByService: Mapping staff item:', item);
        return {
          id: item.user_id,
          user_id: item.user_id,
          full_name: item.full_name,
          name: item.full_name, // For compatibility
        };
      }) || [];

      console.log('useStaffByService: Final mapped staff data:', staffData);
      setStaff(staffData);
      
      // If no staff found, also try the fallback get_staff_by_service function
      if (staffData.length === 0) {
        console.log('useStaffByService: No staff found with availability, trying fallback');
        const { data: fallbackData, error: fallbackError } = await supabase
          .rpc('get_staff_by_service', {
            service_id: serviceId
          });
          
        if (!fallbackError && fallbackData?.length > 0) {
          const fallbackStaffData = fallbackData.map((item: any) => ({
            id: item.user_id,
            user_id: item.user_id,
            full_name: item.full_name,
            name: item.full_name,
          }));
          console.log('useStaffByService: Using fallback staff data:', fallbackStaffData);
          setStaff(fallbackStaffData);
        }
      }
    } catch (err) {
      console.error('useStaffByService: Failed to fetch staff:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch staff');
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
}
