
/**
 * Feature Types
 * 
 * Define all types and interfaces for your feature here
 * 
 * USAGE:
 * 1. Replace "Feature" with your feature name in all types and interfaces
 * 2. Add or remove properties to match your data model
 */

/**
 * Main Feature interface representing a feature entity
 */
export interface Feature {
  id: number | string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add more properties as needed for your feature
}

/**
 * Data for creating or updating a feature
 * Usually a subset of the main entity without read-only fields
 */
export interface FeatureFormData {
  name: string;
  description?: string;
  // Add more properties as needed
}

/**
 * Filter and sorting options for feature list
 */
export interface FeatureFilters {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Add more filters as needed
}

/**
 * Additional types for your feature can be defined here
 */
