
import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/use-api';
import { featureService } from '../services/feature.service';
import { Feature, FeatureFormData } from '../types';
import { toast } from '@/components/ui/use-toast';

export function useFeatureActions(onSuccess?: () => void) {
  const api = useApi<Feature>();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const createFeature = useCallback(async (data: FeatureFormData) => {
    setIsCreating(true);
    try {
      const result = await api.execute(
        () => featureService.create(data),
        {
          showSuccessToast: true,
          successMessage: 'Feature created successfully',
          errorPrefix: 'Failed to create feature',
          onSuccess: () => {
            onSuccess?.();
          }
        }
      );
      setIsCreating(false);
      return result;
    } catch (error) {
      setIsCreating(false);
      throw error;
    }
  }, [api, onSuccess]);
  
  const updateFeature = useCallback(async (id: number | string, data: Partial<FeatureFormData>) => {
    setIsUpdating(true);
    try {
      const result = await api.execute(
        () => featureService.update(id, data),
        {
          showSuccessToast: true,
          successMessage: 'Feature updated successfully',
          errorPrefix: 'Failed to update feature',
          onSuccess: () => {
            onSuccess?.();
          }
        }
      );
      setIsUpdating(false);
      return result;
    } catch (error) {
      setIsUpdating(false);
      throw error;
    }
  }, [api, onSuccess]);
  
  const deleteFeature = useCallback(async (id: number | string) => {
    try {
      const response = await featureService.delete(id);
      
      if (response.data) {
        toast({ 
          title: "Success", 
          description: "Feature deleted successfully"
        });
        onSuccess?.();
        return true;
      } 
      
      if (response.error) {
        toast({ 
          title: "Error", 
          description: `Failed to delete feature: ${response.error}`,
          variant: "destructive" 
        });
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({ 
        title: "Error", 
        description: `Failed to delete feature: ${errorMessage}`,
        variant: "destructive" 
      });
      return false;
    }
  }, [onSuccess]);

  return {
    createFeature,
    updateFeature,
    deleteFeature,
    isLoading: api.isLoading,
    isCreating,
    isUpdating,
    error: api.error
  };
}
