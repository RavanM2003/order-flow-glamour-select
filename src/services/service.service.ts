
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceFormData } from '@/models/service.model';

/**
 * Get all services
 */
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*');

  if (error) throw error;
  return data || [];
}

/**
 * Get services by category ID
 */
export async function getServicesByCategory(categoryId: number | string) {
  // Convert string to number if needed
  const numericId = typeof categoryId === 'string' 
    ? parseInt(categoryId, 10) 
    : categoryId;

  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', numericId);

  if (error) throw error;
  return data || [];
}

/**
 * Get service by ID
 */
export async function getServiceById(serviceId: number | string) {
  // Convert string to number if needed
  const numericId = typeof serviceId === 'string' 
    ? parseInt(serviceId, 10) 
    : serviceId;
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new service
 */
export async function createService(serviceData: ServiceFormData) {
  // Convert category_id to number if it's a string
  const categoryId = serviceData.category_id && typeof serviceData.category_id === 'string'
    ? parseInt(serviceData.category_id, 10)
    : serviceData.category_id;

  const { data, error } = await supabase
    .from('services')
    .insert({
      ...serviceData,
      category_id: categoryId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update an existing service
 */
export async function updateService(id: number | string, serviceData: Partial<Service>) {
  // Convert id to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  // Convert category_id to number if it's a string
  const categoryId = serviceData.category_id && typeof serviceData.category_id === 'string'
    ? parseInt(serviceData.category_id, 10)
    : serviceData.category_id;

  const { data, error } = await supabase
    .from('services')
    .update({
      ...serviceData,
      category_id: categoryId,
      updated_at: new Date().toISOString()
    })
    .eq('id', numericId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a service by ID
 */
export async function deleteService(id: number | string) {
  // Convert id to number if needed
  const numericId = typeof id === 'string' 
    ? parseInt(id, 10) 
    : id;
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', numericId);

  if (error) throw error;
  return true;
}

/**
 * Get featured services (limited number of services for display)
 */
export async function getFeaturedServices(limit: number = 6) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(limit);

  if (error) throw error;
  return data || [];
}
