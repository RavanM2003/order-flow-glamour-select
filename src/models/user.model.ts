
// User model and related types
export type UserRole = "super_admin" | "admin" | "staff" | "cash" | "appointment" | "service" | "product" | "guest" | "customer" | "reception";

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
  roleId?: number;
}

export interface UserFormData {
  email: string;
  password?: string; // Optional for updates
  firstName?: string;
  lastName?: string;
  role: UserRole;
  staffId?: number;
  isActive?: boolean;
  roleId?: number;
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

// User credentials for login
export interface UserCredentials {
  email: string;
  password: string;
}

// Customer creation with user account
export interface CustomerWithUserFormData {
  // User data
  email: string;
  password: string;
  
  // Customer data
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  birthDate?: string;
  note?: string;
}
