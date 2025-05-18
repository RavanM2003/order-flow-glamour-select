
export interface Service {
  id?: number;
  name: string;
  description?: string;
  price: number;
  duration: number;
  image_urls?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  benefits?: string[];
  relatedProducts?: number[];
}

export interface ServiceFormData {
  name: string;
  description?: string;
  price: number;
  duration: number;
  image_urls?: string[];
  benefits?: string[];
  relatedProducts?: number[];
}

export interface ServiceProvider {
  id: number;
  name: string;
  serviceId?: number;
  specializations?: string[];
}
