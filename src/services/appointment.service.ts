
import { supabase } from '@/integrations/supabase/client';

// Define the appointment types using the actual database enum values
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

interface AppointmentData {
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total?: number;
  customer_user_id: string;
  user_id?: string | null;
}

/**
 * Get all appointments
 */
export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*');

  if (error) throw error;
  return data || [];
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(id: number) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointmentData: AppointmentData) {
  // Convert the appointment data to match the database schema
  const appointmentRecord = {
    appointment_date: appointmentData.appointment_date,
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    status: appointmentData.status, // This should be one of the allowed enum values
    total: appointmentData.total,
    customer_user_id: appointmentData.customer_user_id,
    user_id: appointmentData.user_id
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentRecord)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(id: number, appointmentData: Partial<AppointmentData>) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      ...appointmentData,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete an appointment by ID
 */
export async function deleteAppointment(id: number) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(id: number, reason: string) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      cancel_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Mark appointment as completed
 */
export async function completeAppointment(id: number) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
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
    .from('appointments')
    .select('*')
    .eq('customer_user_id', customerId);

  if (error) throw error;
  return data || [];
}

/**
 * Get appointments for a specific staff member
 */
export async function getStaffAppointments(staffId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', staffId);

  if (error) throw error;
  return data || [];
}
