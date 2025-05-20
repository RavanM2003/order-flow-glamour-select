
export interface Staff {
  id: number;
  name: string;
  position: string;
  specializations: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
  email?: string;
  phone?: string;
  role_id?: number;
  avatar_url?: string;
  salary?: number;
  commissionRate?: number;
  paymentType?: string;
}

export interface StaffPayment {
  id: number;
  staff_id: number;
  amount: number;
  payment_date: string;
  payment_type: string;
  note?: string;
  created_at: string;
  // Additional properties used in the components
  date?: string;
  type?: string;
  description?: string;
}

export interface StaffServiceRecord {
  id: number;
  staff_id: number;
  service_id: number;
  customer_id: number;
  date: string;
  note?: string;
  created_at: string;
  service_name?: string;
  customer_name?: string;
  price?: number;
  // Additional properties used in the components
  amount?: number;
  commission?: number;
}

export interface StaffFormData {
  name: string;
  position: string;
  specializations: string[];
  email?: string;
  phone?: string;
  role_id?: number;
  salary?: number;
  commissionRate?: number;
  paymentType?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  avatar_url?: string;
}

export interface StaffWorkingHours {
  id?: number;
  staff_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_day_off: boolean;
}

export type StaffFilter = {
  search?: string;
  position?: string;
  specialization?: string;
  status?: 'active' | 'inactive';
  sort?: 'name' | 'position' | 'created_at';
  direction?: 'asc' | 'desc';
}
