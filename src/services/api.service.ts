
// Core API service with base functionality
import { config } from '@/config/env';
import { ApiResponse } from '@/models/types';

// Generic API class with common methods
export class ApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      // If using mock data, return a mock promise instead of actual fetch
      if (config.usesMockData && endpoint.startsWith('/')) {
        console.log(`[MOCK] GET ${endpoint}`);
        // The actual mock data will be implemented in feature-specific services
        return { error: 'Mock not implemented for this endpoint' };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  protected async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      if (config.usesMockData && endpoint.startsWith('/')) {
        console.log(`[MOCK] POST ${endpoint}`, data);
        return { error: 'Mock not implemented for this endpoint' };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  protected async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      if (config.usesMockData && endpoint.startsWith('/')) {
        console.log(`[MOCK] PUT ${endpoint}`, data);
        return { error: 'Mock not implemented for this endpoint' };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Fix the delete method to allow proper overriding in derived classes
  protected async delete<T = boolean>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      if (config.usesMockData && endpoint.startsWith('/')) {
        console.log(`[MOCK] DELETE ${endpoint}`);
        return { error: 'Mock not implemented for this endpoint' };
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
