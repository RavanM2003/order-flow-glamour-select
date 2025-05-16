
/**
 * Hook to perform CRUD operations on features
 * 
 * USAGE:
 * 1. Rename all instances of "feature" to your feature name
 * 2. Update imports for your specific feature types
 * 3. Modify or add methods as needed
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { FeatureFormData } from '../types';
import { featureService } from '../services/feature.service';

export function useFeatureActions() {
  const queryClient = useQueryClient();

  // Create new feature
  const createMutation = useMutation({
    mutationFn: (data: FeatureFormData) => featureService.create(data),
    onSuccess: (response) => {
      if (response.data) {
        // Invalidate and refetch features after successful creation
        queryClient.invalidateQueries({ queryKey: ['features'] });
        toast({
          title: 'Success',
          description: 'Feature created successfully',
        });
      } else if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  });

  // Update existing feature
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<FeatureFormData> }) => 
      featureService.update(id, data),
    onSuccess: (response) => {
      if (response.data) {
        // Invalidate and refetch features after successful update
        queryClient.invalidateQueries({ queryKey: ['features'] });
        toast({
          title: 'Success',
          description: 'Feature updated successfully',
        });
      } else if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  });

  // Delete feature
  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => featureService.deleteFeature(id),
    onSuccess: (response) => {
      if (response.data) {
        // Invalidate and refetch features after successful deletion
        queryClient.invalidateQueries({ queryKey: ['features'] });
        toast({
          title: 'Success',
          description: 'Feature deleted successfully',
        });
      } else if (response.error) {
        toast({
          title: 'Error',
          description: response.error,
          variant: 'destructive',
        });
      }
    }
  });

  const createFeature = async (data: FeatureFormData) => {
    return createMutation.mutateAsync(data);
  };

  const updateFeature = async (id: number | string, data: Partial<FeatureFormData>) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteFeature = async (id: number | string) => {
    return deleteMutation.mutateAsync(id);
  };

  return {
    createFeature,
    updateFeature,
    deleteFeature,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
