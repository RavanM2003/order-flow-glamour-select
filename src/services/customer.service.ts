
import { Customer, CustomerFormData } from '@/models/customer.model'; 
import { UserCredentials, CustomerWithUserFormData } from '@/models/user.model';
import { supabase } from '@/integrations/supabase/client';

// Define the ApiResponse interface for consistent return types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get all customers
 */
export async function getCustomers(): Promise<ApiResponse<Customer[]>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'customer');

    if (error) throw error;

    // Map the customer data to match Customer interface
    const customers = data.map((customer) => ({
      id: customer.id,
      name: customer.full_name || '',
      full_name: customer.full_name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      gender: customer.gender || 'other',
      birth_date: customer.birth_date || '',
      note: customer.note || '',
      created_at: customer.created_at || '',
      updated_at: customer.updated_at || '',
      user_id: customer.id,
      lastVisit: '',  // These fields would be populated from appointment data
      totalSpent: 0
    }));

    return { data: customers };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .eq('role', 'customer')
      .single();

    if (error) throw error;

    // Map the customer data to match Customer interface
    const customer: Customer = {
      id: data.id,
      name: data.full_name || '',
      full_name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender || 'other',
      birth_date: data.birth_date || '',
      note: data.note || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      user_id: data.id,
      lastVisit: '',  // These fields would be populated from appointment data
      totalSpent: 0
    };

    return { data: customer };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(customerData: CustomerFormData): Promise<ApiResponse<Customer>> {
  try {
    // Transform the frontend CustomerFormData model to match the database schema
    const dbCustomer = {
      full_name: customerData.name || customerData.full_name,
      email: customerData.email,
      phone: customerData.phone,
      gender: customerData.gender || 'other',
      birth_date: customerData.birth_date || null,
      note: customerData.note || '',
      role: 'customer',
    };

    const { data, error } = await supabase
      .from('users')
      .insert([dbCustomer])
      .select()
      .single();

    if (error) throw error;

    // Transform the database response back to the frontend Customer model
    const customer: Customer = {
      id: data.id,
      name: data.full_name || '',
      full_name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender || 'other',
      birth_date: data.birth_date || '',
      note: data.note || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      user_id: data.id,
      lastVisit: '',
      totalSpent: 0
    };

    return { data: customer };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(id: string, updates: Partial<CustomerFormData>): Promise<ApiResponse<Customer>> {
  try {
    // Transform the frontend CustomerFormData model to match the database schema
    const dbUpdates: any = {};

    if (updates.name || updates.full_name) dbUpdates.full_name = updates.name || updates.full_name;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.birth_date !== undefined) dbUpdates.birth_date = updates.birth_date;
    if (updates.note !== undefined) dbUpdates.note = updates.note;

    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', id)
      .eq('role', 'customer')
      .select()
      .single();

    if (error) throw error;

    // Transform the database response back to the frontend Customer model
    const customer: Customer = {
      id: data.id,
      name: data.full_name || '',
      full_name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      gender: data.gender || 'other',
      birth_date: data.birth_date || '',
      note: data.note || '',
      created_at: data.created_at || '',
      updated_at: data.updated_at || '',
      user_id: data.id,
      lastVisit: '',
      totalSpent: 0
    };

    return { data: customer };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Delete a customer by ID
 */
export async function deleteCustomer(id: string): Promise<ApiResponse<boolean>> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
      .eq('role', 'customer');

    if (error) throw error;
    return { data: true };
  } catch (error) {
    return { error: String(error) };
  }
}

/**
 * Create a customer with a user account
 */
export async function createCustomerWithUser(formData: CustomerWithUserFormData): Promise<ApiResponse<Customer>> {
  try {
    // First create the user account with auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password || 'defaultPassword123', // Should require password
    });

    if (authError) throw authError;
    
    // If user was created successfully, add the customer record
    if (authData && authData.user) {
      const customerData: CustomerFormData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        birth_date: formData.birth_date,
        note: formData.note
      };
      
      const result = await createCustomer(customerData);
      return result;
    }
    
    throw new Error('Failed to create user account');
  } catch (error) {
    return { error: String(error) };
  }
}

// Export as customerService object
export const customerService = {
  getAll: getCustomers,
  getById: getCustomerById,
  create: createCustomer,
  update: updateCustomer,
  delete: deleteCustomer,
  createWithUser: createCustomerWithUser
};
