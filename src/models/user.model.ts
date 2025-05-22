
export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'staff' 
  | 'customer' 
  | 'cash' 
  | 'appointment' 
  | 'service' 
  | 'product' 
  | 'reception';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  birth_date?: string;
  created_at?: string;
  updated_at?: string;
  gender?: 'male' | 'female' | 'other';
  role?: UserRole;
  phone?: string;
  note?: string;
  staffId?: string; // Add for compatibility with auth.service
  token?: string; // Add for compatibility with AuthResponse

  // These are mappings for compatibility with the existing User type
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
  isActive?: boolean;
}

// Add missing types
export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: any;
  error: string | null;
  token?: string; // Add for compatibility with auth.service
}

export interface CustomerWithUserFormData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  password?: string;
  firstName?: string; // Add for compatibility
  lastName?: string;  // Add for compatibility
}
