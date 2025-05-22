
export interface Staff {
  id: string;
  name: string;
  full_name?: string;
  email?: string;
  position?: string;
  specializations?: number[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  avatar_url?: string;
}

export interface StaffFormData {
  name: string;
  email?: string;
  position?: string;
  specializations?: number[];
  user_id?: string;
}
