
import {
  Appointment,
  AppointmentCreate,
  AppointmentUpdate,
  AppointmentStatus,
  DatabaseAppointment,
} from "@/models/appointment.model";
import { ApiService } from "./api.service";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { supabase } from "@/integrations/supabase/client";
import { withUserId } from "@/utils/withUserId";

// Convert database appointment to application appointment
const convertToAppointment = (
  dbAppointment: DatabaseAppointment
): Appointment => ({
  ...dbAppointment,
  id: dbAppointment.id.toString(),
});

// Convert application appointment to database appointment
const convertToDatabaseAppointment = (
  appointment: Appointment
): DatabaseAppointment => ({
  ...appointment,
  id: parseInt(appointment.id),
});

export class AppointmentService extends ApiService {
  constructor() {
    super();
  }

  async getAppointments(
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { data: [] }; // Return empty array instead of mock data to use real data
    }

    try {
      const { data, error } = await supabase.from("appointments").select("*");

      if (error) throw error;
      return { data: data.map(convertToAppointment) };
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return { 
        error: error instanceof Error ? error.message : "Failed to fetch appointments"
      };
    }
  }

  async getAppointmentById(
    id: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) throw error;
      return { data: convertToAppointment(data) };
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return { 
        error: error instanceof Error ? error.message : "Failed to fetch appointment"
      };
    }
  }

  async createAppointment(
    appointment: AppointmentCreate
  ): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .insert([
          {
            ...appointment,
            status: appointment.status || "scheduled",
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return { data: convertToAppointment(data) };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { 
        error: error instanceof Error ? error.message : "Failed to create appointment"
      };
    }
  }

  async updateAppointment(
    id: string,
    appointment: AppointmentUpdate
  ): Promise<ApiResponse<Appointment>> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .update({
          ...appointment,
          updated_at: new Date().toISOString(),
        })
        .eq("id", parseInt(id))
        .select()
        .single();

      if (error) throw error;
      return { data: convertToAppointment(data) };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { 
        error: error instanceof Error ? error.message : "Failed to update appointment"
      };
    }
  }

  async deleteAppointment(
    id: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", parseInt(id));

      if (error) throw error;
      return { data: undefined };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return { 
        error: error instanceof Error ? error.message : "Failed to delete appointment"
      };
    }
  }

  async confirmAppointment(
    id: string
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, { status: "scheduled" });
  }

  async rejectAppointment(
    id: string,
    reason: string
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(
      id,
      {
        status: "cancelled",
        cancel_reason: reason,
      }
    );
  }

  async completeAppointment(
    id: string
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, { status: "completed" });
  }

  // Add missing methods for compatibility with hooks
  async getAll(): Promise<ApiResponse<Appointment[]>> {
    return this.getAppointments({ usesMockData: false });
  }

  async getByCustomerId(
    customerId: string
  ): Promise<ApiResponse<Appointment[]>> {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("customer_user_id", customerId);

      if (error) throw error;
      return { data: data.map(convertToAppointment) };
    } catch (error) {
      console.error("Error fetching customer appointments:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch customer appointments",
      };
    }
  }

  async create(
    appointmentData: AppointmentCreate
  ): Promise<ApiResponse<Appointment>> {
    return this.createAppointment(appointmentData);
  }

  async update(
    id: string,
    appointmentData: AppointmentUpdate
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, appointmentData);
  }

  async markAsPaid(
    id: string
  ): Promise<ApiResponse<Appointment>> {
    // Here you would implement the logic to mark the appointment as paid
    // For now, we just return the appointment updated with a note
    return this.updateAppointment(id, { 
      notes: (appointment) => {
        const currentNotes = appointment.notes || "";
        return currentNotes + " [PAID]";
      }
    });
  }
}

export const appointmentService = new AppointmentService();
