
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
  role?: 'admin' | 'customer' | 'staff';
  phone?: string;
  note?: string;

  // These are mappings for compatibility with the existing User type
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
  isActive?: boolean;
}
