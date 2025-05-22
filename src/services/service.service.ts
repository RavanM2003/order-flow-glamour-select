
import { Service, ServiceFormData } from "@/models/service.model";

// Define the ApiResponse interface for consistent return types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export const serviceService = {
  getAll: async (): Promise<Service[]> => {
    // This is a mock implementation - in a real app, fetch from API
    return [];
  },
  getById: async (id: number): Promise<Service> => {
    // This is a mock implementation - return empty service with required props
    return { id: 0, name: '', duration: 30, price: 0 };
  },
  create: async (data: ServiceFormData): Promise<Service> => {
    // This is a mock implementation
    return { id: 0, name: data.name, duration: data.duration || 30, price: data.price || 0 };
  },
  update: async (id: number, data: Partial<ServiceFormData>): Promise<Service> => {
    // This is a mock implementation
    return { id, name: data.name || '', duration: data.duration || 30, price: data.price || 0 };
  },
  delete: async (id: number): Promise<boolean> => true,
  listServices: async (): Promise<Service[]> => [],
  
  // Add these methods being called in use-services.ts
  getServices: async (): Promise<ApiResponse<Service[]>> => ({ data: [] }),
  getServiceById: async (id: string | number): Promise<ApiResponse<Service>> => ({ 
    data: { id: typeof id === 'string' ? parseInt(id) : id, name: '', duration: 30, price: 0 } 
  }),
  createService: async (data: ServiceFormData): Promise<ApiResponse<Service>> => ({ 
    data: { id: 1, name: data.name, duration: data.duration || 30, price: data.price || 0 } 
  }),
  updateService: async (id: string | number, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => ({ 
    data: { id: typeof id === 'string' ? parseInt(id) : id, name: data.name || '', duration: data.duration || 30, price: data.price || 0 } 
  }),
  deleteService: async (id: string | number): Promise<ApiResponse<boolean>> => ({ data: true })
};
