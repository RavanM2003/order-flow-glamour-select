
import { ApiService } from './api.service';
import { Customer, CustomerFormData } from '@/models/customer.model';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { mockCustomers } from '@/lib/mock-data';

export class CustomerService extends ApiService {
  // Get all customers
  async getAll(): Promise<ApiResponse<Customer[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: [...mockCustomers] };
    }
    
    return this.get<Customer[]>('/customers');
  }
  
  // Get a single customer by id
  async getById(id: number | string): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const customer = mockCustomers.find(c => c.id === Number(id));
      return { data: customer ? {...customer} : undefined, error: customer ? undefined : 'Customer not found' };
    }
    
    return this.get<Customer>(`/customers/${id}`);
  }
  
  // Create a new customer
  async create(customer: CustomerFormData): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCustomer = { 
        ...customer, 
        id: Math.max(0, ...mockCustomers.map(c => c.id)) + 1,
        lastVisit: new Date().toISOString().split('T')[0],
        totalSpent: 0 
      };
      mockCustomers.unshift(newCustomer as Customer);
      return { data: {...newCustomer} as Customer };
    }
    
    return this.post<Customer>('/customers', customer);
  }
  
  // Update an existing customer
  async update(id: number | string, customer: CustomerFormData): Promise<ApiResponse<Customer>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockCustomers.findIndex(c => c.id === Number(id));
      if (index >= 0) {
        mockCustomers[index] = { ...mockCustomers[index], ...customer };
        return { data: {...mockCustomers[index]} };
      }
      return { error: 'Customer not found' };
    }
    
    return this.put<Customer>(`/customers/${id}`, customer);
  }
  
  // Delete a customer
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockCustomers.findIndex(c => c.id === Number(id));
      if (index >= 0) {
        mockCustomers.splice(index, 1);
        return { data: true };
      }
      return { error: 'Customer not found' };
    }
    
    return this.delete<boolean>(`/customers/${id}`);
  }
}

// Create a singleton instance
export const customerService = new CustomerService();
