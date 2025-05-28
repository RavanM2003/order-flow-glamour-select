
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, FilterOptions, PaginatedResponse } from '@/types/database';
import { useQueryStore } from '@/stores/useQueryStore';

type TableName = 'users' | 'services' | 'products' | 'appointments' | 'staff' | 'service_categories' | 'transactions' | 'payments' | 'invoices';

export class BaseApiService {
  protected tableName: TableName;
  
  constructor(tableName: TableName) {
    this.tableName = tableName;
  }

  protected handleError = (error: unknown, operation: string): ApiResponse<never> => {
    console.error(`${this.tableName} ${operation} error:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    useQueryStore.getState().setOperationError(`${this.tableName}-${operation}`, errorMessage);
    
    return { error: errorMessage, status: 'error' };
  };

  protected startLoading = (operation: string) => {
    useQueryStore.getState().addLoadingOperation(`${this.tableName}-${operation}`);
  };

  protected stopLoading = (operation: string) => {
    useQueryStore.getState().removeLoadingOperation(`${this.tableName}-${operation}`);
  };

  protected async executeQuery<T>(
    operation: string,
    queryFn: () => Promise<{ data: T | null; error: any }>
  ): Promise<ApiResponse<T>> {
    this.startLoading(operation);
    
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        throw error;
      }
      
      useQueryStore.getState().clearOperationError(`${this.tableName}-${operation}`);
      
      return { 
        data: data as T, 
        status: 'success' 
      };
    } catch (error) {
      return this.handleError(error, operation);
    } finally {
      this.stopLoading(operation);
    }
  }

  protected async executePaginatedQuery<T>(
    operation: string,
    queryFn: (from: number, to: number) => Promise<{ data: T[] | null; error: any; count?: number }>,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    this.startLoading(operation);
    
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await queryFn(from, to);
      
      if (error) {
        throw error;
      }
      
      const result: PaginatedResponse<T> = {
        data: data || [],
        total: count || 0,
        page,
        limit,
        hasMore: (count || 0) > page * limit
      };
      
      useQueryStore.getState().clearOperationError(`${this.tableName}-${operation}`);
      
      return { 
        data: result, 
        status: 'success' 
      };
    } catch (error) {
      return this.handleError(error, operation);
    } finally {
      this.stopLoading(operation);
    }
  }

  protected buildFilterQuery(query: any, filters: FilterOptions) {
    if (filters.search) {
      // Add search functionality based on table structure
      // This will be overridden in specific services
    }
    
    if (filters.dateFrom && filters.dateTo) {
      query = query.gte('created_at', filters.dateFrom)
                  .lte('created_at', filters.dateTo);
    }
    
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { 
        ascending: filters.sortOrder === 'asc' 
      });
    }
    
    return query;
  }

  async getAll(filters?: FilterOptions): Promise<ApiResponse<any[]>> {
    return this.executeQuery('getAll', async () => {
      let query = supabase.from(this.tableName).select('*');
      
      if (filters) {
        query = this.buildFilterQuery(query, filters);
      }
      
      return query;
    });
  }

  async getById(id: string | number): Promise<ApiResponse<any>> {
    return this.executeQuery('getById', async () => {
      return supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
    });
  }

  async create(data: Record<string, any>): Promise<ApiResponse<any>> {
    return this.executeQuery('create', async () => {
      return supabase
        .from(this.tableName)
        .insert([data])
        .select()
        .single();
    });
  }

  async update(id: string | number, updates: Record<string, any>): Promise<ApiResponse<any>> {
    return this.executeQuery('update', async () => {
      return supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    });
  }

  async delete(id: string | number): Promise<ApiResponse<boolean>> {
    return this.executeQuery('delete', async () => {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      return { data: !error, error };
    });
  }

  async bulkDelete(ids: (string | number)[]): Promise<ApiResponse<boolean>> {
    return this.executeQuery('bulkDelete', async () => {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);
      
      return { data: !error, error };
    });
  }
}
