
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: number;
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total?: number;
  user_id?: string | null;
  cancel_reason?: string;
  created_at?: string;
  updated_at?: string;
  is_no_show?: boolean;
  
  // Calculated or joined fields
  customer?: any;
  service?: any;
  staff?: any;
}

export interface AppointmentFormData {
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total?: number;
  user_id?: string | null;
  cancel_reason?: string;
}

export interface AppointmentService {
  id?: number;
  appointment_id?: number;
  service_id: number;
  quantity?: number;
  duration?: number;
  price?: number;
  staff_id?: string;
}

export interface AppointmentProduct {
  id?: number;
  appointment_id?: number;
  product_id: number;
  quantity: number;
  price?: number;
  amount?: number;
  staff_id?: string;
}
