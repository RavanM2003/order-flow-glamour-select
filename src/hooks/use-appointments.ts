
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { appointmentService } from "@/services";
import { useToast } from "@/hooks/use-toast";
import { 
  Appointment, 
  AppointmentStatus, 
  AppointmentFormData, 
  AppointmentCreate,
  DatabaseAppointment
} from "@/models/appointment.model";

// Fixed function that transforms database appointment to application appointment
const transformAppointment = (
  dbAppointment: DatabaseAppointment
): Appointment => {
  return {
    id: dbAppointment.id.toString(),
    customer_user_id: dbAppointment.customer_user_id,
    start_time: dbAppointment.start_time,
    end_time: dbAppointment.end_time,
    status: dbAppointment.status,
    notes: dbAppointment.notes,
    total: dbAppointment.total,
    created_at: dbAppointment.created_at,
    updated_at: dbAppointment.updated_at,
    is_no_show: dbAppointment.is_no_show || false,
    cancel_reason: dbAppointment.cancel_reason,
    appointment_date: dbAppointment.appointment_date,
    user_id: dbAppointment.user_id
  };
};

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  const { toast } = useToast();

  const fetchAppointments = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && appointments.length > 0) return appointments;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await appointmentService.getAll();
      if (response.data) {
        setAppointments(response.data);
        return response.data;
      } else if (response.error) {
        setError(response.error);
      }
      return [];
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error("Error fetching appointments:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [appointments.length]);

  const getAppointmentsByCustomer = useCallback(
    async (customerId: number | string) => {
      const id = typeof customerId === 'number' ? customerId.toString() : customerId;
      try {
        const response = await appointmentService.getByCustomerId(id);
        return response.data || [];
      } catch (error) {
        console.error(`Error fetching customer appointments: ${error}`);
        return [];
      }
    },
    []
  );

  const createAppointment = useCallback(
    async (data: AppointmentFormData) => {
      // Convert AppointmentFormData to AppointmentCreate
      const appointmentData: AppointmentCreate = {
        customer_user_id: typeof data.customerId === 'number' ? data.customerId.toString() : data.customerId,
        start_time: data.startTime || data.start_time || '',
        end_time: data.endTime || data.end_time || '',
        appointment_date: data.date || data.appointment_date || '',
        status: data.status || 'scheduled',
        notes: data.notes,
        total: data.totalAmount
      };

      try {
        const response = await appointmentService.create(appointmentData);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Appointment created successfully",
            description: "Your appointment has been booked",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create appointment");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to create appointment",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  const updateAppointment = useCallback(
    async (id: number | string, data: Partial<AppointmentFormData>) => {
      const appointmentId = typeof id === 'number' ? id.toString() : id;
      
      try {
        const response = await appointmentService.update(appointmentId, data);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Appointment updated successfully",
            description: "The appointment details have been updated",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to update appointment");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to update appointment",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  const confirmAppointment = useCallback(
    async (id: number | string) => {
      const appointmentId = typeof id === 'number' ? id.toString() : id;
      
      try {
        const response = await appointmentService.confirmAppointment(appointmentId);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Appointment confirmed",
            description: "The appointment has been confirmed",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to confirm appointment");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to confirm appointment",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  const rejectAppointment = useCallback(
    async (id: number | string, reason: string) => {
      const appointmentId = typeof id === 'number' ? id.toString() : id;
      
      try {
        const response = await appointmentService.rejectAppointment(appointmentId, reason);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Appointment rejected",
            description: "The appointment has been rejected",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to reject appointment");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to reject appointment",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  const completeAppointment = useCallback(
    async (id: number | string) => {
      const appointmentId = typeof id === 'number' ? id.toString() : id;
      
      try {
        const response = await appointmentService.completeAppointment(appointmentId);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Appointment completed",
            description: "The appointment has been marked as completed",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to complete appointment");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to complete appointment",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  const markAsPaid = useCallback(
    async (id: number | string) => {
      const appointmentId = typeof id === 'number' ? id.toString() : id;
      
      try {
        const response = await appointmentService.markAsPaid(appointmentId);
        if (response.data) {
          await fetchAppointments(true);
          toast({
            title: "Payment recorded",
            description: "The appointment has been marked as paid",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to mark appointment as paid");
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        toast({
          variant: "destructive",
          title: "Failed to mark appointment as paid",
          description: errorMsg,
        });
        return null;
      }
    },
    [fetchAppointments, toast]
  );

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    getAppointmentsByCustomer,
    createAppointment,
    updateAppointment,
    confirmAppointment,
    rejectAppointment,
    completeAppointment,
    markAsPaid
  };
};
