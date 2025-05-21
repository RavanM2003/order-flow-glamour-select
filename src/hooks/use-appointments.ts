
import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './use-api';
import { appointmentService } from '@/services';
import { Appointment, AppointmentFormData, AppointmentStatus } from '@/models/appointment.model';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useAppointments() {
  const api = useApi<Appointment[]>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const fetchedRef = useRef(false);
  const fetchPromiseRef = useRef<Promise<Appointment[] | undefined> | null>(null);
  
  const fetchAppointments = useCallback(async (forceRefresh = false) => {
    // Skip fetching if we've already fetched and no force refresh is requested
    if (fetchedRef.current && !forceRefresh) return appointments;
    
    // If we already have a fetch in progress, return that promise
    if (fetchPromiseRef.current && !forceRefresh) {
      return fetchPromiseRef.current;
    }
    
    console.log('Fetching appointments...');
    
    // Try to get data from Supabase directly if service doesn't work
    try {
      // Start a new fetch and store the promise
      fetchPromiseRef.current = api.execute(
        () => appointmentService.getAll(),
        {
          showErrorToast: false, // Don't show error toast yet
          errorPrefix: 'Failed to load appointments'
        }
      ).then(async (data) => {
        if (data && data.length > 0) {
          setAppointments(data);
          fetchedRef.current = true;
          return data;
        }
        
        // If no data from service, try direct Supabase query
        console.log('Trying to fetch appointments directly from Supabase...');
        const { data: supabaseData, error } = await supabase
          .from('appointments')
          .select('*');
          
        if (error) {
          console.error('Error fetching appointments from Supabase:', error);
          toast({
            variant: "destructive",
            title: "Failed to load appointments",
            description: error.message
          });
          return [];
        }
        
        if (supabaseData && supabaseData.length > 0) {
          setAppointments(supabaseData);
          fetchedRef.current = true;
          return supabaseData;
        }
        
        // If everything fails, return empty array
        return [];
      }).catch(error => {
        console.error('Error in fetchAppointments:', error);
        toast({
          variant: "destructive",
          title: "Failed to load appointments",
          description: "Could not load appointments data"
        });
        return [];
      }).finally(() => {
        // Clear the promise reference when done
        fetchPromiseRef.current = null;
      });
      
      return fetchPromiseRef.current;
    } catch (error) {
      console.error('Unexpected error in fetchAppointments:', error);
      fetchPromiseRef.current = null;
      return [];
    }
  }, [api, appointments]);
  
  // Only fetch on component mount, not on every render
  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!fetchedRef.current && !fetchPromiseRef.current) {
      fetchAppointments();
    }
    // We intentionally omit fetchAppointments from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
          fetchAppointments(true);
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
          fetchAppointments(true);
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  const confirmAppointment = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => appointmentService.confirmAppointment(id),
      {
        showSuccessToast: true,
        successMessage: 'Appointment confirmed successfully',
        errorPrefix: 'Failed to confirm appointment',
        onSuccess: () => {
          fetchAppointments(true);
          // Create a cash entry for this appointment - this would typically be done by the backend
          toast({
            title: "Payment Pending",
            description: "A pending payment was created for this appointment",
          });
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  const rejectAppointment = useCallback(async (id: number | string, reason: string) => {
    const result = await api.execute(
      () => appointmentService.rejectAppointment(id, reason),
      {
        showSuccessToast: true,
        successMessage: 'Appointment rejected',
        errorPrefix: 'Failed to reject appointment',
        onSuccess: () => {
          fetchAppointments(true);
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  const completeAppointment = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => appointmentService.completeAppointment(id),
      {
        showSuccessToast: true,
        successMessage: 'Appointment marked as completed',
        errorPrefix: 'Failed to complete appointment',
        onSuccess: () => {
          fetchAppointments(true);
        }
      }
    );
    
    return result;
  }, [api, fetchAppointments]);
  
  const markAsPaid = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => appointmentService.markAsPaid(id),
      {
        showSuccessToast: true,
        successMessage: 'Appointment marked as paid',
        errorPrefix: 'Failed to mark appointment as paid',
        onSuccess: () => {
          fetchAppointments(true);
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
    updateAppointment,
    confirmAppointment,
    rejectAppointment,
    completeAppointment,
    markAsPaid
  };
}
