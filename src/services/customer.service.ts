
import { supabase } from '@/integrations/supabase/client';
import { Customer, CustomerFormData } from '@/models/customer.model';
import { CustomerWithUserFormData } from '@/models/user.model';
import { ApiResponse } from '@/models/types';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer');

      if (error) throw error;
      return data.map((item: any) => ({
        id: item.id,
        name: item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        gender: item.gender,
        birth_date: item.birth_date,
        note: item.note,
        created_at: item.created_at,
        updated_at: item.updated_at,
        lastVisit: item.created_at,
        totalSpent: 0,
      }));
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        id: data.id,
        name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastVisit: data.created_at,
        totalSpent: 0,
      };
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  },

  create: async (customerData: CustomerFormData): Promise<Customer | null> => {
    try {
      // When creating a customer, we're actually creating a user with the role 'customer'
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: customerData.email,
          phone: customerData.phone,
          full_name: customerData.full_name || customerData.name,
          gender: customerData.gender,
          birth_date: customerData.birth_date,
          note: customerData.note,
          role: 'customer',
          hashed_password: 'default-password' // In a real app, use a proper password hashing mechanism
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastVisit: data.created_at,
        totalSpent: 0,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return null;
    }
  },

  update: async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          email: customerData.email,
          phone: customerData.phone,
          full_name: customerData.full_name || customerData.name,
          gender: customerData.gender,
          birth_date: customerData.birth_date,
          note: customerData.note,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.full_name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastVisit: data.created_at,
        totalSpent: 0,
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
  },

  createCustomer: async (data: CustomerFormData): Promise<ApiResponse<Customer>> => {
    try {
      const customer = await customerService.create(data);
      return { data: customer || undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getCustomers: async (): Promise<ApiResponse<Customer[]>> => {
    try {
      const customers = await customerService.getAll();
      return { data: customers };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  getCustomerById: async (id: string): Promise<ApiResponse<Customer>> => {
    try {
      const customer = await customerService.getById(id);
      return { data: customer || undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  updateCustomer: async (id: string, data: Partial<CustomerFormData>): Promise<ApiResponse<Customer>> => {
    try {
      const customer = await customerService.update(id, data);
      return { data: customer || undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  deleteCustomer: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const result = await customerService.delete(id);
      return { data: result };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  createBulkCustomers: async (customers: CustomerFormData[]): Promise<ApiResponse<Customer[]>> => {
    try {
      const insertData = customers.map(customer => ({
        email: customer.email,
        phone: customer.phone,
        full_name: customer.full_name || customer.name,
        gender: customer.gender,
        birth_date: customer.birth_date,
        note: customer.note,
        role: 'customer',
        hashed_password: 'default-password' // In a real app, use a proper password hashing mechanism
      }));

      const { data, error } = await supabase
        .from('users')
        .insert(insertData)
        .select();

      if (error) throw error;

      const createdCustomers = data.map((item: any) => ({
        id: item.id,
        name: item.full_name || `${item.first_name || ''} ${item.last_name || ''}`.trim(),
        full_name: item.full_name,
        email: item.email,
        phone: item.phone,
        gender: item.gender,
        birth_date: item.birth_date,
        note: item.note,
        created_at: item.created_at,
        updated_at: item.updated_at,
        lastVisit: item.created_at,
        totalSpent: 0,
      }));

      return { data: createdCustomers };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

export * from './auth.service';
