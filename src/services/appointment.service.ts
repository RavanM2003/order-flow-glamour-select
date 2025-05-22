import { Appointment, AppointmentCreate, AppointmentUpdate } from "@/models/appointment.model";
import { ApiService } from "./api.service";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { supabase } from "@/integrations/supabase/client";
import { withUserId } from "@/utils/withUserId";

export class AppointmentService extends ApiService {
  constructor() {
    super();
  }

  async createAppointment(appointmentData: AppointmentCreate): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockAppointment: Appointment = {
        id: String(Math.floor(Math.random() * 1000)),
        customer_user_id: appointmentData.customer_user_id,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        notes: appointmentData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return { data: mockAppointment, message: "Mock appointment created successfully" };
    }

    try {
      // Add the current user_id to the appointment data
      const appointmentWithUserId = withUserId(appointmentData);
      
      const { data, error } = await supabase
        .from("appointments")
        .insert([appointmentWithUserId])
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Appointment,
        message: "Görüş uğurla yaradıldı" 
      };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create appointment",
      };
    }
  }

  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const mockAppointments: Appointment[] = [
        {
          id: "1",
          customer_user_id: "101",
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          notes: "Mock appointment 1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "2",
          customer_user_id: "102",
          start_time: new Date(Date.now() + 7200000).toISOString(),
          end_time: new Date(Date.now() + 10800000).toISOString(),
          notes: "Mock appointment 2",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      
      return { data: mockAppointments };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*");

      if (error) throw error;

      return { data: data as Appointment[] };
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to fetch appointments",
      };
    }
  }

  async getAppointmentById(id: string): Promise<ApiResponse<Appointment | null>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockAppointment: Appointment = {
        id: id,
        customer_user_id: "101",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString(),
        notes: "Mock appointment",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return { data: mockAppointment };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return { data: data as Appointment };
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to fetch appointment",
      };
    }
  }

  async updateAppointment(id: string, appointmentData: AppointmentUpdate): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      const mockAppointment: Appointment = {
        id: id,
        customer_user_id: appointmentData.customer_user_id || "101",
        start_time: appointmentData.start_time || new Date().toISOString(),
        end_time: appointmentData.end_time || new Date(Date.now() + 3600000).toISOString(),
        notes: appointmentData.notes || "Updated mock appointment",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return { data: mockAppointment, message: "Mock appointment updated successfully" };
    }

    try {
      const { data, error } = await supabase
        .from("appointments")
        .update(appointmentData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Appointment, message: "Appointment updated successfully" };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to update appointment",
      };
    }
  }

  async deleteAppointment(id: string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { data: true, message: "Mock appointment deleted successfully" };
    }

    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { data: true, message: "Appointment deleted successfully" };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to delete appointment",
      };
    }
  }
}

export const appointmentService = new AppointmentService();
