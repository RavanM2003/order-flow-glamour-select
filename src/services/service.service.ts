
import { ApiService } from './api.service';
import { Service, ServiceFormData } from '@/models/service.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockServices } from '@/lib/mock-data';

export class ServiceService extends ApiService {
  // Get all services
  async getAll(): Promise<ApiResponse<Service[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // Fix: Ensure duration is converted to number
      const services = mockServices.map(s => ({
        ...s,
        duration: typeof s.duration === 'string' ? parseInt(s.duration, 10) : s.duration
      }));
      return { data: services };
    }
    
    return this.get('/services');
  }
  
  // Get a single service by id
  async getById(id: number | string): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const service = mockServices.find(s => s.id === Number(id));
      
      if (!service) {
        return { error: 'Service not found' };
      }
      
      // Fix: Ensure duration is converted to number
      return {
        data: {
          ...service,
          duration: typeof service.duration === 'string' ? parseInt(service.duration, 10) : service.duration
        }
      };
    }
    
    return this.get(`/services/${id}`);
  }

  // Create a new service
  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...mockServices.map(s => s.id || 0), 0) + 1;
      
      // Fix: Create a proper Service object matching the required type
      const newService: Service = { 
        id: newId,
        name: data.name,
        description: data.description || "",
        duration: Number(data.duration), // Ensure this is a number
        price: data.price,
        image_urls: data.image_urls || [],
        benefits: data.benefits || [],
        relatedProducts: data.relatedProducts || [],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      mockServices.push(newService);
      return { data: newService };
    }
    
    return this.post('/services', data);
  }
  
  // Update an existing service
  async update(id: number | string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockServices.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        // Fix: Update properly handling all type conversions
        mockServices[index] = { 
          ...mockServices[index], 
          ...data,
          // Ensure duration is a number
          duration: data.duration !== undefined ? Number(data.duration) : mockServices[index].duration,
          updated_at: new Date().toISOString()
        };
        return { data: mockServices[index] };
      }
      return { error: 'Service not found' };
    }
    
    return this.put(`/services/${id}`, data);
  }
  
  // Override delete method with specific implementation
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockServices.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        mockServices.splice(index, 1);
        return { data: true };
      }
      return { error: 'Service not found' };
    }
    
    return super.delete(`/services/${id}`);
  }
}

// Create a singleton instance
export const serviceService = new ServiceService();
