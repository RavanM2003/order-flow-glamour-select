
// Feature type definitions

export interface Feature {
  id: number;
  name: string;
  description?: string;
  category?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeatureFormData {
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
}

export interface FeatureFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
}
