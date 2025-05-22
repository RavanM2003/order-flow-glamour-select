
export interface Staff {
  id: string;
  name: string;
  position?: string;
  specializations?: number[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  email?: string;
  phone?: string;
  paymentType?: string;
  avatar_url?: string;
}

export interface StaffWorkingHours {
  id: number | string; // Updated to accept both number and string
  staff_id: string | number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_day_off: boolean;
  is_available: boolean;
}

export interface StaffPayment {
  id: number;
  staff_id: string;
  payment_type: string;
  base_salary?: number;
  commission_rate?: number;
  amount?: number;
  payment_date?: string;
  created_at?: string;
  updated_at?: string;
  date?: string;
  type?: string;
  description?: string;
}

export interface StaffServiceRecord {
  id: number | string;
  staff_id: string;
  service_id: number;
  service_name: string;
  can_perform?: boolean;
  commission_rate?: number;
  created_at?: string;
  updated_at?: string;
  date?: string;
  customer_name?: string;
  price?: number;
  commission?: number;
}

// Add StaffFormData interface
export interface StaffFormData {
  name: string;
  position?: string;
  specializations?: number[];
  email?: string;
  phone?: string;
  paymentType?: string;
  user_id?: string;
}
