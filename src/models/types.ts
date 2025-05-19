
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

// Export service, product, customer and appointment types to be used in supabase.service.ts
export type { Service } from './service.model';
export type { Product } from './product.model';
export type { Customer } from './customer.model';
export type { Appointment } from './appointment.model';

// Define AppointmentCreate type needed by supabase.service.ts
export interface AppointmentCreate {
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  total?: number;
  user_id?: string;
}
