
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  user_id?: string;
  lastVisit?: string;
  totalSpent?: number;
  full_name?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  address?: string;
};
