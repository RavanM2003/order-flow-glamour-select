
// Customer model and related types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: "female" | "male" | "other" | string;
  lastVisit: string;
  totalSpent: number;
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
