
import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './use-api';
import { staffService } from '@/services';
import { Staff, StaffPayment, StaffServiceRecord, StaffFormData, StaffWorkingHours } from '@/models/staff.model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useStaff() {
  const api = useApi<Staff[]>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [serviceRecords, setServiceRecords] = useState<StaffServiceRecord[]>([]);
  const [workingHours, setWorkingHours] = useState<StaffWorkingHours[]>([]);
  const [earnings, setEarnings] = useState<{
    salary: number;
    commission: number;
    expenses: number;
    total: number;
  } | null>(null);
  const fetchedRef = useRef(false);
  const fetchPromiseRef = useRef<Promise<Staff[] | null> | null>(null);
  
  const fetchStaff = useCallback(async () => {
    // Skip fetching if we've already fetched or have a fetch in progress
    if (fetchedRef.current) return staff;
    if (fetchPromiseRef.current) return fetchPromiseRef.current;
    
    console.log('Fetching staff...');
    
    try {
      // Start a new fetch and store the promise
      fetchPromiseRef.current = api.execute(
        () => staffService.getAll(),
        {
          showErrorToast: false,
          errorPrefix: 'Failed to load staff'
        }
      ).then(async (data) => {
        if (data && data.length > 0) {
          setStaff(data);
          fetchedRef.current = true;
          return data;
        }
        
        // If no data from service, try direct Supabase query
        console.log('Trying to fetch staff directly from Supabase...');
        const { data: supabaseData, error } = await supabase
          .from('staff')
          .select('*');
          
        if (error) {
          console.error('Error fetching staff from Supabase:', error);
          toast({
            variant: "destructive",
            title: "Failed to load staff",
            description: error.message
          });
          return null;
        }
        
        if (supabaseData && supabaseData.length > 0) {
          setStaff(supabaseData);
          fetchedRef.current = true;
          return supabaseData;
        }
        
        // Return original mock data if nothing found in Supabase
        return null;
      }).catch(error => {
        console.error('Error in fetchStaff:', error);
        toast({
          variant: "destructive",
          title: "Failed to load staff",
          description: "Could not load staff data"
        });
        return null;
      }).finally(() => {
        // Clear the promise reference when done
        fetchPromiseRef.current = null;
      });
      
      return fetchPromiseRef.current;
    } catch (error) {
      console.error('Unexpected error in fetchStaff:', error);
      fetchPromiseRef.current = null;
      return null;
    }
  }, [api, staff]);
  
  // Only fetch on component mount, not on every render
  useEffect(() => {
    if (!fetchedRef.current && !fetchPromiseRef.current) {
      fetchStaff();
    }
    // We intentionally omit fetchStaff from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const getStaffMember = useCallback(async (id: number | string) => {
    try {
      const response = await staffService.getById(id);
      if (response.data) {
        setSelectedStaff(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching staff member ${id}:`, error);
      return null;
    }
  }, []);
  
  const clearSelectedStaff = useCallback(() => {
    setSelectedStaff(null);
    setStaffPayments([]);
    setServiceRecords([]);
    setWorkingHours([]);
    setEarnings(null);
  }, []);
  
  const fetchStaffPayments = useCallback(async (staffId: number | string) => {
    try {
      const response = await staffService.getPayments(staffId);
      if (response.data) {
        setStaffPayments(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for staff ${staffId}:`, error);
      return [];
    }
  }, []);
  
  const fetchServiceRecords = useCallback(async (staffId: number | string) => {
    try {
      const response = await staffService.getServiceRecords(staffId);
      if (response.data) {
        setServiceRecords(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching service records for staff ${staffId}:`, error);
      return [];
    }
  }, []);
  
  const calculateEarnings = useCallback(async (
    staffId: number | string, 
    month: number, 
    year: number
  ) => {
    try {
      const response = await staffService.calculateEarnings(staffId, month, year);
      if (response.data) {
        setEarnings(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error calculating earnings for staff ${staffId}:`, error);
      return null;
    }
  }, []);
  
  // Working hours functions
  const fetchWorkingHours = useCallback(async (staffId: number | string) => {
    try {
      const response = await staffService.getWorkingHours(staffId);
      if (response.data) {
        setWorkingHours(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching working hours for staff ${staffId}:`, error);
      return [];
    }
  }, []);
  
  const updateWorkingHours = useCallback(async (
    staffId: number | string, 
    dayOfWeek: number, 
    hours: Partial<StaffWorkingHours>
  ) => {
    const result = await api.execute(
      () => staffService.updateWorkingHours(staffId, dayOfWeek, hours),
      {
        showSuccessToast: true,
        successMessage: 'Working hours updated successfully',
        errorPrefix: 'Failed to update working hours',
        onSuccess: () => {
          fetchWorkingHours(staffId);
        }
      }
    );
    
    return result;
  }, [api, fetchWorkingHours]);
  
  const checkAvailability = useCallback(async (
    staffId: number | string, 
    date: Date
  ) => {
    try {
      const response = await staffService.checkAvailability(staffId, date);
      return response.data;
    } catch (error) {
      console.error(`Error checking availability for staff ${staffId}:`, error);
      return false;
    }
  }, []);
  
  // Create, update and delete staff functions
  const createStaffMember = useCallback(async (data: StaffFormData) => {
    const result = await api.execute(
      () => staffService.create(data),
      {
        showSuccessToast: true,
        successMessage: 'Staff member created successfully',
        errorPrefix: 'Failed to create staff member',
        onSuccess: () => {
          fetchStaff();
        }
      }
    );
    
    return result;
  }, [api, fetchStaff]);
  
  const updateStaffMember = useCallback(async (id: number | string, data: Partial<StaffFormData>) => {
    const result = await api.execute(
      () => staffService.update(id, data),
      {
        showSuccessToast: true,
        successMessage: 'Staff member updated successfully',
        errorPrefix: 'Failed to update staff member',
        onSuccess: () => {
          fetchStaff();
          if (selectedStaff && selectedStaff.id === Number(id)) {
            getStaffMember(id);
          }
        }
      }
    );
    
    return result;
  }, [api, fetchStaff, selectedStaff, getStaffMember]);
  
  const deleteStaffMember = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => staffService.delete(id),
      {
        showSuccessToast: true,
        successMessage: 'Staff member deleted successfully',
        errorPrefix: 'Failed to delete staff member',
        onSuccess: () => {
          fetchStaff();
          if (selectedStaff && selectedStaff.id === Number(id)) {
            clearSelectedStaff();
          }
        }
      }
    );
    
    return result;
  }, [api, fetchStaff, selectedStaff, clearSelectedStaff]);
  
  return {
    staff,
    selectedStaff,
    staffPayments,
    serviceRecords,
    earnings,
    isLoading: api.isLoading,
    error: api.error,
    fetchStaff,
    getStaffMember,
    clearSelectedStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    fetchStaffPayments,
    fetchServiceRecords,
    calculateEarnings,
    // Working hours functions
    workingHours,
    fetchWorkingHours,
    updateWorkingHours,
    checkAvailability
  };
}
