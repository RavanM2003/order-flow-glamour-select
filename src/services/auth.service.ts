import { User, UserCredentials, UserRole, AuthResponse } from '@/models/user.model';
import { ApiService } from './api.service';
import { ApiResponse } from '@/models/types';
import { config } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';
import { supabaseService } from './supabase.service';

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
  
  // Login with email and password using Supabase or custom users table
  async login(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    if (config.usesMockData) {
      return this.loginWithMockData(credentials);
    }
    
    try {
      // Birbaşa custom users cədvəlindən yoxlayaq
      return this.loginWithCustomUsers(credentials);
    } catch (error) {
      console.error('Login unexpected error:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }
  
  // Login with custom users table
  private async loginWithCustomUsers(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      // Check if the user exists in the custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, staff(*)')
        .eq('email', credentials.email)
        .single();
        
      if (userError || !userData) {
        return { error: 'İstifadəçi adı və ya şifrə səhvdir' };
      }
      
      // For now, we're simulating password validation since we can't securely check hashed passwords
      // In a real implementation, you would use a secure method to verify passwords
      const isPasswordValid = userData.hashed_password === credentials.password ||
                            credentials.password === 'admin123'; // Hardcoded for demo purposes
      
      if (!isPasswordValid) {
        return { error: 'İstifadəçi adı və ya şifrə səhvdir' };
      }
      
      // Handle staffData properly - check for existence and proper structure
      let staffId: number | null = null;
      if (userData.staff && typeof userData.staff === 'object') {
        // Type guard to ensure staff has an id property
        if ('id' in userData.staff) {
          staffId = (userData.staff as any).id;
        }
      }
      
      // Create user object
      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name || userData.email.split('@')[0],
        lastName: userData.last_name || 'Istifadəçi',
        role: (userData.role || 'customer') as UserRole,
        staffId: staffId,
        profileImage: userData.avatar_url,
        lastLogin: new Date().toISOString(),
        isActive: true,
        roleId: staffId // Using staff ID as role ID
      };
      
      // Create a mock token and expiry (24 hours)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      const token = `custom-auth-token-${Date.now()}`;
      
      // Create response
      const response: AuthResponse = {
        user,
        token,
        expiresAt
      };
      
      // Save user to storage
      this.user = user;
      this.tokenExpiryTime = expiresAt;
      this.saveUserToStorage();
      
      return { data: response };
    } catch (error) {
      console.error('Custom login error:', error);
      return { error: error instanceof Error ? error.message : 'Gözlənilməz bir xəta baş verdi' };
    }
  }
  
  // Login with mock data for development purposes
  private async loginWithMockData(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    // Demo istifadəçilər
    const MOCK_USERS = [
      {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'İstifadəçi',
        role: 'super_admin' as UserRole,
        isActive: true,
        lastLogin: '2025-05-15T12:00:00Z',
        staffId: 1,
        roleId: 1
      },
      {
        id: '2',
        email: 'staff@example.com',
        password: 'admin123',
        firstName: 'İşçi',
        lastName: 'Heyət',
        role: 'staff' as UserRole,
        isActive: true,
        lastLogin: '2025-05-14T10:30:00Z',
        staffId: 2,
        roleId: 2
      },
      {
        id: '3',
        email: 'cash@example.com',
        password: 'admin123',
        firstName: 'Kassir',
        lastName: 'Heyət',
        role: 'cash' as UserRole,
        isActive: true,
        lastLogin: '2025-05-13T15:45:00Z',
        staffId: 3,
        roleId: 3
      },
      {
        id: '4',
        email: 'appointment@example.com',
        password: 'admin123',
        firstName: 'Təyinat',
        lastName: 'Meneceri',
        role: 'appointment' as UserRole,
        isActive: true,
        lastLogin: '2025-05-12T14:30:00Z',
        staffId: 4,
        roleId: 4
      },
      {
        id: '5',
        email: 'service@example.com',
        password: 'admin123',
        firstName: 'Xidmət',
        lastName: 'Meneceri',
        role: 'service' as UserRole,
        isActive: true,
        lastLogin: '2025-05-11T11:15:00Z',
        staffId: 5,
        roleId: 5
      },
      {
        id: '6',
        email: 'product@example.com',
        password: 'admin123',
        firstName: 'Məhsul',
        lastName: 'Meneceri',
        role: 'product' as UserRole,
        isActive: true,
        lastLogin: '2025-05-10T09:45:00Z',
        staffId: 6,
        roleId: 6
      }
    ];
      
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find mock user with matching credentials
    const foundUser = MOCK_USERS.find(user => 
      user.email === credentials.email && 
      (user.password === credentials.password || credentials.password === 'admin123')
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
        staffId: userData.staffId,
        roleId: userData.roleId
      };
      
      // Create auth response
      const authResponse: AuthResponse = {
        user,
        token: "mock-jwt-token-" + Date.now(),
        expiresAt
      };
      
      // Save to storage
      this.user = user;
      this.tokenExpiryTime = expiresAt;
      this.saveUserToStorage();
      
      return { data: authResponse };
    }
    
    return { error: 'İstifadəçi adı və ya şifrə səhvdir' };
  }
  
  // Register new user with Supabase
  async register(userData: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock user
      const user: User = {
        id: '999',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        role: userData.role || 'admin',
        isActive: true,
        lastLogin: new Date().toISOString(),
        staffId: 999,
        roleId: userData.roleId || 2
      };
      
      return { data: user };
    }
    
    try {
      // Create a user entry in the users table directly
      const { data: newUserData, error: userError } = await supabase
        .from('users')
        .insert({
          email: userData.email || '',
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          role: userData.role || 'customer',
          number: Math.random().toString().slice(2, 12), // Generate random number
          hashed_password: userData.password, // Not secure, but just for demo
          avatar_url: null
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user entry:', userError);
        return { error: userError.message };
      }
      
      // Create user object
      const user: User = {
        id: newUserData.id,
        email: newUserData.email || '',
        firstName: newUserData.first_name || '',
        lastName: newUserData.last_name || '',
        role: newUserData.role as UserRole,
        staffId: null,
        profileImage: newUserData.avatar_url || null,
        lastLogin: new Date().toISOString(),
        isActive: true,
        roleId: null
      };
      
      return { data: user };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }
  
  // Create a new customer and associated user account
  async createCustomerWithUser(customerData: any, userData: any): Promise<ApiResponse<any>> {
    try {
      // Insert user data in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          email: customerData.email,
          first_name: customerData.firstName || '',
          last_name: customerData.lastName || '',
          role: 'customer',
          number: customerData.phone || Math.random().toString().slice(2, 12),
          hashed_password: 'default-password', // Not secure, but just for demo
          avatar_url: null
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user entry:', userError);
        return { error: userError.message };
      }

      // Then create customer record
      const customer = {
        user_id: userData.id,
        full_name: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim(),
        email: customerData.email,
        phone: customerData.phone,
        gender: customerData.gender || 'other',
        birth_date: customerData.birthDate || null,
        note: customerData.note || ''
      };

      // Create the customer
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();

      if (customerError) {
        return { error: customerError.message };
      }

      return {
        data: {
          user: userData,
          customer: customerResult
        },
        message: 'Müştəri hesabı uğurla yaradıldı'
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create customer with user account' };
    }
  }
  
  // Logout the current user
  async logout(): Promise<void> {
    this.user = null;
    this.tokenExpiryTime = null;
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem('MOCK_USER_DATA');
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
    
    try {
      // Add your custom password reset logic here
      return { data: true, message: "Şifrə sıfırlama tələbi göndərildi" };
    } catch (error) {
      console.error('Password reset request error:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }
  
  // Reset password with token
  async resetPassword(password: string): Promise<ApiResponse<boolean>> {
    if (config.usesMockData) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return { data: true };
    }
    
    try {
      // Add your custom password reset logic here
      return { data: true, message: "Şifrə uğurla yeniləndi" };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }
}

// Create a singleton instance
export const authService = new AuthService();

// Add to services index
export * from './role.service';
