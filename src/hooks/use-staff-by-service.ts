
import { useState, useEffect } from 'react';
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

  const fetchStaffByService = async (serviceId: number, date: Date) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedDate = date.toISOString().split('T')[0];
      console.log('Fetching staff for service:', serviceId, 'date:', formattedDate);
      
      const { data, error } = await supabase
        .rpc('get_available_staff_by_service_and_date', {
          service_id: serviceId,
          reservation_date: formattedDate
        });

      if (error) {
        console.error('Error fetching staff:', error);
        throw error;
      }

      console.log('Raw staff data from RPC:', data);

      // Map the RPC response to Staff model format
      const staffData = data?.map((item: any) => ({
        id: item.user_id,
        user_id: item.user_id,
        full_name: item.full_name,
        name: item.full_name, // For compatibility
      })) || [];

      console.log('Mapped staff data:', staffData);
      setStaff(staffData);
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    staff,
    loading,
    error,
    fetchStaffByService
  };
}
