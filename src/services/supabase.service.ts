import {
  Customer,
  Service,
  Product,
  Appointment,
  AppointmentCreate,
} from "@/models/types";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { config } from "@/config/env";
import { supabase } from "@/integrations/supabase/client";

class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Use the existing supabase client instead of creating a new one
    this.supabase = supabase;
  }

  // Method to upload image to Supabase storage
  async uploadImage(file: File, storagePath: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase.storage
        .from("images") // Replace 'your-bucket-name' with your actual bucket name
        .upload(`${storagePath}/${file.name}`, file, {
          cacheControl: "3600",
          upsert: false, // Set to true if you want to overwrite existing files
        });

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      // Construct public URL using supabase URL from the client
      const imageUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/object/public/images/${storagePath}/${file.name}`;
      return imageUrl;
    } catch (error) {
      console.error("Error during image upload:", error);
      return null;
    }
  }

  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await this.supabase.from("services").select("*");

      if (error) throw error;

      return data as Service[];
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      const { data, error } = await this.supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Service;
    } catch (error) {
      console.error("Error fetching service:", error);
      return null;
    }
  }

  async createService(
    service: Omit<Service, "id" | "created_at" | "updated_at">
  ): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from("services")
        .insert([service])
        .select()
        .single();

      if (error) throw error;

      return data as Service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  }

  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    try {
      const { data, error } = await this.supabase
        .from("services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data as Service;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  }

  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  }

  // Products related methods
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await this.supabase.from("products").select("*");

      if (error) throw error;

      return { data: data as Product[] };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { error: String(error) };
    }
  }

  async getServiceProducts(serviceId: number): Promise<ApiResponse<Product[]>> {
    try {
      const { data, error } = await this.supabase
        .from("service_products")
        .select("product_id")
        .eq("service_id", serviceId);

      if (error) throw error;

      if (data.length === 0) {
        return { data: [] };
      }

      const productIds = data.map((item) => item.product_id);

      const { data: products, error: productsError } = await this.supabase
        .from("products")
        .select("*")
        .in("id", productIds);

      if (productsError) throw productsError;

      return { data: products as Product[] };
    } catch (error) {
      console.error("Error fetching service products:", error);
      return { error: String(error) };
    }
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await this.supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return { data: data as Product };
    } catch (error) {
      console.error("Error fetching product:", error);
      return { error: String(error) };
    }
  }

  async createProduct(
    product: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    try {
      // Convert stock_quantity to stock if present
      const productData = {
        ...product,
        stock: product.stock_quantity || 0,
      };

      // Remove stock_quantity since it doesn't exist in the database
      delete productData.stock_quantity;

      const { data, error } = await this.supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      return { data: data as Product };
    } catch (error) {
      console.error("Error creating product:", error);
      return { error: String(error) };
    }
  }

  async updateProduct(
    id: number,
    updates: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    try {
      // Convert stock_quantity to stock if present
      const productData = {
        ...updates,
        stock:
          updates.stock_quantity !== undefined
            ? updates.stock_quantity
            : undefined,
      };

      // Remove stock_quantity since it doesn't exist in the database
      delete productData.stock_quantity;

      const { data, error } = await this.supabase
        .from("products")
        .update(productData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return { data: data as Product };
    } catch (error) {
      console.error("Error updating product:", error);
      return { error: String(error) };
    }
  }

  async deleteProduct(id: number): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await this.supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { data: true };
    } catch (error) {
      console.error("Error deleting product:", error);
      return { error: String(error) };
    }
  }

  // Customer methods
  getCustomers = async () => {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("role", "customer");

      if (error) throw error;

      // Map the customer data to match Customer interface
      const customers = data.map((customer) => ({
        id: customer.id,
        name: customer.full_name,
        email: customer.email || "",
        phone: customer.phone || "",
        gender: customer.gender || "other",
        birth_date: customer.birth_date || "",
        note: customer.note || "",
        created_at: customer.created_at || "",
        updated_at: customer.updated_at || "",
        lastVisit: "",
        totalSpent: 0,
      }));

      return customers as Customer[];
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };

  getCustomerById = async (id: string) => {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("role", "customer")
        .single();

      if (error) throw error;

      // Map the customer data to match Customer interface
      const customer = {
        id: data.id,
        name: data.full_name,
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "other",
        birth_date: data.birth_date || "",
        note: data.note || "",
        created_at: data.created_at || "",
        updated_at: data.updated_at || "",
        lastVisit: "",
        totalSpent: 0,
      };

      return customer as Customer;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };

  async createCustomer(customer: Customer): Promise<Customer> {
    try {
      // Transform the frontend Customer model to match the database schema
      const dbCustomer = {
        full_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        gender: customer.gender,
        birth_date: customer.birth_date || null,
        note: customer.note || "",
        user_id: customer.user_id || null,
        role: "customer",
      };

      const { data, error } = await this.supabase
        .from("users")
        .insert([dbCustomer])
        .select()
        .single();

      if (error) throw error;

      // Transform the database response back to the frontend Customer model
      return {
        id: data.id,
        name: data.full_name,
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "other",
        lastVisit: "",
        totalSpent: 0,
        birth_date: data.birth_date || "",
        note: data.note || "",
        created_at: data.created_at || "",
        updated_at: data.updated_at || "",
      } as Customer;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updates: Partial<Customer>
  ): Promise<Customer> {
    try {
      // Transform the frontend Customer model to match the database schema
      const dbUpdates: DatabaseCustomerUpdate = {};

      if (updates.name) dbUpdates.full_name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.birth_date !== undefined)
        dbUpdates.birth_date = updates.birth_date;
      if (updates.note !== undefined) dbUpdates.note = updates.note;

      const { data, error } = await this.supabase
        .from("users")
        .update(dbUpdates)
        .eq("id", id)
        .eq("role", "customer")
        .select()
        .single();

      if (error) throw error;

      // Transform the database response back to the frontend Customer model
      return {
        id: data.id,
        name: data.full_name,
        email: data.email || "",
        phone: data.phone || "",
        gender: data.gender || "other",
        lastVisit: "",
        totalSpent: 0,
        birth_date: data.birth_date || "",
        note: data.note || "",
        created_at: data.created_at || "",
        updated_at: data.updated_at || "",
      } as Customer;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("users")
        .delete()
        .eq("id", id)
        .eq("role", "customer");

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting customer:", error);
      throw error;
    }
  }

  getAppointments = async () => {
    try {
      const { data, error } = await this.supabase.from("appointments").select(`
        *,
        appointment_services(*)
      `);

      if (error) throw error;

      // Process the appointments data
      const appointments = await Promise.all(
        data.map(async (appointment) => {
          try {
            // Fetch customer data separately
            const { data: customerData, error: customerError } =
              await this.supabase
                .from("users")
                .select("*")
                .eq("id", appointment.customer_user_id)
                .eq("role", "customer")
                .single();

            if (customerError) {
              console.error("Error fetching customer data:", customerError);
              return {
                ...appointment,
                customer: {
                  name: "Unknown",
                  phone: "Unknown",
                  full_name: "Unknown",
                },
              };
            }

            return {
              ...appointment,
              customer: {
                name: customerData?.full_name || "Unknown",
                phone: customerData?.phone || "Unknown",
                full_name: customerData?.full_name || "Unknown",
              },
            };
          } catch (error) {
            console.error("Error fetching customer for appointment:", error);
            return {
              ...appointment,
              customer: {
                name: "Unknown",
                phone: "Unknown",
                full_name: "Unknown",
              },
            };
          }
        })
      );

      return appointments;
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  };

  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const { data, error } = await this.supabase
        .from("appointments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return data as Appointment;
    } catch (error) {
      console.error("Error fetching appointment:", error);
      return null;
    }
  }

  async createAppointments(
    appointment: AppointmentCreate
  ): Promise<Appointment> {
    try {
      const { data, error } = await this.supabase
        .from("appointments")
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;

      return data as Appointment;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  }

  async updateAppointments(
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    try {
      const { data, error } = await this.supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data as Appointment;
    } catch (error) {
      console.error("Error updating appointment:", error);
      throw error;
    }
  }

  async deleteAppointments(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from("appointments")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      throw error;
    }
  }
}

// Create and export the supabaseService instance
export const supabaseService = new SupabaseService();

// Define the ApiResponse interface if not already defined elsewhere
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface DatabaseCustomerUpdate {
  full_name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  birth_date?: string | null;
  note?: string;
}
