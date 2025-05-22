
// Product model and related types
export interface Product {
  id: number; // Make sure id is required and a number
  name: string;
  price: number;
  description?: string;
  stock?: number;
  // Additional fields matching database schema
  user_id?: string;
  details?: string;
  how_to_use?: string;
  ingredients?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description?: string;
  details?: string;
  how_to_use?: string;
  ingredients?: string;
}

// Product filters
export interface ProductFilters {
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "stock";
  sortOrder?: "asc" | "desc";
}
