
import { Service, ServiceFormData } from "@/models/service.model";

// Define the ApiResponse interface for consistent return types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export const serviceService = {
  getAll: async (): Promise<Service[]> => [],
  getById: async (id: number): Promise<Service> => ({}),
  create: async (data: ServiceFormData): Promise<Service> => ({}),
  update: async (id: number, data: Partial<ServiceFormData>): Promise<Service> => ({}),
  delete: async (id: number): Promise<boolean> => true,
  listServices: async (): Promise<Service[]> => [],
  
  // Add these methods being called in use-services.ts
  getServices: async (): Promise<ApiResponse<Service[]>> => ({ data: [] }),
  getServiceById: async (id: string | number): Promise<ApiResponse<Service>> => ({ data: {} }),
  createService: async (data: ServiceFormData): Promise<ApiResponse<Service>> => ({ data: {} }),
  updateService: async (id: string | number, data: Partial<ServiceFormData>): Promise<ApiResponse<Service>> => ({ data: {} }),
  deleteService: async (id: string | number): Promise<ApiResponse<boolean>> => ({ data: true })
};
