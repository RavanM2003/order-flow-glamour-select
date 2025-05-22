
export interface Customer {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
  lastVisit?: string;
  totalSpent?: number;
}

export interface CustomerFormData {
  name: string;
  full_name?: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
}
