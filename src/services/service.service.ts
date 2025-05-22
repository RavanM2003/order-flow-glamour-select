
import { Service, ServiceFormData } from '@/models/service.model';
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from './staff.service';

export const serviceService = {
  // Basic CRUD methods
  getAll: async (): Promise<Service[]> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
        
      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },
  
  getById: async (id: string | number): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      return null;
    }
  },
  
  create: async (serviceData: ServiceFormData): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  },
  
  update: async (id: string | number, serviceData: Partial<ServiceFormData>): Promise<Service | null> => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      return null;
    }
  },
  
  delete: async (id: string | number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      return true;
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      return false;
    }
  },
  
  // Additional methods used in the app
  getServices: async (): Promise<ApiResponse<Service[]>> => {
    try {
      const services = await serviceService.getAll();
      return { data: services };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
  
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    try {
      const service = await serviceService.getById(id);
      if (!service) {
        return { error: 'Service not found' };
      }
      return { data: service };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
  
  createService: async (serviceData: ServiceFormData): Promise<ApiResponse<Service>> => {
    try {
      const service = await serviceService.create(serviceData);
      if (!service) {
        return { error: 'Failed to create service' };
      }
      return { data: service };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
  
  updateService: async (id: string, serviceData: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => {
    try {
      const service = await serviceService.update(id, serviceData);
      if (!service) {
        return { error: 'Failed to update service' };
      }
      return { data: service };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
  
  deleteService: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const success = await serviceService.delete(id);
      if (!success) {
        return { error: 'Failed to delete service' };
      }
      return { data: true };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
    }
  },
  
  listServices: async (): Promise<ApiResponse<Service[]>> => {
    return serviceService.getServices();
  }
};
