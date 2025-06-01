
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
  const [staffByService, setStaffByService] = useState<Record<string, Staff[]>>({});
  const [loadingByService, setLoadingByService] = useState<Record<string, boolean>>({});
  const [errorByService, setErrorByService] = useState<Record<string, string | null>>({});

  const fetchStaffByService = useCallback(async (serviceId: number, date?: Date) => {
    if (!serviceId) {
      console.error('useStaffByService: No serviceId provided');
      const serviceKey = `service_${serviceId}`;
      setErrorByService(prev => ({ ...prev, [serviceKey]: 'Service ID is required' }));
      return;
    }

    const serviceKey = `service_${serviceId}`;
    setLoadingByService(prev => ({ ...prev, [serviceKey]: true }));
    setErrorByService(prev => ({ ...prev, [serviceKey]: null }));
    
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
          setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
          setLoadingByService(prev => ({ ...prev, [serviceKey]: false }));
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
        setErrorByService(prev => ({ ...prev, [serviceKey]: `Failed to fetch staff: ${staffError.message}` }));
        setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
      } else if (staffWithService && staffWithService.length > 0) {
        console.log('useStaffByService: Found staff with service:', staffWithService);
        const mappedStaff = staffWithService.map((s: any) => ({
          id: s.user_id,
          full_name: s.full_name,
          name: s.full_name
        }));
        setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
      } else {
        console.log('useStaffByService: No staff found for service');
        setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
      }
    } catch (err) {
      console.error('useStaffByService: Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setErrorByService(prev => ({ ...prev, [serviceKey]: errorMessage }));
      setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
    } finally {
      setLoadingByService(prev => ({ ...prev, [serviceKey]: false }));
    }
  }, []);

  const getStaffForService = useCallback((serviceId: number) => {
    const serviceKey = `service_${serviceId}`;
    return {
      staff: staffByService[serviceKey] || [],
      loading: loadingByService[serviceKey] || false,
      error: errorByService[serviceKey] || null
    };
  }, [staffByService, loadingByService, errorByService]);

  return {
    fetchStaffByService,
    getStaffForService
  };
};
