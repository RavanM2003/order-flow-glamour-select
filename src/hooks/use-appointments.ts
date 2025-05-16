
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { appointmentService } from '@/services';
import { Appointment, AppointmentFormData } from '@/models/appointment.model';

export function useAppointments() {
  const api = useApi<Appointment[]>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const fetchAppointments = useCallback(async () => {
    const data = await api.execute(
      () => appointmentService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load appointments'
      }
    );
    
    if (data) {
      setAppointments(data);
    }
  }, [api]);
  
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  
  const getAppointmentsByCustomer = useCallback(async (customerId: number | string) => {
    const response = await appointmentService.getByCustomerId(customerId);
    return response.data || [];
  }, []);
  
  const createAppointment = useCallback(async (data: AppointmentFormData) => {
    const result = await api.execute(
      () => appointmentService.create(data),
      {
        showSuccessToast: true,
        successMessage: 'Appointment created successfully',
        errorPrefix: 'Failed to create appointment',
        onSuccess: () => {
          fetchAppointments();
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  const updateAppointment = useCallback(async (id: number | string, data: Partial<AppointmentFormData>) => {
    const result = await api.execute(
      () => appointmentService.update(id, data),
      {
        showSuccessToast: true,
        successMessage: 'Appointment updated successfully',
        errorPrefix: 'Failed to update appointment',
        onSuccess: () => {
          fetchAppointments();
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  return {
    appointments,
    isLoading: api.isLoading,
    error: api.error,
    fetchAppointments,
    getAppointmentsByCustomer,
    createAppointment,
    updateAppointment
  };
}
