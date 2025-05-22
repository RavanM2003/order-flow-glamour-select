
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
}

export interface UserFormData {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birth_date?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: any;
  error: string | null;
  token?: string;
  expiresAt?: number;
}

export interface CustomerWithUserFormData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
}
