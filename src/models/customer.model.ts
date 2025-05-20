
// Customer model and related types
export interface Customer {
  id: string | number; // Updated to match UUID type from database
  name: string;
  email: string;
  phone: string;
  gender: "female" | "male" | "other" | string;
  lastVisit: string;
  totalSpent: number;
  // Additional fields matching database schema
  full_name?: string;
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
  gender: string;
}

// Customer filters
export interface CustomerFilters {
  search?: string;
  gender?: string;
  sortBy?: "name" | "lastVisit" | "totalSpent";
  sortOrder?: "asc" | "desc";
}
