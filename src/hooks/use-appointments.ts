
import { useState, useCallback } from 'react';
import { Appointment, AppointmentStatus } from '@/models/appointment.model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAppointments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fix the toISOString issue in the appointment hook
  const formatAppointmentDate = (date: Date | string | null): string => {
    if (!date) return '';
    
    if (typeof date === 'string') {
      return date;
    }
    
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  };

  const createAppointment = useCallback(async (appointmentData: {
    appointment_date: Date | string;
    start_time: string;
    end_time: string;
    status?: AppointmentStatus;
    total?: number;
    customer_user_id?: string;
    user_id?: string;
    cancel_reason?: string;
  }) => {
    setIsLoading(true);
    try {
      // Ensure appointment_date is a string, not a Date object
      const formattedData = {
        ...appointmentData,
        appointment_date: formatAppointmentDate(appointmentData.appointment_date),
        // Convert confirmed status to scheduled if needed for database compatibility
        status: appointmentData.status === 'confirmed' ? 'scheduled' : appointmentData.status
      };
      
      const { data, error } = await supabase
        .from('appointments')
        .insert([formattedData])
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
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create appointment';
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
      // Make sure we're using a valid status for the database
      const dbStatus = status === 'confirmed' ? 'scheduled' : status;
      
      const updateData = { 
        status: dbStatus
      } as Record<string, any>;
      
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
      const formattedDate = formatAppointmentDate(newDate);

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
};
