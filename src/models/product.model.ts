
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  category?: string;
  image_url?: string;
  isServiceRelated?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number; 
  category: string;
  image_url: string;
  isServiceRelated: boolean;
}
