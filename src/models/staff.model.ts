
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
}

export interface StaffWorkingHours {
  id: number;
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
}

export interface StaffServiceRecord {
  id: number;
  staff_id: string;
  service_id: number;
  service_name: string;
  can_perform: boolean;
}
