
import { ApiService } from '@/services/api.service';
import { Feature, FeatureFormData } from '../types';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';

// Mock data for features
const mockFeatures: Feature[] = [
  {
    id: 1,
    name: 'Sample Feature',
    description: 'This is a sample feature',
    isActive: true,
    category: 'Core',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: 2,
    name: 'Another Feature',
    description: 'This is another feature',
    isActive: false,
    category: 'Extension',
    created_at: '2023-02-01T00:00:00Z',
    updated_at: '2023-02-15T00:00:00Z'
  }
];

export class FeatureService extends ApiService {
  // Get all features
  async getAll(): Promise<ApiResponse<Feature[]>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: [...mockFeatures] };
    }
    
    return this.get<Feature[]>('/features');
  }
  
  // Get a feature by ID
  async getById(id: number | string): Promise<ApiResponse<Feature>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const feature = mockFeatures.find(f => f.id === Number(id));
      return { 
        data: feature ? {...feature} : undefined, 
        error: feature ? undefined : 'Feature not found' 
      };
    }
    
    return this.get<Feature>(`/features/${id}`);
  }
  
  // Create a new feature
  async create(data: FeatureFormData): Promise<ApiResponse<Feature>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const newId = Math.max(...mockFeatures.map(f => f.id || 0), 0) + 1;
      const now = new Date().toISOString();
      const newFeature: Feature = {
        ...data,
        id: newId,
        isActive: data.isActive ?? true,
        created_at: now,
        updated_at: now
      };
      mockFeatures.push(newFeature);
      return { data: newFeature };
    }
    
    return this.post<Feature>('/features', data);
  }
  
  // Update a feature
  async update(id: number | string, data: Partial<FeatureFormData>): Promise<ApiResponse<Feature>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockFeatures.findIndex(f => f.id === Number(id));
      if (index >= 0) {
        mockFeatures[index] = {
          ...mockFeatures[index],
          ...data,
          updated_at: new Date().toISOString()
        };
        return { data: mockFeatures[index] };
      }
      return { error: 'Feature not found' };
    }
    
    return this.put<Feature>(`/features/${id}`, data);
  }
  
  // Delete a feature
  async delete(id: number | string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockFeatures.findIndex(f => f.id === Number(id));
      if (index >= 0) {
        mockFeatures.splice(index, 1);
        return { data: true };
      }
      return { error: 'Feature not found' };
    }
    
    return super.delete(`/features/${id}`);
  }
}

// Create a singleton instance
export const featureService = new FeatureService();
