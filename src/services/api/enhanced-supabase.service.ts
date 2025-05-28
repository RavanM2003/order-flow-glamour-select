
import { BaseApiService } from './base.service';
import { Database, FilterOptions, ApiResponse } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

type User = Database['public']['Tables']['users']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];

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
      return supabase.rpc('get_appointment_summary', {
        appointment_id: appointmentId
      });
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
      const result = await supabase.rpc('check_staff_booking_conflict', {
        staff_id: staffId,
        appointment_date: date,
        start_time: startTime,
        end_time: endTime,
        exclude_appointment_id: excludeAppointmentId || null
      });
      
      return {
        data: !result.data, // Invert because function returns true for conflict
        error: result.error
      };
    });
  }
}

// Export enhanced service instances
export const enhancedUserService = new EnhancedUserService();
export const enhancedServiceService = new EnhancedServiceService();
export const enhancedAppointmentService = new EnhancedAppointmentService();
