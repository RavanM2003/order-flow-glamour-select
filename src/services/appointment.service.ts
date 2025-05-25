
import { supabase } from "@/integrations/supabase/client";
import {
  AppointmentFormData,
  AppointmentStatus,
} from "@/models/appointment.model";

/**
 * Get all appointments
 */
export async function getAppointments() {
  const { data, error } = await supabase.from("appointments").select("*");

  if (error) throw error;
  return data || [];
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(id: number) {
  // Ensure id is a number
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", numericId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointmentData: AppointmentFormData) {
  // Convert the appointment date to a string if it's a Date object
  const appointmentDate =
    typeof appointmentData.appointment_date === "string"
      ? appointmentData.appointment_date
      : appointmentData.appointment_date.toISOString().split("T")[0];

  // Ensure status is a valid enum value for database compatibility
  const status = appointmentData.status || "pending";

  // Create appointment record with proper typing
  const appointmentRecord = {
    appointment_date: appointmentDate,
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    status: status as AppointmentStatus,
    total: appointmentData.total || 0,
    customer_user_id: appointmentData.customer_user_id,
    user_id: appointmentData.user_id || "",
    cancel_reason: appointmentData.cancel_reason,
    notes: appointmentData.notes, // Add notes field
  };

  const { data, error } = await supabase
    .from("appointments")
    .insert(appointmentRecord)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  id: number,
  appointmentData: Partial<AppointmentFormData>
) {
  // Ensure id is a number
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  // Convert date if it's a Date object
  let appointmentDate = appointmentData.appointment_date;
  if (appointmentDate && appointmentDate instanceof Date) {
    appointmentDate = appointmentDate.toISOString().split("T")[0];
  }

  // Prepare update data with proper type handling
  const updateData = {
    ...appointmentData,
    appointment_date: appointmentDate as string,
    updated_at: new Date().toISOString(),
  } as {
    appointment_date?: string;
    start_time?: string;
    end_time?: string;
    status?: AppointmentStatus;
    total?: number;
    customer_user_id?: string;
    user_id?: string;
    cancel_reason?: string;
    is_no_show?: boolean;
    updated_at: string;
  };

  // If status is included, ensure it's compatible with the database
  if (updateData.status) {
    const status = updateData.status as AppointmentStatus;
    if (status === "no_show") {
      updateData.is_no_show = true;
      updateData.status = "cancelled";
    }
  }

  const { data, error } = await supabase
    .from("appointments")
    .update(updateData)
    .eq("id", numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete an appointment by ID
 */
export async function deleteAppointment(id: number) {
  // Ensure id is a number
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", numericId);

  if (error) throw error;
  return true;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(id: number, reason: string) {
  // Ensure id is a number
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { data, error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled" as AppointmentStatus,
      cancel_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark appointment as completed
 */
export async function completeAppointment(id: number) {
  // Ensure id is a number
  const numericId = typeof id === "string" ? parseInt(id, 10) : id;

  const { data, error } = await supabase
    .from("appointments")
    .update({
      status: "completed" as AppointmentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get appointments for a specific customer
 */
export async function getCustomerAppointments(customerId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("customer_user_id", customerId);

  if (error) throw error;
  return data || [];
}

/**
 * Get appointments for a specific staff member
 */
export async function getStaffAppointments(staffId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", staffId);

  if (error) throw error;
  return data || [];
}
