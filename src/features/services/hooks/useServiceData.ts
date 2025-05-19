
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { Service, ServiceFilters } from '../types';
import { serviceService } from '../services/service.service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useServiceData(initialFilters?: ServiceFilters) {
  const [filters, setFilters] = useState<ServiceFilters>(initialFilters || {});
  const [service, setService] = useState<Service | null>(null);

  // Fetch all services with current filters
  const {
    data: services = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['services', filters],
    queryFn: async () => {
      try {
        // First try using the service abstraction
        const response = await serviceService.getAll();
        
        if (response.data && response.data.length > 0) {
          return response.data;
        }
        
        // Fallback to direct Supabase query
        console.log('Fetching services directly from Supabase...');
        const { data: supabaseData, error } = await supabase
          .from('services')
          .select('*');
        
        if (error) throw error;
        
        if (supabaseData) {
          return supabaseData.map(item => ({
            ...item,
            image_urls: item.image_urls || [],
            relatedProducts: []
          })) as Service[];
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching services:', error);
        toast({
          variant: "destructive",
          title: "Xidmətlər yüklənmədi",
          description: error instanceof Error ? error.message : "Xəta baş verdi"
        });
        return [];
      }
    }
  });

  // Fetch single service
  const fetchService = useCallback(async (id: number | string) => {
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const response = await serviceService.getById(numericId);
      if (response.error) throw new Error(response.error);
      setService(response.data || null);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      toast({
        variant: "destructive",
        title: "Xidmət yüklənmədi",
        description: error instanceof Error ? error.message : "Xəta baş verdi"
      });
      throw error;
    }
  }, []);

  // Update filters
  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    services,
    service,
    isLoading,
    error,
    filters,
    updateFilters,
    fetchService,
    refetch
  };
}
