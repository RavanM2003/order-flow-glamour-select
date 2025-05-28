
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  lastVisit: string;
  totalSpent: number;
  notes?: string; // Added notes field
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  notes?: string;
}
