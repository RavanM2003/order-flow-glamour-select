
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
      
      let staffData;
      
      if (date) {
        // Date verilsə, availability yoxlayırıq
        const { data, error } = await supabase
          .rpc('get_available_staff_by_service_and_date', {
            service_id: serviceId,
            check_date: date.toISOString().split('T')[0]
          });
          
        if (error) {
          console.error('useStaffByService: Availability function error:', error);
          throw error;
        }
        staffData = data;
      } else {
        // Date verilməsə, bütün staff-ları gətiririk
        const { data, error } = await supabase
          .rpc('get_staff_by_service', {
            service_id: serviceId
          });
          
        if (error) {
          console.error('useStaffByService: Staff function error:', error);
          throw error;
        }
        staffData = data;
      }

      if (!staffData || staffData.length === 0) {
        console.log('useStaffByService: No staff found for service');
        setStaffByService(prev => ({ ...prev, [serviceKey]: [] }));
        return;
      }

      console.log('useStaffByService: Found staff:', staffData);

      // Staff məlumatlarını map edirik
      const mappedStaff = staffData.map((s: any) => ({
        id: s.user_id,
        full_name: s.full_name,
        name: s.full_name,
        position: s.staff_position || 'Ustad',
        email: s.email,
        phone: s.phone
      }));

      setStaffByService(prev => ({ ...prev, [serviceKey]: mappedStaff }));
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
