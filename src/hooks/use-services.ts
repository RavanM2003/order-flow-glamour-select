import { useState, useCallback } from "react";
import { useApi } from "./use-api";
import { serviceService } from "@/services";
import { useToast } from "./use-toast";
import { Service, ServiceFormData } from "@/models/service.model";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const api = useApi();
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      const response = await serviceService.getServices();
      
      if (response.data) {
        setServices(response.data);
        return response.data;
      }
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return [];
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services",
      });
      return [];
    }
  }, [toast]);

  const getServiceById = useCallback(
    async (id: string) => { // Changed from string | number to string
      try {
        // If service is already loaded in state, use it
        const existingService = services.find(
          (service) => service.id === id
        );
        
        if (existingService) {
          setSelectedService(existingService);
          return existingService;
        }

        // Otherwise fetch from API
        const response = await serviceService.getServiceById(id);
        
        if (response.data) {
          setSelectedService(response.data);
          return response.data;
        } else {
          throw new Error(response.error || "Service not found");
        }
      } catch (error) {
        console.error(`Failed to get service ${id}:`, error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to load service ${id}`,
        });
        return null;
      }
    },
    [services, toast]
  );

  const createService = useCallback(
    async (data: ServiceFormData) => {
      try {
        const response = await serviceService.createService(data);
        
        if (response.data) {
          // Add the new service to the list
          setServices(prev => [...prev, response.data]);
          toast({
            title: "Success",
            description: "Service created successfully",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to create service");
        }
      } catch (error) {
        console.error("Failed to create service:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create service",
        });
        return null;
      }
    },
    [toast]
  );

  const updateService = useCallback(
    async (id: string, data: Partial<Service>) => {
      try {
        const response = await serviceService.updateService(id, data);
        
        if (response.data) {
          // Update the service in the list
          setServices(prev =>
            prev.map(s => (s.id === id ? { ...s, ...response.data } : s))
          );
          
          // Update selected service if it matches
          if (selectedService && selectedService.id === id) {
            setSelectedService({ ...selectedService, ...response.data });
          }
          
          toast({
            title: "Success",
            description: "Service updated successfully",
          });
          return response.data;
        } else {
          throw new Error(response.error || "Failed to update service");
        }
      } catch (error) {
        console.error(`Failed to update service ${id}:`, error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update service",
        });
        return null;
      }
    },
    [toast, selectedService]
  );

  const deleteService = useCallback(
    async (id: string) => {
      try {
        const response = await serviceService.deleteService(id);
        
        if (response.data) {
          // Remove the service from the list
          setServices(prev => prev.filter(s => s.id !== id));
          
          // Clear selected service if it matches
          if (selectedService && selectedService.id === id) {
            setSelectedService(null);
          }
          
          toast({
            title: "Success",
            description: "Service deleted successfully",
          });
          return true;
        } else {
          throw new Error(response.error || "Failed to delete service");
        }
      } catch (error) {
        console.error(`Failed to delete service ${id}:`, error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete service",
        });
        return false;
      }
    },
    [toast, selectedService]
  );

  return {
    services,
    selectedService,
    isLoading: api.isLoading,
    error: api.error,
    fetchServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
  };
}
