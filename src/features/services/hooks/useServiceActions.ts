
import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/use-api';
import { Service, ServiceFormData } from '../types';
import { serviceService } from '../services/service.service';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useServiceActions(onSuccess?: () => void) {
  const api = useApi<Service>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Create service
  const createService = useCallback(async (data: ServiceFormData) => {
    setIsCreating(true);
    try {
      const result = await api.execute(
        () => serviceService.create(data),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət uğurla yaradıldı',
          errorPrefix: 'Xidmət yaradıla bilmədi',
          onSuccess: () => onSuccess?.()
        }
      );
      return result;
    } finally {
      setIsCreating(false);
    }
  }, [api, onSuccess]);

  // Update service
  const updateService = useCallback(async (id: number | string, data: Partial<ServiceFormData>) => {
    setIsUpdating(true);
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const result = await api.execute(
        () => serviceService.update(numericId, data),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət yeniləndi',
          errorPrefix: 'Xidmət yenilənə bilmədi',
          onSuccess: () => onSuccess?.()
        }
      );
      return result;
    } finally {
      setIsUpdating(false);
    }
  }, [api, onSuccess]);

  // Delete service
  const deleteService = useCallback(async (id: number | string) => {
    setIsDeleting(true);
    try {
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const result = await api.execute(
        () => serviceService.delete(numericId),
        {
          showSuccessToast: true,
          successMessage: 'Xidmət silindi',
          errorPrefix: 'Xidmət silinə bilmədi',
          onSuccess: () => onSuccess?.()
        }
      );
      return result;
    } finally {
      setIsDeleting(false);
    }
  }, [api, onSuccess]);

  return {
    createService,
    updateService,
    deleteService,
    isLoading: api.isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error: api.error
  };
}
