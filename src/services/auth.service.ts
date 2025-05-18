import { User, UserCredentials, UserRole, AuthResponse } from '@/models/user.model';
import { ApiService } from './api.service';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';

// Mock users for fake authentication
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as UserRole,
    isActive: true,
    lastLogin: '2025-05-15T12:00:00Z',
    staffId: 1
  },
  {
    id: '2',
    email: 'staff@example.com',
    password: 'password123',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'staff' as UserRole,
    isActive: true,
    lastLogin: '2025-05-14T10:30:00Z',
    staffId: 2
  },
  {
    id: '3',
    email: 'user@example.com',
    password: 'password123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user' as UserRole,
    isActive: true,
    lastLogin: '2025-05-13T15:45:00Z'
  }
];

export class AuthService extends ApiService {
  private readonly storageKey = 'auth_user';
  
  constructor() {
    super();
    // Initialize user from localStorage if available
    this.loadUserFromStorage();
  }
  
  private user: User | null = null;
  private tokenExpiryTime: number | null = null;
  
  // Get the current authenticated user
  getCurrentUser(): User | null {
    return this.user;
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.user && (this.tokenExpiryTime === null || this.tokenExpiryTime > Date.now());
  }
  
  // Login with email and password - renamed to match useAuth hook
  async login(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.loginWithEmailPassword(credentials);
  }
  
  // Keep the original method for backwards compatibility
  async loginWithEmailPassword(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find mock user with matching credentials
      const foundUser = MOCK_USERS.find(user => 
        user.email === credentials.email && 
        user.password === credentials.password
      );
      
      if (foundUser) {
        // Create a copy without the password
        const { password, ...userData } = foundUser;
        
        // Set expiry for 24 hours
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        
        // Create user object
        const user: User = {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          isActive: userData.isActive,
          lastLogin: userData.lastLogin,
          ...(userData.staffId !== undefined && { staffId: userData.staffId })
        };
        
        // Create auth response
        const authResponse: AuthResponse = {
          user,
          token: "mock-jwt-token-" + Date.now(),
          expiresAt
        };
        
        return { data: authResponse };
      }
      
      return { error: 'Invalid email or password' };
    }
    
    return this.post<AuthResponse>('/auth/login', credentials);
  }
  
  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email is already in use
      if (MOCK_USERS.some(user => user.email === userData.email)) {
        return { error: 'Email is already in use' };
      }
      
      // In a real system, we'd create the user in the database here
      const role = userData.role || 'user' as UserRole;
      const user: User = {
        id: '999',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role,
        isActive: true,
        lastLogin: new Date().toISOString(),
        ...(userData.staffId && { staffId: userData.staffId })
      };
      
      return { data: user };
    }
    
    return this.post<User>('/auth/register', userData);
  }
  
  // Logout the current user
  logout(): void {
    this.user = null;
    this.tokenExpiryTime = null;
    localStorage.removeItem(this.storageKey);
  }
  
  // Save user to localStorage
  private saveUserToStorage(): void {
    if (this.user) {
      localStorage.setItem(this.storageKey, JSON.stringify({
        user: this.user,
        expiry: this.tokenExpiryTime
      }));
    }
  }
  
  // Load user from localStorage
  private loadUserFromStorage(): void {
    const storedData = localStorage.getItem(this.storageKey);
    
    if (storedData) {
      try {
        const { user, expiry } = JSON.parse(storedData);
        
        // Check if token is expired
        if (!expiry || expiry > Date.now()) {
          this.user = user;
          this.tokenExpiryTime = expiry;
        } else {
          // Clear expired data
          localStorage.removeItem(this.storageKey);
        }
      } catch (e) {
        console.error('Failed to parse stored auth data', e);
        localStorage.removeItem(this.storageKey);
      }
    }
  }
  
  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { data: true };
    }
    
    return this.post<boolean>('/auth/request-reset', { email });
  }
  
  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { data: true };
    }
    
    return this.post<boolean>('/auth/reset-password', { token, newPassword });
  }
}

// Create a singleton instance
export const authService = new AuthService();
