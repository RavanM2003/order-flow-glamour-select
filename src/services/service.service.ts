
import { ApiService } from './api.service';
import { Service, ServiceFormData } from '@/models/service.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockServices } from '@/lib/mock-data';

// Define what the mock data structure looks like
interface MockService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number | string; // Support both number and string to handle existing mock data
  image_urls?: string[];
  benefits?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  relatedProducts?: number[];
}

export class ServiceService extends ApiService {
  // Get all services
  async getAll(): Promise<ApiResponse<Service[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      // Ensure duration is converted to number for all services
      const services = mockServices.map(s => ({
        ...s,
        duration: typeof s.duration === 'string' ? parseInt(s.duration, 10) : s.duration
      }));
      return { data: services as Service[] };
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
      
      // Ensure duration is converted to number
      return {
        data: {
          ...service,
          duration: typeof service.duration === 'string' ? parseInt(service.duration, 10) : service.duration
        } as Service
      };
    }
    
    return this.get(`/services/${id}`);
  }

  // Create a new service
  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...mockServices.map(s => s.id || 0), 0) + 1;
      
      // Create a proper Service object with duration as a number
      const newService: MockService = { 
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
      
      mockServices.push(newService as any);
      // Convert to Service type with correct number type for duration
      return { data: {
        ...newService,
        duration: Number(newService.duration)
      } as Service };
    }
    
    return this.post('/services', data);
  }
  
  // Update an existing service
  async update(id: number | string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockServices.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        // Update properly handling all type conversions
        const updatedService: MockService = { 
          ...mockServices[index], 
          ...data,
          // Ensure duration is a number
          duration: data.duration !== undefined ? Number(data.duration) : 
            (typeof mockServices[index].duration === 'string' ? 
              parseInt(mockServices[index].duration as string, 10) : 
              mockServices[index].duration),
          updated_at: new Date().toISOString()
        };
        
        mockServices[index] = updatedService as any;
        // Return properly typed Service
        return { 
          data: {
            ...updatedService,
            duration: Number(updatedService.duration)
          } as Service 
        };
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
