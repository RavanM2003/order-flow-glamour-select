
// Common base types for the application

// Basic User type
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

// Generic pagination response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Generic API response
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
