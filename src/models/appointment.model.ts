
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
  created_at?: string;
  updated_at?: string;
  cancel_reason?: string;
  is_no_show?: boolean;
}

export interface AppointmentFormData {
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total?: number;
  user_id?: string | null;
}

export interface AppointmentCreate {
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total?: number;
  user_id?: string | null;
}
