
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
