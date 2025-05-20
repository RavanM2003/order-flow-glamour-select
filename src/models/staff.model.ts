
export interface Staff {
  id: number;
  name: string;
  position?: string;
  specializations?: number[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  avatar_url?: string;
  rating?: number;
  bio?: string;
}
