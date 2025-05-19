
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
  relatedProducts?: number[];
  image_urls?: string[]; // Added this field
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number; // Ensure this is a number
  price: number;
  benefits?: string[];
  relatedProducts?: number[];
  category_id?: number;
  image_urls?: string[]; // Added this field
}
