
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
