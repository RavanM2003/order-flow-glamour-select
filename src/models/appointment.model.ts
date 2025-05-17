
// Appointment model and related types
import { Customer } from './customer.model';
import { Service } from './service.model';
import { Product } from './product.model';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'rejected' | 'cancelled' | 'paid';

export interface ServiceProvider {
  id: number;
  name: string;
  serviceId?: number;
}

export interface Appointment {
  id: number;
  customerId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  service: string;
  staff?: string[];
  products?: string[] | Product[];
  totalAmount?: number;
  amountPaid?: number;
  remainingBalance?: number;
  orderReference?: string;
  time?: string;
  duration?: string;
  paymentMethod?: string;
  serviceProviders?: ServiceProvider[];
  services?: Service[];
  servicePrice?: number;
  price?: number;
  selectedProducts?: Product[];
  createdAt?: string;
  rejectionReason?: string;
  isPaid?: boolean;
}

export interface AppointmentFormData {
  customerId: number;
  date: string;
  startTime: string;
  endTime?: string;
  service: string;
  staff?: string[];
  products?: (string | Product)[];
  totalAmount?: number;
  amountPaid?: number;
  status?: AppointmentStatus;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
  customerId?: number;
  search?: string;
}
