
import { config, currentEnv } from '@/config/env';
import { mockCustomers, mockAppointments, mockServices, mockProducts, mockStaff } from './mock-data';

// Define API endpoints with environment awareness
export const API = {
  customers: {
    list: async () => {
      if (config.usesMockData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: [...mockCustomers] };
      }
      
      // Real API implementation for test/production
      try {
        const response = await fetch(`${config.apiBaseUrl}/customers`);
        if (!response.ok) throw new Error('Failed to fetch customers');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    get: async (id: number | string) => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const customer = mockCustomers.find(c => c.id === Number(id));
        return { data: customer ? {...customer} : null };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/customers/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch customer ${id}`);
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    create: async (customer: any) => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newCustomer = { 
          ...customer, 
          id: Math.max(0, ...mockCustomers.map(c => c.id)) + 1,
          lastVisit: new Date().toISOString().split('T')[0],
          totalSpent: 0 
        };
        mockCustomers.unshift(newCustomer);
        return { data: {...newCustomer} };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer)
        });
        if (!response.ok) throw new Error('Failed to create customer');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    update: async (id: number | string, customer: any) => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = mockCustomers.findIndex(c => c.id === Number(id));
        if (index >= 0) {
          mockCustomers[index] = { ...mockCustomers[index], ...customer };
          return { data: {...mockCustomers[index]} };
        }
        return { error: 'Customer not found' };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/customers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer)
        });
        if (!response.ok) throw new Error(`Failed to update customer ${id}`);
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  appointments: {
    list: async () => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { data: [...mockAppointments] };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/appointments`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    getByCustomer: async (customerId: number | string) => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const appointments = mockAppointments.filter(a => 
          a.customerId === Number(customerId)
        );
        return { data: [...appointments] };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/customers/${customerId}/appointments`);
        if (!response.ok) throw new Error(`Failed to fetch appointments for customer ${customerId}`);
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    
    create: async (appointment: any) => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const newAppointment = { 
          ...appointment, 
          id: Math.max(0, ...mockAppointments.map(a => a.id)) + 1,
          date: appointment.date || new Date().toISOString().split('T')[0],
          status: 'pending'
        };
        mockAppointments.push(newAppointment);
        return { data: {...newAppointment} };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointment)
        });
        if (!response.ok) throw new Error('Failed to create appointment');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  services: {
    list: async () => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 250));
        return { data: [...mockServices] };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  products: {
    list: async () => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 250));
        return { data: [...mockProducts] };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  },
  
  staff: {
    list: async () => {
      if (config.usesMockData) {
        await new Promise(resolve => setTimeout(resolve, 250));
        return { data: [...mockStaff] };
      }
      
      try {
        const response = await fetch(`${config.apiBaseUrl}/staff`);
        if (!response.ok) throw new Error('Failed to fetch staff');
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  }
};
