import { Customer, CustomerFormData } from '@/models/customer.model';
import { CustomerWithUserFormData } from '@/models/user.model';
import { ApiResponse } from './staff.service';
import { supabase } from '@/integrations/supabase/client';

export const customerService = {
  create: async (data: CustomerFormData | CustomerWithUserFormData): Promise<ApiResponse<Customer>> => {
    try {
      // For simplicity, let's use the existing users table instead of trying to create a customers table
      const { data: customer, error } = await supabase
        .from('users')
        .insert({
          email: data.email,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          full_name: data.full_name || data.name,
          phone: data.phone,
          gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : 'other',
          birth_date: data.birth_date,
          note: data.note,
          role: 'customer',
          hashed_password: '', // Required field for users table
        })
        .select('*')
        .single();
      
      if (error) {
        return { error: error.message };
      }
      
      // Convert user data to Customer format
      const customerData: Customer = {
        id: customer.id,
        name: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        birth_date: customer.birth_date,
        note: customer.note,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        // Add these for consistency
        first_name: customer.first_name,
        last_name: customer.last_name,
        full_name: customer.full_name
      };
      
      return { data: customerData };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  getAll: async (): Promise<ApiResponse<Customer[]>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer');
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert user data to Customer format
      const customers: Customer[] = data.map(user => ({
        id: user.id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birth_date: user.birth_date,
        note: user.note,
        created_at: user.created_at,
        updated_at: user.updated_at,
      }));
      
      return { data: customers };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', 'customer')
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert user data to Customer format
      const customer: Customer = {
        id: data.id,
        name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      
      return { data: customer };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  update: async (id: string, data: Partial<CustomerFormData>): Promise<ApiResponse<Customer>> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : undefined,
          birth_date: data.birth_date,
          note: data.note,
        })
        .eq('id', id)
        .eq('role', 'customer')
        .select('*')
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      // Convert user data to Customer format
      const customer: Customer = {
        id: user.id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birth_date: user.birth_date,
        note: user.note,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
      
      return { data: customer };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      // Update user role to maintain referential integrity
      const { error } = await supabase
        .from('users')
        .update({ role: 'customer' }) // Use 'customer' instead of 'inactive' to match UserRole type
        .eq('id', id)
        .eq('role', 'customer');
        
      if (error) {
        return { error: error.message };
      }
      
      return { data: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
};
