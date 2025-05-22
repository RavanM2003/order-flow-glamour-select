
import { useState, useCallback } from 'react';
import { AppointmentFormData, Appointment, AppointmentStatus } from '@/models/appointment.model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useAppointments() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAppointment = useCallback(async (appointmentData: AppointmentFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Ensure we're working with a string date
      const formattedAppointmentDate = 
        typeof appointmentData.appointment_date === 'object'
          ? appointmentData.appointment_date.toISOString().split('T')[0]
          : appointmentData.appointment_date;

      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          appointment_date: formattedAppointmentDate
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Appointment created successfully"
      });

      return data as Appointment;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create appointment';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateAppointmentStatus = useCallback(async (appointmentId: number, status: AppointmentStatus, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updateData: Partial<Appointment> = { status };
      
      if (reason && status === 'cancelled') {
        updateData.cancel_reason = reason;
      }

      const { data, error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Appointment ${status} successfully`
      });

      return data as Appointment;
    } catch (err: any) {
      const errorMessage = err.message || `Failed to update appointment status to ${status}`;
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper functions to make code more readable
  const cancelAppointment = useCallback((appointmentId: number, reason: string) => {
    return updateAppointmentStatus(appointmentId, 'cancelled', reason);
  }, [updateAppointmentStatus]);

  const completeAppointment = useCallback((appointmentId: number) => {
    return updateAppointmentStatus(appointmentId, 'completed');
  }, [updateAppointmentStatus]);

  const rescheduleAppointment = useCallback(async (appointmentId: number, newDate: Date | string, newStartTime: string, newEndTime: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Format date if it's a Date object
      const formattedDate = typeof newDate === 'object' 
        ? newDate.toISOString().split('T')[0] 
        : newDate;

      const { data, error } = await supabase
        .from('appointments')
        .update({
          appointment_date: formattedDate,
          start_time: newStartTime,
          end_time: newEndTime
        })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment rescheduled successfully"
      });

      return data as Appointment;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reschedule appointment";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    completeAppointment,
    rescheduleAppointment,
    isLoading,
    error
  };
}
