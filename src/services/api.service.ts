
// Basic API service with common CRUD operations
import { ApiResponse } from '@/models/types';

export abstract class ApiService {
  // Base endpoint for all requests
  protected baseEndpoint: string = '/api';

  // Generic GET request
  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseEndpoint}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Generic POST request
  protected async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseEndpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Generic PUT request
  protected async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseEndpoint}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Generic DELETE request - updated to accept endpoint or numeric id
  protected async delete(endpoint: string | number): Promise<ApiResponse<boolean>> {
    try {
      const finalEndpoint = typeof endpoint === 'number' 
        ? `${this.baseEndpoint}/services/${endpoint}` 
        : `${this.baseEndpoint}${endpoint}`;
      
      const response = await fetch(finalEndpoint, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Some DELETE responses may return no content
      if (response.status === 204) {
        return { data: true };
      }
      
      try {
        const responseData = await response.json();
        return { data: responseData || true };
      } catch (e) {
        // If parsing fails, return true as success indicator
        return { data: true };
      }
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
