
// Appointment model and related types
import { Customer } from "./customer.model";
import { Service } from "./service.model";
import { Product } from "./product.model";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "confirmed" | "pending" | "rejected";

export interface ServiceProvider {
  id: number;
  name: string;
  serviceId?: number;
}

export interface Appointment {
  id: string;
  customer_user_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  total?: number;
  is_no_show?: boolean;
  cancel_reason?: string;
  appointment_date: string;
  user_id?: string;
  
  // Additional properties for UI compatibility
  orderReference?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  time?: string;
  duration?: string | number;
  totalAmount?: number;
  amountPaid?: number;
  remainingBalance?: number;
  service?: string;
  servicePrice?: number;
  price?: number;
  paymentMethod?: string;
  staff?: string[];
  services?: Service[];
  products?: Product[] | string[];
  selectedProducts?: Product[] | string[];
  serviceProviders?: ServiceProvider[];
}

export interface AppointmentCreate {
  customer_user_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status?: AppointmentStatus;
  total?: number;
  appointment_date: string;
}

export interface AppointmentUpdate {
  customer_user_id?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  status?: AppointmentStatus;
  total?: number;
  is_no_show?: boolean;
  cancel_reason?: string;
  appointment_date?: string;
}

export interface AppointmentFormData {
  customerId: string | number;
  date: string;
  startTime: string;
  endTime?: string;
  service: string;
  staff?: string[];
  products?: (string | Product)[];
  totalAmount?: number;
  amountPaid?: number;
  status?: AppointmentStatus;
  customer_user_id?: string;
  start_time?: string;
  end_time?: string;
  appointment_date?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  customerId?: number;
  search?: string;
}

// Database types
export interface DatabaseAppointment {
  id: number;
  customer_user_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  total?: number;
  is_no_show?: boolean;
  cancel_reason?: string;
  appointment_date: string;
  user_id?: string;
}
