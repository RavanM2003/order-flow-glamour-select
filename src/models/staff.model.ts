
// Staff member model
export interface Staff {
  id?: number;
  name: string;
  position?: string;
  specializations?: string[];
  email?: string;
  phone?: string;
  salary?: number;
  commissionRate?: number;
  paymentType?: 'salary' | 'commission' | 'both';
  created_at?: string;
  updated_at?: string;
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
}

// Updated StaffPayment type
export interface StaffPayment {
  id: number;
  staffId: number;
  amount: number;
  date: string;
  type: 'salary' | 'commission' | 'bonus' | 'expense';
  description?: string;
}

// Updated StaffServiceRecord to include amount property
export interface StaffServiceRecord {
  id: number;
  staffId: number;
  serviceId: number;
  serviceName: string;
  date: string;
  customerId?: number;
  customerName?: string;
  commission?: number;
  amount: number;
}
