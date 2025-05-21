
// Staff model and related types
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
  payment_status: string;
  amount: number;
  commission_amount?: number;
  notes?: string;
}

export interface StaffWithDetails extends Staff {
  availableServices: number[];
  workingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface StaffFormData {
  name: string;
  position: string;
  email?: string;
  phone?: string;
  specializations: string[];
}

export interface StaffFilters {
  search?: string;
  specialization?: string;
  sortBy?: 'name' | 'position';
  sortOrder?: 'asc' | 'desc';
}
