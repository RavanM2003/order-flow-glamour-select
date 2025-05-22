
import { useState, useCallback } from 'react';
import { Appointment, AppointmentFormData, AppointmentStatus } from '@/models/appointment.model';
import { useToast } from '@/hooks/use-toast';
import * as appointmentService from '@/services/appointment.service';

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
      setAppointments(response || []);
      return response;
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.message || 'Failed to fetch appointments');
      return [];
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
    } catch (err: any) {
      console.error('Error creating appointment:', err);
      setError(err.message || 'Failed to create appointment');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create appointment."
      });
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
    } catch (err: any) {
      console.error('Error updating appointment:', err);
      setError(err.message || 'Failed to update appointment');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment."
      });
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
    } catch (err: any) {
      console.error('Error deleting appointment:', err);
      setError(err.message || 'Failed to delete appointment');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete appointment."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, toast]);

  const cancelAppointment = useCallback(async (id: number, reason: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.cancelAppointment(id, reason);
      await fetchAppointments();
      toast({
        title: "Appointment cancelled",
        description: "The appointment has been successfully cancelled.",
      });
      return true;
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      setError(err.message || 'Failed to cancel appointment');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel appointment."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAppointments, toast]);

  const completeAppointment = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.completeAppointment(id);
      await fetchAppointments();
      toast({
        title: "Appointment completed",
        description: "The appointment has been marked as completed.",
      });
      return true;
    } catch (err: any) {
      console.error('Error completing appointment:', err);
      setError(err.message || 'Failed to complete appointment');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark appointment as completed."
      });
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
    cancelAppointment,
    completeAppointment,
  };
}
