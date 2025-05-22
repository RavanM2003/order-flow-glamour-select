
import { useState, useCallback } from 'react';
import { Appointment } from '@/models/appointment.model';
import { useToast } from '@/hooks/use-toast';
import { getAppointmentById, updateRecord, mapAppointment } from '@/lib/api';
import * as appointmentService from '@/services/appointment.service';

// Define the appointment types needed
type AppointmentFormData = {
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled'; // Use the values expected by the backend
  total?: number;
  user_id?: string | null;
};

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await appointmentService.getAppointments();
      // Ensure each appointment is properly mapped to the expected shape
      const mappedAppointments = response.map((apt: any) => mapAppointment(apt));
      setAppointments(mappedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const createAppointment = useCallback(async (data: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const created = await appointmentService.createAppointment(data);
      await fetchAppointments();
      toast({
        title: "Appointment created",
        description: "Your appointment has been successfully created.",
      });
      return created;
    } catch (err) {
      console.error('Error creating appointment:', err);
      setError('Failed to create appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, toast]);
  
  const updateAppointment = useCallback(async (id: number, data: Partial<AppointmentFormData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.updateAppointment(id, data);
      await fetchAppointments();
      toast({
        title: "Appointment updated",
        description: "The appointment has been successfully updated.",
      });
      return true;
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Failed to update appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, toast]);

  const deleteAppointment = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.deleteAppointment(id);
      await fetchAppointments();
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      });
      return true;
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete appointment');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, toast]);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
