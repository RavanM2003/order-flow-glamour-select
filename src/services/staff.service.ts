
import { Staff, StaffFormData } from "@/models/staff.model";

// Define the ApiResponse interface for consistent return types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Update staffService to include the methods being used in hooks
export const staffService = {
  getAll: async (): Promise<Staff[]> => [],
  getById: async (id: number | string): Promise<Staff> => ({
    id: typeof id === 'string' ? id : id.toString(),
    name: ''
  }),
  create: async (data: any): Promise<Staff> => ({
    id: '123',
    name: data.name || ''
  }),
  update: async (id: number | string, data: any): Promise<Staff> => ({
    id: typeof id === 'string' ? id : id.toString(),
    name: data.name || ''
  }),
  delete: async (id: number | string): Promise<boolean> => true,
  
  getStaffMembers: async (): Promise<ApiResponse<Staff[]>> => ({ data: [] }),
  getStaffMemberById: async (id: string | number): Promise<ApiResponse<Staff>> => ({ 
    data: {
      id: typeof id === 'string' ? id : id.toString(),
      name: ''
    }
  }),
  createStaffMember: async (data: StaffFormData): Promise<ApiResponse<Staff>> => ({ 
    data: {
      id: '123',
      name: data.name
    }
  }),
  updateStaffMember: async (id: string, data: Partial<StaffFormData>): Promise<ApiResponse<Staff>> => ({ 
    data: {
      id,
      name: data.name || ''
    }
  }),
  deleteStaffMember: async (id: string): Promise<ApiResponse<boolean>> => ({ data: true })
};
