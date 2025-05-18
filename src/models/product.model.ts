
// Product model and related types
export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  image_url?: string | null;
  stock_quantity?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  isServiceRelated?: boolean; // Client-side flag to identify service-related products
}

export interface ProductFormData {
  name: string;
  price: number;
  description?: string;
  stock_quantity?: number;
  category?: string;
  image_url?: string | null;
  isServiceRelated?: boolean;
}
