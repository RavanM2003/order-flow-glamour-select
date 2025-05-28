
import { Customer, CustomerFormData } from '@/models/customer.model';
import { CustomerWithUserFormData } from '@/models/user.model';
import { ApiResponse } from './staff.service';
import { supabase } from '@/integrations/supabase/client';

export const customerService = {
  create: async (data: CustomerFormData | CustomerWithUserFormData): Promise<ApiResponse<Customer>> => {
    try {
      const customerData = {
        email: data.email,
        first_name: (data as any).first_name || '',
        last_name: (data as any).last_name || '',
        full_name: (data as any).full_name || data.name,
        phone: data.phone,
        gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : 'other',
        birth_date: (data as any).birth_date,
        note: (data as any).note || data.notes,
        role: 'customer',
        hashed_password: '',
      };
      
      const { data: customer, error } = await supabase
        .from('users')
        .insert(customerData)
        .select('*')
        .single();
      
      if (error) {
        return { error: error.message };
      }
      
      const customerResponse: Customer = {
        id: customer.id,
        name: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        lastVisit: '',
        totalSpent: 0,
        full_name: customer.full_name,
        first_name: customer.first_name,
        last_name: customer.last_name,
        birth_date: customer.birth_date,
        note: customer.note,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
      };
      
      return { data: customerResponse };
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
      
      const customers: Customer[] = data.map(user => ({
        id: user.id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        lastVisit: '',
        totalSpent: 0,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
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
      
      const customer: Customer = {
        id: data.id,
        name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        lastVisit: '',
        totalSpent: 0,
        full_name: data.full_name,
        first_name: data.first_name,
        last_name: data.last_name,
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
      const updateData = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        gender: data.gender === 'male' || data.gender === 'female' || data.gender === 'other' ? data.gender : undefined,
        birth_date: (data as any).birth_date,
        note: data.notes || (data as any).note,
      };
      
      const { data: user, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .eq('role', 'customer')
        .select('*')
        .single();
        
      if (error) {
        return { error: error.message };
      }
      
      const customer: Customer = {
        id: user.id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        lastVisit: '',
        totalSpent: 0,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
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
      const { error } = await supabase
        .from('users')
        .update({ role: 'customer' })
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
