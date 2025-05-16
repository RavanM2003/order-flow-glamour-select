
import { useState, useCallback, useEffect } from 'react';
import { useApi } from './use-api';
import { serviceService } from '@/services';
import { Service } from '@/models/service.model';

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
  
  return {
    services,
    isLoading: api.isLoading,
    error: api.error,
    fetchServices,
    getService
  };
}
