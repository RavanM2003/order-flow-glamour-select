export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number; // Match the database field name
  category?: string;
  image_url?: string;
  isServiceRelated?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  // Additional fields from database
  details?: string;
  ingredients?: string;
  how_to_use?: string;
  // For type compatibility
  stock_quantity?: number; // Alias for stock
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  stock_quantity: number; // Added to match the form field name
  category?: string;
  image_url?: string;
  isServiceRelated?: boolean;
}
