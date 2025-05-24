
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
      const { data, error } = await supabase
        .rpc('get_available_staff_by_service_and_date', {
          service_id: serviceId,
          reservation_date: formattedDate
        });

      if (error) {
        throw error;
      }

      const staffData = data?.map((item: any) => ({
        id: item.user_id,
        full_name: item.full_name,
        user_id: item.user_id
      })) || [];

      setStaff(staffData);
    } catch (err) {
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
