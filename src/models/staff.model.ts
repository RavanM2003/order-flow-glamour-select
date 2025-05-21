
export interface DefaultStaff {
  id: number;
  name: string;
  position: string;
  specializations: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Staff extends DefaultStaff {
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  availability?: StaffAvailability[];
  services?: number[];
  rating?: number;
  role_id?: number;
  salary?: number;
  commissionRate?: number;
  paymentType?: string;
  avatar_url?: string;
}

export interface StaffAvailability {
  day: number;
  startTime: string;
  endTime: string;
}

export interface StaffServiceRecord {
  id: number;
  staff_id: number;
  customer_id: number;
  customer_name?: string;
  service_id: number;
  service_name?: string;
  date: string;
  created_at?: string;
  price: number;
  amount: number;
  commission?: number;
  payment_status: string;
}

export interface StaffPayment {
  id: number;
  staff_id: number;
  amount: number;
  payment_date: string;
  payment_type: string;
  note?: string;
  created_at: string;
  date?: string;
  type?: string;
  description?: string;
}

export interface StaffFormData {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  specializations: string[];
  salary?: number;
  commissionRate?: number;
  paymentType?: string;
  role_id?: number;
  avatar_url?: string;
  user_id?: string;
}

export interface StaffWorkingHours {
  id?: number;
  staff_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_day_off: boolean;
}
