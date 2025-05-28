
// Auto-generated database types based on current schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string;
          full_name: string | null;
          first_name: string | null;
          last_name: string | null;
          role: 'customer' | 'staff' | 'admin' | 'super_admin' | null;
          gender: 'male' | 'female' | 'other' | null;
          birth_date: string | null;
          avatar_url: string | null;
          bio: string | null;
          note: string | null;
          hashed_password: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          email?: string | null;
          phone: string;
          full_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'customer' | 'staff' | 'admin' | 'super_admin' | null;
          gender?: 'male' | 'female' | 'other' | null;
          birth_date?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          note?: string | null;
          hashed_password: string;
        };
        Update: {
          email?: string | null;
          phone?: string;
          full_name?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'customer' | 'staff' | 'admin' | 'super_admin' | null;
          gender?: 'male' | 'female' | 'other' | null;
          birth_date?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          note?: string | null;
          hashed_password?: string;
        };
      };
      services: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          duration: number;
          price: number;
          discount: number | null;
          benefits: string[] | null;
          category_id: number | null;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          name: string;
          description?: string | null;
          duration?: number;
          price?: number;
          discount?: number | null;
          benefits?: string[] | null;
          category_id?: number | null;
          user_id?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          duration?: number;
          price?: number;
          discount?: number | null;
          benefits?: string[] | null;
          category_id?: number | null;
          user_id?: string | null;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          price: number;
          stock: number;
          discount: number | null;
          details: string | null;
          ingredients: string | null;
          how_to_use: string | null;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          name: string;
          description?: string | null;
          price: number;
          stock: number;
          discount?: number | null;
          details?: string | null;
          ingredients?: string | null;
          how_to_use?: string | null;
          user_id?: string | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          price?: number;
          stock?: number;
          discount?: number | null;
          details?: string | null;
          ingredients?: string | null;
          how_to_use?: string | null;
          user_id?: string | null;
        };
      };
      appointments: {
        Row: {
          id: number;
          user_id: string | null;
          customer_user_id: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          total: number | null;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'no_show' | null;
          notes: string | null;
          cancel_reason: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id?: string | null;
          customer_user_id?: string | null;
          appointment_date: string;
          start_time: string;
          end_time: string;
          total?: number | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'no_show' | null;
          notes?: string | null;
          cancel_reason?: string | null;
        };
        Update: {
          user_id?: string | null;
          customer_user_id?: string | null;
          appointment_date?: string;
          start_time?: string;
          end_time?: string;
          total?: number | null;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress' | 'no_show' | null;
          notes?: string | null;
          cancel_reason?: string | null;
        };
      };
    };
    Functions: {
      get_appointment_summary: {
        Args: { appointment_id: number };
        Returns: {
          appointment_info: any;
          services_info: any;
          products_info: any;
          payment_info: any;
        }[];
      };
      check_staff_booking_conflict: {
        Args: {
          staff_id: string;
          appointment_date: string;
          start_time: string;
          end_time: string;
          exclude_appointment_id?: number;
        };
        Returns: boolean;
      };
      get_staff_by_service: {
        Args: { service_id: number };
        Returns: { user_id: string; full_name: string }[];
      };
      get_available_staff_by_service_and_date: {
        Args: { service_id: number; reservation_date: string };
        Returns: { user_id: string; full_name: string }[];
      };
      create_invoice_with_appointment: {
        Args: {
          p_invoice_number: string;
          p_total_amount: number;
          p_status: string;
          p_appointment_json: any;
        };
        Returns: any[];
      };
    };
  };
}

// Enhanced type definitions
export type UserRole = Database['public']['Tables']['users']['Row']['role'];
export type AppointmentStatus = Database['public']['Tables']['appointments']['Row']['status'];
export type Gender = Database['public']['Tables']['users']['Row']['gender'];

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status?: 'success' | 'error' | 'loading';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
