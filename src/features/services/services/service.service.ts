
import { ApiService } from '@/services/api.service';
import { Service, ServiceFormData } from '../types';
import { ApiResponse } from '@/models/types';
import { supabase } from '@/integrations/supabase/client';

export class ServiceService extends ApiService {
  async getAll(): Promise<ApiResponse<Service[]>> {
    try {
      // Try using direct Supabase query instead of API call
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      
      // Map the response to match our Service interface
      const services = data.map(item => ({
        ...item,
        relatedProducts: [] // Initialize as empty array since we're not fetching them yet
      }));
      
      return { data: services as Service[] };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch services' };
    }
  }
  
  async getById(id: number): Promise<ApiResponse<Service>> {
    try {
      // Try using direct Supabase query
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_products!inner(product_id)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Get related products if any
      const relatedProducts = data.service_products 
        ? data.service_products.map((sp: any) => sp.product_id)
        : [];
      
      // Clean up the data to match our Service interface
      const service = {
        ...data,
        relatedProducts,
        // Remove properties that don't match our interface
        service_products: undefined
      };
      
      return { data: service as Service };
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      return { error: error instanceof Error ? error.message : `Failed to fetch service ${id}` };
    }
  }

  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    try {
      // Insert the service
      const { data: newService, error } = await supabase
        .from('services')
        .insert({
          name: data.name,
          description: data.description,
          duration: Number(data.duration),
          price: data.price,
          benefits: data.benefits || []
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert related products if any
      if (data.relatedProducts && data.relatedProducts.length > 0) {
        const serviceProducts = data.relatedProducts.map(productId => ({
          service_id: newService.id,
          product_id: productId
        }));
        
        const { error: productsError } = await supabase
          .from('service_products')
          .insert(serviceProducts);
        
        if (productsError) throw productsError;
      }
      
      // Return the created service with additional fields
      return { 
        data: { 
          ...newService,
          relatedProducts: data.relatedProducts || []
        } as Service 
      };
    } catch (error) {
      console.error('Error creating service:', error);
      return { error: error instanceof Error ? error.message : 'Failed to create service' };
    }
  }
  
  async update(id: number, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    try {
      // Ensure name is present for update
      if (data.name === undefined) {
        return { error: 'Name is required for service update' };
      }
      
      // Update the service
      const { data: updatedService, error } = await supabase
        .from('services')
        .update({
          name: data.name,
          description: data.description,
          duration: data.duration !== undefined ? Number(data.duration) : undefined,
          price: data.price,
          benefits: data.benefits
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update related products if needed
      if (data.relatedProducts) {
        // First delete all existing relations
        const { error: deleteError } = await supabase
          .from('service_products')
          .delete()
          .eq('service_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then insert new relations
        if (data.relatedProducts.length > 0) {
          const serviceProducts = data.relatedProducts.map(productId => ({
            service_id: id,
            product_id: productId
          }));
          
          const { error: productsError } = await supabase
            .from('service_products')
            .insert(serviceProducts);
          
          if (productsError) throw productsError;
        }
      }
      
      // Return the updated service
      return { 
        data: { 
          ...updatedService,
          relatedProducts: data.relatedProducts || []
        } as Service 
      };
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      return { error: error instanceof Error ? error.message : `Failed to update service ${id}` };
    }
  }
  
  async delete(id: number): Promise<ApiResponse<boolean>> {
    try {
      // Delete the service
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      return { error: error instanceof Error ? error.message : `Failed to delete service ${id}` };
    }
  }
}

export const serviceService = new ServiceService();
