
export interface Service {
  id: number; // Changed from optional to required for consistency with usage in service
  name: string;
  description?: string;
  duration: number; // Duration in minutes (must be number type)
  price: number;
  image_urls?: string[];
  benefits?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
}
