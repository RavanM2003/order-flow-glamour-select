
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
      
      // First get staff who can perform this service
      const { data: staffWithService, error: staffError } = await supabase
        .rpc('get_staff_by_service', {
          service_id: serviceId
        });

      if (staffError) {
        console.error('useStaffByService: Staff function error:', staffError);
        setErrorByService(prev => ({ ...prev, [serviceKey]: `Failed to fetch staff: ${staffError.message}` }));
        setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
        return;
      }

      if (!staffWithService || staffWithService.length === 0) {
        console.log('useStaffByService: No staff found for service');
        setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
        return;
      }

      console.log('useStaffByService: Found staff with service:', staffWithService);

      // If date is provided, filter by availability
      if (date) {
        const weekday = date.getDay();
        console.log('useStaffByService: Checking availability for weekday:', weekday);
        
        const staffIds = staffWithService.map((s: any) => s.user_id);
        
        const { data: availableStaff, error: availError } = await supabase
          .from('staff_availability')
          .select(`
            staff_user_id,
            users!inner(id, full_name)
          `)
          .eq('weekday', weekday)
          .in('staff_user_id', staffIds);

        if (availError) {
          console.error('useStaffByService: Availability error:', availError);
          // Fallback to all staff if availability check fails
          const mappedStaff = staffWithService.map((s: any) => ({
            id: s.user_id,
            full_name: s.full_name,
            name: s.full_name
          }));
          setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
        } else {
          const mappedStaff = availableStaff?.map((s: any) => ({
            id: s.staff_user_id,
            full_name: s.users.full_name,
            name: s.users.full_name
          })) || [];
          setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
        }
      } else {
        // No date filter, return all staff
        const mappedStaff = staffWithService.map((s: any) => ({
          id: s.user_id,
          full_name: s.full_name,
          name: s.full_name
        }));
        setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
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
