
import { ApiService } from './api.service';
import { Service } from '@/models/service.model';
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
}

// Create a singleton instance
export const serviceService = new ServiceService();
