
// Staff model and related types
export interface Staff {
  id: number;
  name: string;
  position?: string;
  specializations?: string[];
}

export interface StaffFormData {
  name: string;
  position?: string;
  specializations?: string[];
  email?: string;
  phone?: string;
}
