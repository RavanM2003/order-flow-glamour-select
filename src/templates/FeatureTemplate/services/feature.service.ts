/**
 * Feature Service
 * 
 * This service handles all API calls related to features
 * 
 * USAGE:
 * 1. Rename all instances of "feature" to your feature name (e.g., "product", "customer")
 * 2. Update API endpoints and response handling according to your backend
 * 3. Add or modify methods as needed for your feature's requirements
 */

import { ApiResponse } from '@/models/types';
import { ApiService } from '@/services/api.service';
import { Feature, FeatureFormData, FeatureFilters } from '../types';

class FeatureService extends ApiService {
  private endpoint = '/features'; // Change to your API endpoint

  // Get all features with optional filtering
  async getAll(filters?: FeatureFilters): Promise<ApiResponse<Feature[]>> {
    try {
      // Build query params based on filters
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await this.get<Feature[]>(`${this.endpoint}${queryString}`);
      
      return response;
    } catch (error) {
      console.error('Error fetching features:', error);
      return { error: 'Failed to fetch features', data: null };
    }
  }

  // Get a single feature by ID
  async getById(id: number | string): Promise<ApiResponse<Feature>> {
    try {
      const response = await this.get<Feature>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching feature ${id}:`, error);
      return { error: `Failed to fetch feature ${id}`, data: null };
    }
  }

  // Create a new feature
  async create(data: FeatureFormData): Promise<ApiResponse<Feature>> {
    try {
      const response = await this.post<Feature>(this.endpoint, data);
      return response;
    } catch (error) {
      console.error('Error creating feature:', error);
      return { error: 'Failed to create feature', data: null };
    }
  }

  // Update an existing feature
  async update(id: number | string, data: Partial<FeatureFormData>): Promise<ApiResponse<Feature>> {
    try {
      const response = await this.put<Feature>(`${this.endpoint}/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating feature ${id}:`, error);
      return { error: `Failed to update feature ${id}`, data: null };
    }
  }

  // Delete a feature
  async deleteFeature(id: number | string): Promise<ApiResponse<boolean>> {
    try {
      const response = await this.delete<boolean>(`${this.endpoint}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting feature ${id}:`, error);
      return { error: `Failed to delete feature ${id}`, data: null };
    }
  }
}

export const featureService = new FeatureService();
