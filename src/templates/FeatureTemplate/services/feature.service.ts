
import { ApiService } from '@/services/api.service';
import { ApiResponse } from '@/models/types';
import { Feature, FeatureFilters, FeatureFormData } from '../types';

// Mock data for development
const mockFeatures: Feature[] = [
  {
    id: 1,
    name: "Premium Package",
    description: "Our top-tier feature offering",
    category: "premium",
    isActive: true,
    created_at: "2025-01-15T08:30:00Z",
    updated_at: "2025-01-15T08:30:00Z"
  },
  {
    id: 2,
    name: "Basic Access",
    description: "Standard feature for all users",
    category: "basic",
    isActive: true,
    created_at: "2025-01-15T08:30:00Z",
    updated_at: "2025-01-15T08:30:00Z"
  }
];

export class FeatureService extends ApiService {
  // Get all features with optional filters
  async getAll(filters?: FeatureFilters): Promise<ApiResponse<Feature[]>> {
    // Mock implementation
    let filteredFeatures = [...mockFeatures];
    
    if (filters) {
      // Apply filters if provided
      if (filters.category) {
        filteredFeatures = filteredFeatures.filter(f => f.category === filters.category);
      }
      
      if (filters.isActive !== undefined) {
        filteredFeatures = filteredFeatures.filter(f => f.isActive === filters.isActive);
      }
      
      // Add more filter implementations as needed
    }
    
    return { data: filteredFeatures };
  }
  
  // Get a feature by ID
  async getById(id: number | string): Promise<ApiResponse<Feature>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const feature = mockFeatures.find(f => f.id === numericId);
    
    if (!feature) {
      return { error: 'Feature not found' };
    }
    
    return { data: feature };
  }
  
  // Create a new feature
  async create(data: FeatureFormData): Promise<ApiResponse<Feature>> {
    const newId = Math.max(...mockFeatures.map(f => f.id || 0), 0) + 1;
    
    const newFeature: Feature = {
      id: newId,
      name: data.name,
      description: data.description,
      category: data.category,
      isActive: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockFeatures.push(newFeature);
    
    return { data: newFeature };
  }
  
  // Update a feature
  async update(id: number | string, data: Partial<FeatureFormData>): Promise<ApiResponse<Feature>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const index = mockFeatures.findIndex(f => f.id === numericId);
    
    if (index < 0) {
      return { error: 'Feature not found' };
    }
    
    mockFeatures[index] = {
      ...mockFeatures[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return { data: mockFeatures[index] };
  }
  
  // Delete a feature
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    const index = mockFeatures.findIndex(f => f.id === numericId);
    
    if (index < 0) {
      return { error: 'Feature not found' };
    }
    
    mockFeatures.splice(index, 1);
    
    return { data: true };
  }
}

export const featureService = new FeatureService();
