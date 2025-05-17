
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
      return { data: [...mockServices] };
    }
    
    return this.get<Service[]>('/services');
  }
  
  // Get a single service by id
  async getById(id: number | string): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const service = mockServices.find(s => s.id === Number(id));
      return { data: service ? {...service} : undefined, error: service ? undefined : 'Service not found' };
    }
    
    return this.get<Service>(`/services/${id}`);
  }

  // Create a new service
  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newId = Math.max(...mockServices.map(s => s.id), 0) + 1;
      const newService = { 
        ...data, 
        id: newId 
      };
      mockServices.push(newService as Service);
      return { data: newService as Service };
    }
    
    return this.post<Service>('/services', data);
  }
  
  // Update an existing service
  async update(id: number | string, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockServices.findIndex(s => s.id === Number(id));
      if (index >= 0) {
        mockServices[index] = { ...mockServices[index], ...data };
        return { data: mockServices[index] };
      }
      return { error: 'Service not found' };
    }
    
    return this.put<Service>(`/services/${id}`, data);
  }
  
  // Delete a service
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
    
    return this.delete<boolean>(`/services/${id}`);
  }
}

// Create a singleton instance
export const serviceService = new ServiceService();
