
// Service model and related types
export interface Service {
  id: number;
  name: string;
  price: number;
  duration?: string;
  description?: string;
  relatedProducts?: number[];
}

export interface ServiceFormData {
  name: string;
  price: number;
  duration?: string;
  description?: string;
  relatedProducts?: number[];
}
