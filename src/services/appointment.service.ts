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

// Mock data for development
const mockAppointment: Appointment = {
  id: "1",
  customer_user_id: "1",
  start_time: "2024-02-20T10:00:00",
  end_time: "2024-02-20T11:00:00",
  notes: "Test appointment",
  status: "scheduled",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  appointment_date: "2024-02-20",
};

const mockAppointments: Appointment[] = [
  {
    id: "1",
    customer_user_id: "1",
    start_time: "2024-02-20T10:00:00",
    end_time: "2024-02-20T11:00:00",
    notes: "Test appointment 1",
    status: "scheduled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    appointment_date: "2024-02-20",
  },
  {
    id: "2",
    customer_user_id: "2",
    start_time: "2024-02-20T14:00:00",
    end_time: "2024-02-20T15:00:00",
    notes: "Test appointment 2",
    status: "scheduled",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    appointment_date: "2024-02-20",
  },
];

export class AppointmentService extends ApiService {
  constructor() {
    super();
  }

  async getAppointments(
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { data: mockAppointments };
    }

    const { data, error } = await supabase.from("appointments").select("*");

    if (error) throw error;
    return { data: data.map(convertToAppointment) };
  }

  async getAppointmentById(
    id: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: mockAppointment };
    }

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error) throw error;
    return { data: convertToAppointment(data) };
  }

  async createAppointment(
    appointment: AppointmentCreate,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        data: {
          ...mockAppointment,
          ...appointment,
          id: (mockAppointments.length + 1).toString(),
          status: appointment.status || "scheduled",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

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
  }

  async updateAppointment(
    id: string,
    appointment: AppointmentUpdate,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        data: {
          ...mockAppointment,
          ...appointment,
          id,
          updated_at: new Date().toISOString(),
        },
      };
    }

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
  }

  async deleteAppointment(
    id: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<void>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: undefined };
    }

    const { error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", parseInt(id));

    if (error) throw error;
    return { data: undefined };
  }

  async confirmAppointment(
    id: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, { status: "scheduled" }, config);
  }

  async rejectAppointment(
    id: string,
    reason: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(
      id,
      {
        status: "cancelled",
        cancel_reason: reason,
      },
      config
    );
  }

  async completeAppointment(
    id: string,
    config: { usesMockData?: boolean } = {}
  ): Promise<ApiResponse<Appointment>> {
    return this.updateAppointment(id, { status: "completed" }, config);
  }

  async getAll(): Promise<ApiResponse<Appointment[]>> {
    return this.getAppointments();
  }

  async getByCustomerId(
    customerId: string
  ): Promise<ApiResponse<Appointment[]>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAppointments: Appointment[] = [
        {
          id: "1",
          customer_user_id: customerId,
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          notes: "Mock appointment 1",
          status: "scheduled" as AppointmentStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          appointment_date: new Date().toISOString(),
        },
      ];

      return { data: mockAppointments };
    }

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
}

export const appointmentService = new AppointmentService();
