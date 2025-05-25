
import { useState, useCallback } from "react";
import {
  Appointment,
  AppointmentFormData,
  AppointmentStatus,
} from "@/models/appointment.model";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  completeAppointment,
} from "@/services/appointment.service";
import { toast } from "@/components/ui/use-toast";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all appointments
   */
  const fetchAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAppointments();
      setAppointments(data as Appointment[]);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch appointments"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new appointment
   */
  const createAppointmentHandler = useCallback(
    async (appointmentData: AppointmentFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        const newAppointment = await createAppointment(appointmentData);
        setAppointments((prev) => [...prev, newAppointment as Appointment]);
        toast({
          title: "Appointment created",
          description: "New appointment has been scheduled successfully",
        });
        return newAppointment;
      } catch (err) {
        console.error("Error creating appointment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to create appointment"
        );
        toast({
          variant: "destructive",
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to create appointment",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update an existing appointment
   */
  const updateAppointmentHandler = useCallback(
    async (id: number, appointmentData: Partial<AppointmentFormData>) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await updateAppointment(id, appointmentData);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id ? { ...appointment, ...updated } as Appointment : appointment
          )
        );
        toast({
          title: "Appointment updated",
          description: "Appointment has been updated successfully",
        });
        return updated;
      } catch (err) {
        console.error("Error updating appointment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to update appointment"
        );
        toast({
          variant: "destructive",
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to update appointment",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete an appointment
   */
  const deleteAppointmentHandler = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteAppointment(id);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
      toast({
        title: "Appointment deleted",
        description: "Appointment has been deleted successfully",
      });
      return true;
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError(
        err instanceof Error ? err.message : "Failed to delete appointment"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to delete appointment",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cancel an appointment
   */
  const cancelAppointmentHandler = useCallback(
    async (id: number, reason: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await cancelAppointment(id, reason);
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === id
              ? {
                  ...appointment,
                  status: "cancelled" as AppointmentStatus,
                  cancel_reason: reason,
                }
              : appointment
          )
        );
        toast({
          title: "Appointment cancelled",
          description: "Appointment has been cancelled successfully",
        });
        return updated;
      } catch (err) {
        console.error("Error cancelling appointment:", err);
        setError(
          err instanceof Error ? err.message : "Failed to cancel appointment"
        );
        toast({
          variant: "destructive",
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to cancel appointment",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Mark appointment as completed
   */
  const completeAppointmentHandler = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await completeAppointment(id);
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "completed" as AppointmentStatus }
            : appointment
        )
      );
      toast({
        title: "Appointment completed",
        description: "Appointment has been marked as completed",
      });
      return updated;
    } catch (err) {
      console.error("Error marking appointment as completed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark appointment as completed"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to mark appointment as completed",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    appointments,
    isLoading,
    error,
    fetchAppointments,
    createAppointment: createAppointmentHandler,
    updateAppointment: updateAppointmentHandler,
    deleteAppointment: deleteAppointmentHandler,
    cancelAppointment: cancelAppointmentHandler,
    completeAppointment: completeAppointmentHandler,
  };
};
