import { useState, useCallback } from "react";
import { useApi } from "./use-api";
import { serviceService } from "@/services";
import { useToast } from "./use-toast";
import { Service, ServiceFormData } from "@/models/service.model";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const api = useApi<Service[]>();
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    try {
      const result = await api.execute(async () => {
        const response = await serviceService.getServices();
        return response.data;
      });

      if (result) {
        setServices(result);
      }
      return result;
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load services",
      });
    }
  }, [api, toast]);

  const getServiceById = useCallback(
    async (id: string | number) => {
      try {
        // If service is already loaded in state, use it
        const existingService = services.find(
          (service) => service.id.toString() === id.toString()
        );
        if (existingService) {
          setSelectedService(existingService);
          return existingService;
        }

        // Otherwise fetch from API
        const idString = typeof id === "number" ? id.toString() : id;
        const response = await serviceService.getServiceById(idString);
        
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
        const result = await api.execute(async () => {
          const response = await serviceService.createService(data);
          if (!response.data) {
            throw new Error(response.error || "Failed to create service");
          }
          return response.data;
        });

        if (result) {
          // Add the new service to the list
          setServices((prev) => [...prev, result]);
          toast({
            title: "Success",
            description: "Service created successfully",
          });
        }
        return result;
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
    [api, toast]
  );

  const updateService = useCallback(
    async (id: string, data: Partial<Service>) => {
      try {
        const result = await api.execute(async () => {
          const response = await serviceService.updateService(id, data);
          if (!response.data) {
            throw new Error(response.error || "Failed to update service");
          }
          return response.data;
        });

        if (result) {
          // Update the service in the list
          setServices((prev) =>
            prev.map((s) => (s.id.toString() === id ? { ...s, ...result } : s))
          );
          
          // Update selected service if it matches
          if (selectedService && selectedService.id.toString() === id) {
            setSelectedService({ ...selectedService, ...result });
          }
          
          toast({
            title: "Success",
            description: "Service updated successfully",
          });
        }
        return result;
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
    [api, toast, selectedService]
  );

  const deleteService = useCallback(
    async (id: string) => {
      try {
        const result = await api.execute(async () => {
          const response = await serviceService.deleteService(id);
          if (!response.data) {
            throw new Error(response.error || "Failed to delete service");
          }
          return true;
        });

        if (result) {
          // Remove the service from the list
          setServices((prev) => prev.filter((s) => s.id.toString() !== id));
          
          // Clear selected service if it matches
          if (selectedService && selectedService.id.toString() === id) {
            setSelectedService(null);
          }
          
          toast({
            title: "Success",
            description: "Service deleted successfully",
          });
        }
        return result;
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
    [api, toast, selectedService]
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
