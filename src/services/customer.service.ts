import { ApiResponse, Customer } from '@/models/types';
import { ApiService } from './api.service';
import { authService } from './auth.service';
import { supabaseService } from './supabase.service';
import { CustomerWithUserFormData } from '@/models/user.model';

export class CustomerService extends ApiService {
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    try {
      const customers = await supabaseService.getCustomers();
      return { data: customers };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch customers' };
    }
  }

  async getCustomerById(id: string): Promise<ApiResponse<Customer>> {
    try {
      const customer = await supabaseService.getCustomerById(id);
      if (!customer) {
        return { error: 'Customer not found' };
      }
      return { data: customer };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch customer' };
    }
  }

  async createCustomer(customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    try {
      // Prepare customer data for Supabase
      const supabaseCustomerData = {
        ...customerData,
        // Combine first and last name for full_name field in Supabase
        full_name: `${customerData.name}`
      };
      
      // If we're creating a customer with a user account
      if (customerData.email && (customerData as any).createUser) {
        const userData = {
          email: customerData.email,
          password: 'default-password',
          role: 'guest'
        };
        
        const result = await authService.createCustomerWithUser(customerData, userData);
        if (result.error) {
          return { error: result.error };
        }
        
        return { 
          data: result.data.customer,
          message: 'Customer created with user account'
        };
      }
      
      // Otherwise create a customer without a user account
      const customer = await supabaseService.createCustomer(supabaseCustomerData as Customer);
      return { data: customer, message: 'Customer created successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create customer' };
    }
  }
  
  async createCustomerWithUser(formData: CustomerWithUserFormData): Promise<ApiResponse<any>> {
    try {
      // Create user and customer in one operation
      const result = await authService.createCustomerWithUser(formData, {
        email: formData.email,
        password: formData.password
      });
      
      return result;
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create customer with user account' };
    }
  }

  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> {
    try {
      // Prepare customer data for Supabase
      const supabaseCustomerData = {
        ...customerData,
        // Update full_name if name is provided
        ...(customerData.name && { full_name: customerData.name })
      };
      
      const customer = await supabaseService.updateCustomer(id, supabaseCustomerData as Partial<Customer>);
      return { data: customer, message: 'Customer updated successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to update customer' };
    }
  }

  async deleteCustomer(id: string): Promise<ApiResponse<boolean>> {
    try {
      await supabaseService.deleteCustomer(id);
      return { data: true, message: 'Customer deleted successfully' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to delete customer' };
    }
  }
}

export const customerService = new CustomerService();
