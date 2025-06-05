
import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/use-api';
import { serviceService } from '@/services';
import { Service } from '@/models/service.model';

export interface ServiceFilters {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export function useServiceData() {
  const api = useApi<Service[]>();
  const [filters, setFilters] = useState<ServiceFilters>({});
  
  const services = api.data || [];
  const service = services[0] || null;
  
  const updateFilters = useCallback((newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);
  
  const fetchService = useCallback(async (id: string) => {
    const result = await api.execute(
      () => serviceService.getById(id),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load service'
      }
    );
    return result;
  }, [api]);

  const getServiceById = useCallback(async (id: string) => {
    const response = await serviceService.getById(id);
    return response.data;
  }, []);
  
  const refetch = useCallback(async (options?: any) => {
    return api.execute(
      () => serviceService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load services'
      }
    );
  }, [api]);
  
  return {
    services,
    service,
    isLoading: api.isLoading,
    error: api.error,
    filters,
    updateFilters,
    fetchService,
    getServiceById,
    refetch
  };
}
