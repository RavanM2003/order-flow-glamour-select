import { Appointment, AppointmentCreate, Customer, Service } from '@/models/types';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
  }

  // Method to upload image to Supabase storage
  async uploadImage(file: File, storagePath: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from('images') // Replace 'your-bucket-name' with your actual bucket name
        .upload(`${storagePath}/${file.name}`, file, {
          cacheControl: '3600',
          upsert: false // Set to true if you want to overwrite existing files
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Construct public URL
      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.Key}`;
      return imageUrl;
    } catch (error) {
      console.error('Error during image upload:', error);
      return null;
    }
  }
  
  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      
      return data as Service[];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Service;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  }
  
  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .insert([service])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Service;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }
  
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Service;
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }
  
  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  getCustomers = async () => {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;

      // Make sure we handle the conversion properly
      const customers = data.map(customer => ({
        id: customer.id,
        name: customer.full_name, // Map full_name to name for compatibility
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        birth_date: customer.birth_date,
        note: customer.note,
        created_at: customer.created_at,
        updated_at: customer.updated_at,
        lastVisit: '', // Default value
        totalSpent: 0 // Default value
        // Add any other required fields from Customer interface
      }));
      
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  };

  getCustomerById = async (id: string) => {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;

      // Properly map the customer data
      const customer = {
        id: data.id,
        name: data.full_name, // Map full_name to name for compatibility
        email: data.email,
        phone: data.phone,
        gender: data.gender,
        birth_date: data.birth_date,
        note: data.note,
        created_at: data.created_at,
        updated_at: data.updated_at,
        lastVisit: '', // Default value
        totalSpent: 0 // Default value
        // Add any other required fields from Customer interface
      };
      
      return customer;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  };
  
  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }
  
  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }
  
  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  getAppointments = async () => {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .select(`
        *,
        appointment_services(*)
      `);
    
      if (error) throw error;

      // Process the appointments data
      const appointments = await Promise.all(data.map(async (appointment) => {
        try {
          // Fetch customer data separately
          const { data: customerData, error: customerError } = await this.supabase
            .from('customers')
            .select('*')
            .eq('id', appointment.customer_user_id)
            .single();
        
          if (customerError) throw customerError;
        
          return {
            ...appointment,
            customer: {
              name: customerData.full_name,
              phone: customerData.phone,
              full_name: customerData.full_name
            }
          };
        } catch (error) {
          console.error('Error fetching customer for appointment:', error);
          return {
            ...appointment,
            customer: { name: 'Unknown', phone: 'Unknown', full_name: 'Unknown' }
          };
        }
      }));
    
      return appointments;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  };
  
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return data as Appointment;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
  }
    
  async createAppointments(appointment: AppointmentCreate): Promise<Appointment> {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }
    
  async updateAppointments(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Appointment;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }
    
  async deleteAppointments(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('appointments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
}

export const supabaseService = new SupabaseService();
