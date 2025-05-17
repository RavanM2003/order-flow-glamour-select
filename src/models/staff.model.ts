
// Staff model and related types
export interface Staff {
  id: number;
  name: string;
  position?: string;
  specializations?: string[];
  email?: string;
  phone?: string;
  salary?: number;
  commissionRate?: number; // Commission percentage (1-100)
  paymentType?: 'salary' | 'commission' | 'both';
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
  appointmentId: number;
  customerId: number;
  customerName: string;
  serviceId: number;
  serviceName: string;
  date: string;
  amount: number;
  commission?: number;
}
