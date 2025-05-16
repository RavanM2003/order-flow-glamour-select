
/**
 * Types for the feature module
 * 
 * USAGE:
 * 1. Rename "Feature" to your feature name (e.g., "Product", "Customer")
 * 2. Update the interface properties based on your data model
 */

// Main data model interface
export interface Feature {
  id: number | string;
  name: string;
  // Add your specific properties here
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add more properties as needed
}

// Form data interface - used for create/update operations
export interface FeatureFormData {
  name: string;
  // Add your specific form fields here
  description?: string;
  // Add more form fields as needed
}

// Filter interface - used for searching/filtering
export interface FeatureFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Add more filter fields as needed
}
