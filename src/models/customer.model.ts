
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  lastVisit: string;
  totalSpent: number;
  notes?: string;
  // Additional database fields
  full_name?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  note?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  notes?: string;
  // Additional fields for compatibility
  full_name?: string;
  first_name?: string;
  last_name?: string;
  birth_date?: string;
  note?: string;
}
