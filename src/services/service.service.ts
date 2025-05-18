
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
    
    return this.get<Service[]>('/services');
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
    
    return this.get<Service>(`/services/${id}`);
  }

  // Create a new service
  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...mockServices.map(s => s.id), 0) + 1;
      // Fix: Ensure duration is a number
      const newService: Service = { 
        ...data, 
        id: newId,
        duration: typeof data.duration === 'string' ? parseInt(data.duration, 10) : data.duration
      };
      mockServices.push(newService);
      return { data: newService };
    }
    
    return this.post<Service>('/services', data);
  }
  
  // Update an existing service
  async update(id: number | string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockServices.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        // Fix: Ensure duration is a number
        mockServices[index] = { 
          ...mockServices[index], 
          ...data,
          duration: data.duration !== undefined ? 
            (typeof data.duration === 'string' ? parseInt(data.duration, 10) : data.duration) : 
            mockServices[index].duration
        };
        return { data: mockServices[index] };
      }
      return { error: 'Service not found' };
    }
    
    return this.put<Service>(`/services/${id}`, data);
  }
  
  // Delete a service - Override the base method to match the expected signature
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
    
    return this.delete(`/services/${id}`);
  }
}

// Create a singleton instance
export const serviceService = new ServiceService();
