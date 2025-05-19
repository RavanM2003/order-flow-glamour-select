
export interface Service {
  id: number; 
  name: string;
  description?: string;
  duration: number; // Duration in minutes (must be number type)
  price: number;
  benefits?: string[];
  category_id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  image_urls?: string[];
  relatedProducts?: number[];
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number; // Ensure this is a number
  price: number;
  image_urls?: string[];
  benefits?: string[];
  relatedProducts?: number[];
  category_id?: number;
}
