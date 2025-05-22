
// Staff model and related types
export interface Staff {
  id: string; // Updated to match context definition (string)
  name: string;
  position?: string;
  specializations?: number[];
  avatar_url?: string;
  // Additional fields matching database schema
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StaffFormData {
  user_id: string;
  position?: string;
  specializations?: number[];
}

// Staff filters
export interface StaffFilters {
  search?: string;
  position?: string;
  specialization?: number;
  sortBy?: "name" | "position";
  sortOrder?: "asc" | "desc";
}
