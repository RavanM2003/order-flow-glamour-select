
export interface Staff {
  id: string;
  name: string;
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  specializations?: number[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  avatar_url?: string;
  paymentType?: "salary" | "commission" | "hybrid";
  salary?: number;
  commissionRate?: number;
  role_id?: number;
}

export interface StaffFormData {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  specializations?: number[];
  user_id?: string;
  paymentType?: "salary" | "commission" | "hybrid";
  salary?: number;
  commissionRate?: number;
}

// Additional interfaces needed for StaffDetails and hooks
export interface StaffWorkingHours {
  id: string;
  staff_id: string | number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_day_off: boolean;
  is_available: boolean;
}

export interface StaffPayment {
  id: string;
  staff_id: string;
  amount: number;
  payment_type: string;
  payment_date: string;
  created_at: string;
  updated_at: string;
  date: string;
  type: string;
  description: string;
}

export interface StaffServiceRecord {
  id: string;
  staff_id: string;
  service_id: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  date: string;
  customer_name: string;
  service_name: string;
  price: number;
  commission: number;
}
