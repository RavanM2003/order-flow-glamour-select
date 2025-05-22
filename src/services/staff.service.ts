
import { supabase } from '@/integrations/supabase/client';
import { Staff, StaffFormData } from '@/models/staff.model';

/**
 * Get all staff members
 */
export async function getStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*, users(*)');

  if (error) throw error;
  
  // Process the data to create a unified staff object with user details
  const processedData = data?.map(staff => {
    return {
      ...staff,
      ...staff.users,
      users: undefined  // Remove the nested 'users' property
    };
  });
  
  return processedData || [];
}

/**
 * Get staff by ID
 */
export async function getStaffById(id: number | string) {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { data, error } = await supabase
    .from('staff')
    .select('*, users(*)')
    .eq('id', numericId)
    .single();

  if (error) throw error;
  
  // Process the data to create a unified staff object with user details
  if (data) {
    return {
      ...data,
      ...data.users,
      users: undefined  // Remove the nested 'users' property
    };
  }
  
  return null;
}

/**
 * Get staff by user ID
 */
export async function getStaffByUserId(userId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('*, users(*)')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  
  // Process the data to create a unified staff object with user details
  if (data) {
    return {
      ...data,
      ...data.users,
      users: undefined  // Remove the nested 'users' property
    };
  }
  
  return null;
}

/**
 * Create a new staff member
 */
export async function createStaff(staffData: StaffFormData) {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      user_id: staffData.user_id,
      position: staffData.position,
      specializations: staffData.specializations
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing staff member
 */
export async function updateStaff(id: number | string, staffData: Partial<Staff>) {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { data, error } = await supabase
    .from('staff')
    .update({
      position: staffData.position,
      specializations: staffData.specializations,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update staff availability
 */
export async function updateStaffAvailability(staffId: number | string, userId: string, availabilityData: any[]) {
  // Convert string to number if needed
  const numericId = typeof staffId === 'string' 
    ? parseInt(staffId, 10) 
    : staffId;
  
  // Delete existing availability entries for this staff member
  const { error: deleteError } = await supabase
    .from('staff_availability')
    .delete()
    .eq('staff_user_id', userId);

  if (deleteError) throw deleteError;

  // Insert new availability entries
  if (availabilityData && availabilityData.length > 0) {
    const formattedData = availabilityData.map(item => ({
      staff_user_id: userId,
      weekday: item.weekday,
      start_time: item.start_time,
      end_time: item.end_time
    }));

    const { data, error } = await supabase
      .from('staff_availability')
      .insert(formattedData)
      .select();

    if (error) throw error;
    return data;
  }

  return [];
}

/**
 * Get staff availability by user ID
 */
export async function getStaffAvailability(userId: string) {
  const { data, error } = await supabase
    .from('staff_availability')
    .select('*')
    .eq('staff_user_id', userId);

  if (error) throw error;
  return data || [];
}

/**
 * Delete a staff member by ID
 */
export async function deleteStaff(id: number | string) {
  // Convert string to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  // First, get the user ID associated with this staff
  const { data: staffData, error: staffError } = await supabase
    .from('staff')
    .select('user_id')
    .eq('id', numericId)
    .single();

  if (staffError) throw staffError;

  if (staffData && staffData.user_id) {
    // Delete staff record
    const { error: deleteStaffError } = await supabase
      .from('staff')
      .delete()
      .eq('id', numericId);

    if (deleteStaffError) throw deleteStaffError;

    // Also delete the user (this is optional and depends on your business logic)
    // You might want to just update the user's role instead of deleting them
    /*
    const { error: deleteUserError } = await supabase
      .from('users')
      .delete()
      .eq('id', staffData.user_id);

    if (deleteUserError) throw deleteUserError;
    */

    return true;
  }

  return false;
}
