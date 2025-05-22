
// Staff model and related types
export interface Staff {
  id: string | number;
  name: string;
  position?: string;
  specializations?: number[];
  avatar_url?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  salary?: number;
  commissionRate?: number;
  paymentType?: "salary" | "commission" | "hybrid";
}

export interface StaffPayment {
  id: string;
  staff_id: string;
  amount: number;
  payment_type: "salary" | "commission" | "hybrid";
  payment_date: string;
  created_at: string;
  updated_at: string;
  type?: string;
  date?: string;
  note?: string;
  description?: string;
}

export interface StaffServiceRecord {
  id: string;
  staff_id: string;
  service_id: number;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  date?: string;
  customer_name?: string;
  service_name?: string;
  price?: number;
  amount?: number;
  commission?: number;
}

export interface StaffWorkingHours {
  id?: string;
  staff_id: string | number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
  is_day_off?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  position?: string;
  role_id?: number;
  salary?: number;
  commissionRate?: number;
  paymentType?: "salary" | "commission" | "hybrid";
  specializations?: number[];
  user_id?: string;
}

// Staff filters
export interface StaffFilters {
  search?: string;
  position?: string;
  specialization?: number;
  sortBy?: "name" | "position";
  sortOrder?: "asc" | "desc";
}
