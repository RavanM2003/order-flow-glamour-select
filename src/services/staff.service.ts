
import { ApiService } from './api.service';
import { Staff } from '@/models/staff.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockStaff } from '@/lib/mock-data';

export class StaffService extends ApiService {
  // Get all staff
  async getAll(): Promise<ApiResponse<Staff[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 250));
      return { data: [...mockStaff] };
    }
    
    return this.get<Staff[]>('/staff');
  }
  
  // Get a single staff member by id
  async getById(id: number | string): Promise<ApiResponse<Staff>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const staff = mockStaff.find(s => s.id === Number(id));
      return { data: staff ? {...staff} : undefined, error: staff ? undefined : 'Staff not found' };
    }
    
    return this.get<Staff>(`/staff/${id}`);
  }
}

// Create a singleton instance
export const staffService = new StaffService();
