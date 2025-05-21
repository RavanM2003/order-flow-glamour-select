
export interface DefaultStaff {
  id: number;
  name: string;
  position: string;
  specializations: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface Staff extends DefaultStaff {
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  availability?: StaffAvailability[];
  services?: number[];
  rating?: number;
}

export interface StaffAvailability {
  day: number;
  startTime: string;
  endTime: string;
}
