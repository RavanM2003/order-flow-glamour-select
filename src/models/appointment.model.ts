
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: number;
  customer_user_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  total: number;
  user_id: string;
  cancel_reason?: string;
  created_at: string;
  updated_at: string;
  is_no_show: boolean;
}

export interface AppointmentFormData {
  appointment_date: string | Date;
  start_time: string;
  end_time: string;
  status?: AppointmentStatus;
  total?: number;
  customer_user_id?: string;
  user_id?: string;
  cancel_reason?: string;
}
