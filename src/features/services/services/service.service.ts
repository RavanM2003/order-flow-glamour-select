
import { ApiService } from '@/services/api.service';
import { Service, ServiceFormData } from '../types';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';

export class ServiceService extends ApiService {
  async getAll(): Promise<ApiResponse<Service[]>> {
    return this.get('/services');
  }
  
  async getById(id: number): Promise<ApiResponse<Service>> {
    return this.get(`/services/${id}`);
  }

  async create(data: ServiceFormData): Promise<ApiResponse<Service>> {
    return this.post('/services', data);
  }
  
  async update(id: number, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> {
    return this.put(`/services/${id}`, data);
  }
  
  // Override delete method with specific implementation using the ApiService's delete method
  async delete(id: number): Promise<ApiResponse<boolean>> {
    return super.delete(`/services/${id}`);
  }
}

export const serviceService = new ServiceService();
