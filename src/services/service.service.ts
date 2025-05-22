
import { Service, ServiceFormData } from "@/models/service.model";
import { ApiService } from "./api.service";
import { ApiResponse } from "@/models/types";
import { config } from "@/config/env";
import { supabase } from "@/integrations/supabase/client";
import { withUserId } from "@/utils/withUserId";
import { useCurrentUserId } from "@/hooks/use-current-user-id";

export class ServiceService extends ApiService {
  constructor() {
    super();
  }
  
  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const { data, error } = await supabase.from("services").select("*");

      if (error) throw error;

      return { data: data as Service[] };
    } catch (error) {
      console.error("Error fetching services:", error);
      return { error: String(error) };
    }
  }

  async getServiceById(id: string): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return { data: data as Service };
    } catch (error) {
      console.error("Error fetching service:", error);
      return { error: String(error) };
    }
  }
  
  async createService(serviceData: ServiceFormData): Promise<ApiResponse<Service>> {
    if (config.usesMockData) {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockService: Service = {
        id: String(Date.now()),
        name: serviceData.name,
        price: serviceData.price,
        duration: serviceData.duration,
        description: serviceData.description,
        benefits: serviceData.benefits,
        category_id: serviceData.category_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return { data: mockService, message: "Xidmət uğurla yaradıldı" };
    }

    try {
      // Add the current user_id to the service data
      const serviceWithUserId = withUserId(serviceData);
      
      const { data, error } = await supabase
        .from("services")
        .insert([serviceWithUserId])
        .select()
        .single();

      if (error) throw error;

      return { 
        data: data as Service,
        message: "Xidmət uğurla yaradıldı" 
      };
    } catch (error) {
      console.error("Error creating service:", error);
      return {
        error: error instanceof Error ? error.message : "Failed to create service",
      };
    }
  }

  async updateService(
    id: string,
    updates: Partial<Service>
  ): Promise<ApiResponse<Service>> {
    try {
      const { data, error } = await supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Service };
    } catch (error) {
      console.error("Error updating service:", error);
      return { error: String(error) };
    }
  }

  async deleteService(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;

      return { data: true, message: "Xidmət uğurla silindi" };
    } catch (error) {
      console.error("Error deleting service:", error);
      return { error: String(error) };
    }
  }
}

export const serviceService = new ServiceService();
