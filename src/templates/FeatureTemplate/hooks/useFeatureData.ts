
/**
 * Hook to fetch and manage feature data
 * 
 * USAGE:
 * 1. Rename all instances of "feature" to your feature name
 * 2. Update imports for your specific feature types
 * 3. Adjust query keys as needed
 */

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Feature, FeatureFilters } from '../types';
import { featureService } from '../services/feature.service';

export function useFeatureData(initialFilters?: FeatureFilters) {
  // State for managing filters
  const [filters, setFilters] = useState<FeatureFilters>(initialFilters || {});
  
  // Fetch all features with current filters
  const {
    data: features,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['features', filters],
    queryFn: async () => {
      const response = await featureService.getAll(filters);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || [];
    }
  });

  // Fetch a single feature by ID
  const fetchFeatureById = async (id: number | string): Promise<Feature | null> => {
    const response = await featureService.getById(id);
    if (response.error) {
      console.error(response.error);
      return null;
    }
    return response.data;
  };

  // Update filters and trigger refetch
  const updateFilters = (newFilters: Partial<FeatureFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    features,
    isLoading,
    error,
    refetch,
    filters,
    updateFilters,
    fetchFeatureById
  };
}
