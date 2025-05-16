// User model and related types
export type UserRole = "admin" | "staff" | "cashier" | "guest";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  staffId?: number; // Reference to staff member if role is staff
  profileImage?: string;
  lastLogin: string;
  isActive: boolean;
}

export interface UserFormData {
  email: string;
  password?: string; // Optional for updates
  firstName?: string;
  lastName?: string;
  role: UserRole;
  staffId?: number;
  isActive?: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: number;
}

export interface UserSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}
