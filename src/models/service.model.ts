
export interface Service {
  id?: number;
  name: string;
  description?: string;
  duration: number; // Duration in minutes
  price: number;
  image_urls?: string[];
  benefits?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  duration: number;
  price: number;
  image_urls?: string[];
  benefits?: string[];
  relatedProducts?: number[];
}
