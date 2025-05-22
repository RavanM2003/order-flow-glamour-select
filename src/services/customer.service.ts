
import { Customer, CustomerFormData } from '@/models/customer.model';
import { CustomerWithUserFormData } from '@/models/user.model';
import { ApiResponse } from './staff.service';
import { supabase } from '@/integrations/supabase/client';

export const customerService = {
  create: async (data: CustomerFormData | CustomerWithUserFormData): Promise<ApiResponse<Customer>> => {
    try {
      // Check if user_id is provided
      if (data.user_id) {
        // Create customer with existing user_id
        const { data: customer, error } = await supabase
          .from('customers')
          .insert({
            name: data.name,
            full_name: data.full_name || data.name,
            email: data.email,
            phone: data.phone,
            gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : 'other',
            birth_date: data.birth_date,
            note: data.note,
            user_id: data.user_id,
          })
          .select('*')
          .single();
        
        if (error) {
          return { error: error.message };
        }
        
        return { data: customer as Customer };
      } else {
        // Create new user if this is a CustomerWithUserFormData
        if ('password' in data) {
          // Handle user creation for CustomerWithUserFormData
          // This would typically involve auth service to create a user account
          // For now, create a placeholder implementation
          const userData = {
            email: data.email,
            first_name: data.firstName || '',
            last_name: data.lastName || '',
            phone: data.phone,
            gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : 'other',
            birth_date: data.birth_date,
            note: data.note,
          };
          
          // Create customer without user_id for now
          const { data: customer, error } = await supabase
            .from('customers')
            .insert({
              name: data.name,
              full_name: data.full_name || data.name,
              email: data.email,
              phone: data.phone,
              gender: userData.gender,
              birth_date: data.birth_date,
              note: data.note,
            })
            .select('*')
            .single();
            
          if (error) {
            return { error: error.message };
          }
          
          return { data: customer as Customer };
        } else {
          // Regular customer without user account
          const { data: customer, error } = await supabase
            .from('customers')
            .insert({
              name: data.name,
              full_name: data.full_name || data.name,
              email: data.email,
              phone: data.phone,
              gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : 'other',
              birth_date: data.birth_date,
              note: data.note,
            })
            .select('*')
            .single();
            
          if (error) {
            return { error: error.message };
          }
          
          return { data: customer as Customer };
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  getAll: async (): Promise<ApiResponse<Customer[]>> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
        
      if (error) {
        return { error: error.message };
      }
      
      return { data: data as Customer[] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Customer>> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      return { data: data as Customer };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  update: async (id: string, data: Partial<CustomerFormData>): Promise<ApiResponse<Customer>> => {
    try {
      const { data: customer, error } = await supabase
        .from('customers')
        .update({
          name: data.name,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : undefined,
          birth_date: data.birth_date,
          note: data.note,
        })
        .eq('id', id)
        .select('*')
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      return { data: customer as Customer };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { error: errorMessage };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
        
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
