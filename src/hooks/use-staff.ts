import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { staffService } from '@/services';
import { Staff, StaffPayment, StaffServiceRecord, StaffFormData } from '@/models/staff.model';

export function useStaff() {
  const api = useApi<Staff[]>();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [serviceRecords, setServiceRecords] = useState<StaffServiceRecord[]>([]);
  const [earnings, setEarnings] = useState<{
    salary: number;
    commission: number;
    expenses: number;
    total: number;
  } | null>(null);
  
  const fetchStaff = useCallback(async () => {
    const data = await api.execute(
      () => staffService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load staff'
      }
    );
    
    if (data) {
      setStaff(data);
    }
  }, [api]);
  
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);
  
  const getStaffMember = useCallback(async (id: number | string) => {
    const response = await staffService.getById(id);
    if (response.data) {
      setSelectedStaff(response.data);
    }
    return response.data;
  }, []);
  
  const clearSelectedStaff = useCallback(() => {
    setSelectedStaff(null);
    setStaffPayments([]);
    setServiceRecords([]);
    setEarnings(null);
  }, []);
  
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
  
  const updateStaffMember = useCallback(async (id: number | string, data: Partial<Staff>) => {
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
  
  const fetchStaffPayments = useCallback(async (staffId: number | string) => {
    const response = await staffService.getPayments(staffId);
    if (response.data) {
      setStaffPayments(response.data);
    }
    return response.data;
  }, []);
  
  const fetchServiceRecords = useCallback(async (staffId: number | string) => {
    const response = await staffService.getServiceRecords(staffId);
    if (response.data) {
      setServiceRecords(response.data);
    }
    return response.data;
  }, []);
  
  const calculateEarnings = useCallback(async (
    staffId: number | string, 
    month: number, 
    year: number
  ) => {
    const response = await staffService.calculateEarnings(staffId, month, year);
    if (response.data) {
      setEarnings(response.data);
    }
    return response.data;
  }, []);
  
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
    calculateEarnings
  };
}
