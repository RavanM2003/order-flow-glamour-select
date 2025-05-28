
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useQueryStore } from '@/stores/useQueryStore';
import { ApiResponse, FilterOptions } from '@/types/database';
import { useEffect } from 'react';

interface UseEnhancedQueryOptions<T> {
  queryKey: string[];
  queryFn: () => Promise<ApiResponse<T>>;
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: number | boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useEnhancedQuery<T>({
  queryKey,
  queryFn,
  enabled = true,
  staleTime = 5 * 60 * 1000, // 5 minutes
  cacheTime = 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus = false,
  refetchOnMount = true,
  retry = 3,
  onSuccess,
  onError
}: UseEnhancedQueryOptions<T>) {
  const { invalidationKeys } = useQueryStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await queryFn();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    enabled,
    staleTime,
    cacheTime,
    refetchOnWindowFocus,
    refetchOnMount,
    retry,
    onSuccess,
    onError: (error: Error) => {
      onError?.(error.message);
    }
  });

  // Handle query invalidation
  useEffect(() => {
    const shouldInvalidate = queryKey.some(key => 
      Array.from(invalidationKeys).some(invalidKey => 
        key.includes(invalidKey)
      )
    );

    if (shouldInvalidate) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [invalidationKeys, queryKey, queryClient]);

  return {
    ...query,
    isLoading: query.isLoading || query.isFetching,
    refresh: () => queryClient.invalidateQueries({ queryKey })
  };
}

interface UseEnhancedMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: string, variables: TVariables) => void;
  invalidateQueries?: string[];
}

export function useEnhancedMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = []
}: UseEnhancedMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { invalidateQueries: storeInvalidateQueries } = useQueryStore();

  const mutation = useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      if (invalidateQueries.length > 0) {
        storeInvalidateQueries(invalidateQueries);
        invalidateQueries.forEach(key => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      
      onSuccess?.(data as TData, variables);
    },
    onError: (error: Error, variables) => {
      onError?.(error.message, variables);
    }
  });

  return {
    ...mutation,
    isLoading: mutation.isPending
  };
}

// Specialized hooks for common patterns
export function useFilteredQuery<T>(
  baseQueryKey: string,
  queryFn: (filters: FilterOptions) => Promise<ApiResponse<T>>,
  filters: FilterOptions = {}
) {
  const queryKey = [baseQueryKey, 'filtered', JSON.stringify(filters)];
  
  return useEnhancedQuery({
    queryKey,
    queryFn: () => queryFn(filters),
    staleTime: 30 * 1000, // 30 seconds for filtered data
  });
}

export function usePaginatedQuery<T>(
  baseQueryKey: string,
  queryFn: (page: number, limit: number, filters?: FilterOptions) => Promise<ApiResponse<T>>,
  page: number = 1,
  limit: number = 10,
  filters: FilterOptions = {}
) {
  const queryKey = [baseQueryKey, 'paginated', page, limit, JSON.stringify(filters)];
  
  return useEnhancedQuery({
    queryKey,
    queryFn: () => queryFn(page, limit, filters),
    staleTime: 30 * 1000,
    cacheTime: 5 * 60 * 1000 // Keep paginated data for 5 minutes
  });
}
