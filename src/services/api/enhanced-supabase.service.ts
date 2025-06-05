
import { BaseApiService } from './base.service';
import { Database, FilterOptions } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/models/service.model';

type User = Database['public']['Tables']['users']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export class EnhancedUserService extends BaseApiService {
  constructor() {
    super('users');
  }

  protected buildFilterQuery(query: any, filters: FilterOptions) {
    let filteredQuery = super.buildFilterQuery(query, filters);
    
    if (filters.search) {
      filteredQuery = filteredQuery.or(
        `full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
      );
    }
    
    return filteredQuery;
  }

  async getCustomers(filters?: FilterOptions): Promise<ApiResponse<any[]>> {
    return this.executeQuery('getCustomers', async () => {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'customer');
      
      if (filters) {
        query = this.buildFilterQuery(query, filters);
      }
      
      return query;
    });
  }

  async getStaff(filters?: FilterOptions): Promise<ApiResponse<any[]>> {
    return this.executeQuery('getStaff', async () => {
      let query = supabase
        .from('users')
        .select(`
          *,
          staff (
            id,
            position,
            specializations
          )
        `)
        .in('role', ['staff', 'admin', 'super_admin']);
      
      if (filters) {
        query = this.buildFilterQuery(query, filters);
      }
      
      return query;
    });
  }

  async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.executeQuery('getUserProfile', async () => {
      return supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
    });
  }
}

export class EnhancedServiceService extends BaseApiService {
  constructor() {
    super('services');
  }

  protected buildFilterQuery(query: any, filters: FilterOptions) {
    let filteredQuery = super.buildFilterQuery(query, filters);
    
    if (filters.search) {
      filteredQuery = filteredQuery.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
    
    if (filters.category) {
      filteredQuery = filteredQuery.eq('category_id', filters.category);
    }
    
    return filteredQuery;
  }

  async getServicesWithCategory(filters?: FilterOptions): Promise<ApiResponse<Service[]>> {
    return this.executeQuery('getServicesWithCategory', async () => {
      let query = supabase
        .from('services')
        .select(`
          *,
          service_categories (
            id,
            name
          )
        `);
      
      if (filters) {
        query = this.buildFilterQuery(query, filters);
      }
      
      return query;
    });
  }

  async getServicesByStaff(staffId: string): Promise<ApiResponse<Service[]>> {
    return this.executeQuery('getServicesByStaff', async () => {
      return supabase
        .from('staff')
        .select(`
          specializations,
          services:specializations (*)
        `)
        .eq('user_id', staffId)
        .single();
    });
  }

  async getServices(): Promise<ApiResponse<Service[]>> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            name
          )
        `);
      
      if (error) throw error;
      
      // Map the response to match our Service interface with string IDs
      const services = data.map(item => ({
        ...item,
        relatedProducts: [] // Initialize as empty array since we're not fetching them yet
      })) as Service[];
      
      return { data: services };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { error: error instanceof Error ? error.message : 'Failed to fetch services' };
    }
  }
}

export class EnhancedAppointmentService extends BaseApiService {
  constructor() {
    super('appointments');
  }

  protected buildFilterQuery(query: any, filters: FilterOptions) {
    let filteredQuery = super.buildFilterQuery(query, filters);
    
    if (filters.status) {
      filteredQuery = filteredQuery.eq('status', filters.status);
    }
    
    if (filters.dateFrom && filters.dateTo) {
      filteredQuery = filteredQuery
        .gte('appointment_date', filters.dateFrom)
        .lte('appointment_date', filters.dateTo);
    }
    
    return filteredQuery;
  }

  async getAppointmentsWithDetails(filters?: FilterOptions): Promise<ApiResponse<any[]>> {
    return this.executeQuery('getAppointmentsWithDetails', async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          customer:customer_user_id (
            id,
            full_name,
            email,
            phone
          ),
          staff:user_id (
            id,
            full_name
          ),
          appointment_services (
            *,
            service:service_id (
              id,
              name,
              duration,
              price
            )
          ),
          appointment_products (
            *,
            product:product_id (
              id,
              name,
              price
            )
          )
        `);
      
      if (filters) {
        query = this.buildFilterQuery(query, filters);
      }
      
      return query;
    });
  }

  async getAppointmentSummary(appointmentId: number): Promise<ApiResponse<any>> {
    return this.executeQuery('getAppointmentSummary', async () => {
      return supabase
        .from('appointments')
        .select(`
          *,
          appointment_services (
            *,
            service:service_id (*)
          ),
          appointment_products (
            *,
            product:product_id (*)
          ),
          payments (*)
        `)
        .eq('id', appointmentId)
        .single();
    });
  }

  async checkStaffAvailability(
    staffId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: number
  ): Promise<ApiResponse<boolean>> {
    return this.executeQuery('checkStaffAvailability', async () => {
      let query = supabase
        .from('appointments')
        .select(`
          id,
          appointment_services!inner (
            staff_user_id
          )
        `)
        .eq('appointment_date', date)
        .eq('appointment_services.staff_user_id', staffId)
        .not('status', 'in', '(cancelled,no_show)')
        .or(
          `and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`
        );

      if (excludeAppointmentId) {
        query = query.neq('id', excludeAppointmentId);
      }

      const result = await query;
      
      return {
        data: !result.data || result.data.length === 0,
        error: result.error
      };
    });
  }
}

// Export enhanced service instances
export const enhancedUserService = new EnhancedUserService();
export const enhancedServiceService = new EnhancedServiceService();
export const enhancedAppointmentService = new EnhancedAppointmentService();
