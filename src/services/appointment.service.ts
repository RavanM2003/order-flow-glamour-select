
import { supabase } from '@/integrations/supabase/client';
import { AppointmentFormData, AppointmentStatus } from '@/models/appointment.model';

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
  // Ensure id is a number
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new appointment
 */
export async function createAppointment(appointmentData: AppointmentFormData) {
  // Convert the appointment data to match the database schema
  const appointmentRecord = {
    appointment_date: appointmentData.appointment_date,
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    status: appointmentData.status,
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
export async function updateAppointment(id: number, appointmentData: Partial<AppointmentFormData>) {
  // Ensure id is a number
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Ensure status is one of the allowed values
  if (appointmentData.status && 
      !['scheduled', 'completed', 'cancelled'].includes(appointmentData.status)) {
    throw new Error('Invalid appointment status');
  }
  
  const { data, error } = await supabase
    .from('appointments')
    .update({
      ...appointmentData,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
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
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', numericId);

  if (error) throw error;
  return true;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(id: number, reason: string) {
  // Ensure id is a number
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled' as AppointmentStatus,
      cancel_reason: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
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
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'completed' as AppointmentStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
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
