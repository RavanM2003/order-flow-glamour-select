
import { useState, useCallback, useEffect } from 'react';
import { Staff, StaffFormData } from '@/models/staff.model';
import { staffService } from '@/services';
import { toast } from '@/components/ui/use-toast';

export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await staffService.getAll();
      
      if (response.error) {
        setError(response.error);
        toast({
          variant: "destructive",
          title: "Xəta",
          description: response.error,
        });
        return;
      }
      
      if (response.data) {
        setStaff(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      const errorMessage = err instanceof Error ? err.message : 'Staff yüklənə bilmədi';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const createStaffMember = useCallback(async (staffData: StaffFormData) => {
    setIsLoading(true);
    try {
      const response = await staffService.createStaffMember(staffData);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: response.error,
        });
        return null;
      }
      
      toast({
        title: "Uğurlu",
        description: response.message || "İşçi əlavə edildi",
      });
      
      await fetchStaff();
      return response.data;
    } catch (err) {
      console.error('Failed to create staff member:', err);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: err instanceof Error ? err.message : "İşçi əlavə edilə bilmədi",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStaff]);

  const updateStaffMember = useCallback(async (id: string, updates: Partial<StaffFormData>) => {
    setIsLoading(true);
    try {
      const response = await staffService.updateStaffMember(id, updates);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: response.error,
        });
        return null;
      }
      
      toast({
        title: "Uğurlu",
        description: response.message || "İşçi məlumatları yeniləndi",
      });
      
      await fetchStaff();
      return response.data;
    } catch (err) {
      console.error('Failed to update staff member:', err);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: err instanceof Error ? err.message : "İşçi məlumatları yenilənə bilmədi",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStaff]);

  const deleteStaffMember = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const response = await staffService.deleteStaffMember(id);
      
      if (response.error) {
        toast({
          variant: "destructive",
          title: "Xəta",
          description: response.error,
        });
        return false;
      }
      
      toast({
        title: "Uğurlu",
        description: response.message || "İşçi silindi",
      });
      
      await fetchStaff();
      return true;
    } catch (err) {
      console.error('Failed to delete staff member:', err);
      toast({
        variant: "destructive",
        title: "Xəta",
        description: err instanceof Error ? err.message : "İşçi silinə bilmədi",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStaff]);

  return {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
  };
}
