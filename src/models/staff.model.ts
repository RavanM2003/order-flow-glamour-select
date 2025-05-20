
export interface Staff {
  id: number;
  name: string;
  position?: string;
  specializations?: string[]; // Already using string[] as type
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  avatar_url?: string;
  rating?: number;
  bio?: string;
  email?: string;
  phone?: string;
  role_id?: number;
  salary?: number;
  commissionRate?: number;
  paymentType?: 'salary' | 'commission' | 'both';
}

export interface StaffPayment {
  id: number;
  staffId: number;
  amount: number;
  date: string;
  type: 'salary' | 'commission' | 'expense';
  description?: string;
}

export interface StaffServiceRecord {
  id: number;
  staffId: number;
  customerId: number;
  customerName: string;
  serviceId: number;
  serviceName: string;
  date: string;
  amount: number;
  commission?: number;
}

export interface StaffFormData {
  name: string;
  position?: string;
  specializations?: string[];
  email?: string;
  phone?: string;
  salary?: number;
  commissionRate?: number;
  paymentType?: 'salary' | 'commission' | 'both';
  role_id?: number;
}

export interface StaffWorkingHours {
  id?: number;
  staffId: number;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // Format: "HH:MM" (24-hour format)
  endTime: string;   // Format: "HH:MM" (24-hour format)
  isWorkingDay: boolean;
}
