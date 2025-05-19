
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { serviceService } from '@/services';
import { Service, ServiceFormData } from '@/models/service.model';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useServices() {
  const api = useApi<Service[]>();
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast();
  
  const fetchServices = useCallback(async () => {
    try {
      // First try using the service abstraction
      const data = await api.execute(
        () => serviceService.getAll(),
        {
          showErrorToast: false, // We'll handle errors ourselves
        }
      );
      
      if (data && data.length > 0) {
        setServices(data);
        return;
      }
      
      // If that fails or returns empty, try direct Supabase query
      console.log('Fetching services directly from Supabase...');
      const { data: supabaseData, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) {
        console.error('Error fetching services from Supabase:', error);
        toast({
          variant: "destructive",
          title: "Xidmətlər yüklənmədi",
          description: error.message
        });
        return;
      }
      
      if (supabaseData && supabaseData.length > 0) {
        const formattedData = supabaseData.map(item => ({
          ...item,
          duration: typeof item.duration === 'string' ? parseInt(item.duration, 10) : item.duration
        })) as Service[];
        
        setServices(formattedData);
        console.log('Services loaded directly from Supabase:', formattedData.length);
      } else {
        console.log('No services found in Supabase');
      }
    } catch (error) {
      console.error('Error in fetchServices:', error);
      toast({
        variant: "destructive",
        title: "Xidmətlər yüklənmədi",
        description: "Xidmətlər yüklənərkən xəta baş verdi."
      });
    }
  }, [api, toast]);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const getService = useCallback(async (id: number | string) => {
    try {
      // First try using the service abstraction
      const response = await serviceService.getById(id);
      
      if (response.data) {
        return response.data;
      }
      
      // If that fails, try direct Supabase query
      console.log(`Fetching service ${id} directly from Supabase...`);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching service ${id} from Supabase:`, error);
        throw new Error(error.message);
      }
      
      if (data) {
        // Ensure duration is a number
        return {
          ...data,
          duration: typeof data.duration === 'string' ? parseInt(data.duration, 10) : data.duration
        } as Service;
      }
      
      throw new Error(`Service with ID ${id} not found`);
    } catch (error) {
      console.error(`Error in getService(${id}):`, error);
      throw error;
    }
  }, []);

  const createService = useCallback(async (data: ServiceFormData) => {
    try {
      // Try using the service abstraction first
      const result = await api.execute(
        () => serviceService.create(data),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət uğurla yaradıldı',
          errorPrefix: 'Xidmət yaradıla bilmədi',
          onSuccess: () => {
            fetchServices();
          }
        }
      );
      
      if (result) {
        return result;
      }
      
      // If that fails, try direct Supabase insert
      console.log('Creating service directly in Supabase...');
      const { data: createdData, error } = await supabase
        .from('services')
        .insert({
          name: data.name,
          description: data.description || null,
          price: data.price,
          duration: data.duration,
          image_urls: data.image_urls || null,
          is_active: true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating service in Supabase:', error);
        toast({
          variant: "destructive",
          title: "Xidmət yaradıla bilmədi",
          description: error.message
        });
        throw new Error(error.message);
      }
      
      if (createdData) {
        toast({
          title: "Xidmət yaradıldı", 
          description: "Xidmət uğurla yaradıldı"
        });
        
        fetchServices();
        
        return {
          ...createdData,
          duration: typeof createdData.duration === 'string' ? parseInt(createdData.duration, 10) : createdData.duration
        } as Service;
      }
      
      throw new Error('Service creation failed');
    } catch (error) {
      console.error('Error in createService:', error);
      throw error;
    }
  }, [api, fetchServices, toast]);
  
  const updateService = useCallback(async (id: number | string, data: Partial<ServiceFormData>) => {
    try {
      // Try using the service abstraction first
      const result = await api.execute(
        () => serviceService.update(id, data),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət yeniləndi',
          errorPrefix: 'Xidmət yenilənə bilmədi',
          onSuccess: () => {
            fetchServices();
          }
        }
      );
      
      if (result) {
        return result;
      }
      
      // If that fails, try direct Supabase update
      console.log(`Updating service ${id} directly in Supabase...`);
      const { data: updatedData, error } = await supabase
        .from('services')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          duration: data.duration,
          image_urls: data.image_urls
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating service ${id} in Supabase:`, error);
        toast({
          variant: "destructive",
          title: "Xidmət yenilənə bilmədi",
          description: error.message
        });
        throw new Error(error.message);
      }
      
      if (updatedData) {
        toast({
          title: "Xidmət yeniləndi", 
          description: "Xidmət uğurla yeniləndi"
        });
        
        fetchServices();
        
        return {
          ...updatedData,
          duration: typeof updatedData.duration === 'string' ? parseInt(updatedData.duration, 10) : updatedData.duration
        } as Service;
      }
      
      throw new Error('Service update failed');
    } catch (error) {
      console.error(`Error in updateService(${id}):`, error);
      throw error;
    }
  }, [api, fetchServices, toast]);
  
  const deleteService = useCallback(async (id: number | string) => {
    try {
      // Try using the service abstraction first
      const result = await api.execute(
        () => serviceService.delete(id),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət silindi',
          errorPrefix: 'Xidmət silinə bilmədi',
          onSuccess: () => {
            fetchServices();
          }
        }
      );
      
      if (result) {
        return result;
      }
      
      // If that fails, try direct Supabase delete
      console.log(`Deleting service ${id} directly from Supabase...`);
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting service ${id} from Supabase:`, error);
        toast({
          variant: "destructive",
          title: "Xidmət silinə bilmədi",
          description: error.message
        });
        throw new Error(error.message);
      }
      
      toast({
        title: "Xidmət silindi", 
        description: "Xidmət uğurla silindi"
      });
      
      fetchServices();
      
      return true;
    } catch (error) {
      console.error(`Error in deleteService(${id}):`, error);
      throw error;
    }
  }, [api, fetchServices, toast]);
  
  return {
    services,
    isLoading: api.isLoading,
    error: api.error,
    fetchServices,
    getService,
    createService,
    updateService,
    deleteService
  };
}
