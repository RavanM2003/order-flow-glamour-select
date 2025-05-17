
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { serviceService } from '@/services';
import { Service, ServiceFormData } from '@/models/service.model';

export function useServices() {
  const api = useApi<Service[]>();
  const [services, setServices] = useState<Service[]>([]);
  
  const fetchServices = useCallback(async () => {
    const data = await api.execute(
      () => serviceService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load services'
      }
    );
    
    if (data) {
      setServices(data);
    }
  }, [api]);
  
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const getService = useCallback(async (id: number | string) => {
    const response = await serviceService.getById(id);
    return response.data;
  }, []);

  const createService = useCallback(async (data: ServiceFormData) => {
    const result = await api.execute(
      () => serviceService.create(data),
      {
        showSuccessToast: true,
        successMessage: 'Service created successfully',
        errorPrefix: 'Failed to create service',
        onSuccess: () => {
          fetchServices();
        }
      }
    );
    
    return result;
  }, [api, fetchServices]);
  
  const updateService = useCallback(async (id: number | string, data: Partial<ServiceFormData>) => {
    const result = await api.execute(
      () => serviceService.update(id, data),
      {
        showSuccessToast: true,
        successMessage: 'Service updated successfully',
        errorPrefix: 'Failed to update service',
        onSuccess: () => {
          fetchServices();
        }
      }
    );
    
    return result;
  }, [api, fetchServices]);
  
  const deleteService = useCallback(async (id: number | string) => {
    const result = await api.execute(
      () => serviceService.delete(id),
      {
        showSuccessToast: true,
        successMessage: 'Service deleted successfully',
        errorPrefix: 'Failed to delete service',
        onSuccess: () => {
          fetchServices();
        }
      }
    );
    
    return result;
  }, [api, fetchServices]);
  
  return {
    services,
    isLoading: api.isLoading,
    error: api.error,
    fetchServices,
    getService,
    createService,
    updateService,
    deleteService
  };
}
