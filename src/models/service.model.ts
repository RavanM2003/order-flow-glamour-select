
// Service model and related types
export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number; // Duration in minutes (integer)
  description?: string;
  relatedProducts?: number[];
  benefits?: string[];
  imageUrl?: string;
}

export interface ServiceFormData {
  name: string;
  price: number;
  duration: number; // Duration in minutes (integer)
  description?: string;
  relatedProducts?: number[];
  benefits?: string[];
  imageUrl?: string;
}

export interface ServiceBenefit {
  text: string;
}
