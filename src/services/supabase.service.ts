
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFormData } from "@/models/product.model";
import { Service } from "@/models/service.model";
import { Customer } from "@/models/customer.model";
import { Staff } from "@/models/staff.model";
import { Appointment } from "@/models/appointment.model";
import { ApiResponse } from "@/models/types";

// Supabase service to handle all database operations
export class SupabaseService {
  // Products
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      
      return { data: data as unknown as Product[] };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { error: 'Failed to fetch products', data: null };
    }
  }
  
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as unknown as Product };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return { error: `Failed to fetch product ${id}`, data: null };
    }
  }
  
  async createProduct(product: ProductFormData): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
          description: product.description,
          stock_quantity: product.stock_quantity || 0,
          image_url: product.image_url ? product.image_url : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: data as unknown as Product };
    } catch (error) {
      console.error('Error creating product:', error);
      return { error: 'Failed to create product', data: null };
    }
  }
  
  async updateProduct(id: number, product: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          price: product.price,
          description: product.description,
          stock_quantity: product.stock_quantity,
          image_url: product.image_url,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: data as unknown as Product };
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      return { error: `Failed to update product ${id}`, data: null };
    }
  }
  
  async deleteProduct(id: number): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      return { error: `Failed to delete product ${id}`, data: null };
    }
  }

  // Services
  async getServiceProducts(serviceId: number): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await supabase
        .from('service_products')
        .select('product_id')
        .eq('service_id', serviceId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const productIds = data.map(item => item.product_id);
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
        
        if (productsError) throw productsError;
        
        return { data: products as unknown as Product[] };
      }
      
      return { data: [] };
    } catch (error) {
      console.error(`Error fetching products for service ${serviceId}:`, error);
      return { error: `Failed to fetch products for service ${serviceId}`, data: null };
    }
  }

  // Customers
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;
      
      // Add calculated fields for frontend
      const customersWithExtras = data.map(customer => ({
        ...customer,
        lastVisit: new Date().toISOString().split('T')[0], // Default to today
        totalSpent: 0 // Default to 0
      }));
      
      return { data: customersWithExtras as Customer[] };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return { error: 'Failed to fetch customers', data: null };
    }
  }
  
  async getCustomerById(id: number): Promise<ApiResponse<Customer>> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Add calculated fields for frontend
      const customerWithExtras = {
        ...data,
        lastVisit: new Date().toISOString().split('T')[0], // Default to today
        totalSpent: 0 // Default to 0
      };
      
      return { data: customerWithExtras as Customer };
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      return { error: `Failed to fetch customer ${id}`, data: null };
    }
  }

  // Appointments
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(name, phone),
          appointment_services(
            *,
            services(name, price, duration),
            products(name, price),
            staff(name, position)
          )
        `);
      
      if (error) throw error;
      
      // Transform the data to match our frontend model
      const appointments = data.map(appointment => {
        const services = appointment.appointment_services
          .filter((as: any) => as.service_id)
          .map((as: any) => ({
            id: as.service_id,
            name: as.services?.name || '',
            price: as.services?.price || 0,
            duration: as.services?.duration || 0
          }));
        
        const products = appointment.appointment_services
          .filter((as: any) => as.product_id)
          .map((as: any) => ({
            id: as.product_id,
            name: as.products?.name || '',
            price: as.products?.price || 0,
            quantity: as.quantity || 1
          }));
        
        const serviceProviders = appointment.appointment_services
          .filter((as: any) => as.staff_id)
          .map((as: any) => ({
            id: as.staff_id,
            name: as.staff?.name || '',
            serviceId: as.service_id
          }));

        return {
          id: appointment.id,
          customerId: appointment.customer_id,
          date: appointment.appointment_date,
          startTime: appointment.start_time,
          endTime: appointment.end_time,
          status: appointment.status,
          customerName: appointment.customers?.name || '',
          customerPhone: appointment.customers?.phone || '',
          services,
          products,
          serviceProviders,
          createdAt: appointment.created_at
        };
      });
      
      return { data: appointments as unknown as Appointment[] };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { error: 'Failed to fetch appointments', data: null };
    }
  }

  // Staff
  async getStaff(): Promise<ApiResponse<Staff[]>> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');
      
      if (error) throw error;
      
      // Transform specializations from JSONB to string[]
      const staffWithParsedSpecializations = data.map(staff => ({
        ...staff,
        specializations: staff.specializations ? JSON.parse(staff.specializations as string) : []
      }));
      
      return { data: staffWithParsedSpecializations as unknown as Staff[] };
    } catch (error) {
      console.error('Error fetching staff:', error);
      return { error: 'Failed to fetch staff', data: null };
    }
  }
}

// Create a singleton instance
export const supabaseService = new SupabaseService();
