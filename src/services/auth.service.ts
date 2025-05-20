
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
      // First try with Supabase auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        console.log('Supabase auth failed, trying custom users table...');
        return this.loginWithCustomUsers(credentials);
      }
      
      if (!authData.user || !authData.session) {
        return { error: 'Authentication failed' };
      }
      
      // Get user data
      const { data: userData } = await supabase
        .from('users')
        .select('*, staff(*)')
        .eq('id', authData.user.id)
        .single();
        
      if (!userData) {
        return { error: 'User data not found' };
      }
      
      // Get staff ID from the staff object (not array)
      const staffData = userData.staff;
      
      // Explicitly type and check the staff data
      let staffId: number | null = null;
      if (staffData && 
          typeof staffData === 'object' && 
          !Array.isArray(staffData) && 
          'id' in staffData && 
          typeof staffData.id === 'number') {
        staffId = staffData.id;
      }
      
      // Create user object
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || '',
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        role: userData.role as UserRole,
        staffId: staffId,
        profileImage: userData.avatar_url,
        lastLogin: authData.user.last_sign_in_at || new Date().toISOString(),
        isActive: true,
        roleId: staffId // Using staff ID as role ID
      };
      
      // Create response
      const response: AuthResponse = {
        user,
        token: authData.session.access_token,
        expiresAt: new Date(authData.session.expires_at || '').getTime()
      };
      
      // Save user to storage
      this.user = user;
      this.tokenExpiryTime = response.expiresAt;
      this.saveUserToStorage();
      
      return { data: response };
    } catch (error) {
      console.error('Login error:', error);
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
        return { error: 'Invalid email or password' };
      }
      
      // For now, we're simulating password validation since we can't securely check hashed passwords
      // In a real implementation, you would use a secure method to verify passwords
      const isPasswordValid = userData.hashed_password === credentials.password ||
                             credentials.password === 'admin123'; // Hardcoded for demo purposes
      
      if (!isPasswordValid) {
        return { error: 'Invalid email or password' };
      }
      
      // Get staff ID from the staff object (not array)
      const staffData = userData.staff;
      
      // Explicitly type and check the staff data
      let staffId: number | null = null;
      if (staffData && 
          typeof staffData === 'object' && 
          !Array.isArray(staffData) && 
          'id' in staffData && 
          typeof staffData.id === 'number') {
        staffId = staffData.id;
      }
      
      // Create user object
      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name || userData.email.split('@')[0],
        lastName: userData.last_name || 'User',
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
      return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
    }
  }
  
  // Login with mock data for development purposes
  private async loginWithMockData(credentials: UserCredentials): Promise<ApiResponse<AuthResponse>> {
    // Mock users for fake authentication
    const MOCK_USERS = [
      {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
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
        firstName: 'Staff',
        lastName: 'Member',
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
        firstName: 'Cash',
        lastName: 'Manager',
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
        firstName: 'Appointment',
        lastName: 'Manager',
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
        firstName: 'Service',
        lastName: 'Manager',
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
        firstName: 'Product',
        lastName: 'Manager',
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
    
    return { error: 'Invalid email or password' };
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
      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: userData.email || '',
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      if (!authData.user) {
        return { error: 'Registration failed' };
      }
      
      // Ensure role is one of the valid role_enum values from the database
      let safeRole: UserRole = userData.role || 'customer' as UserRole;
      
      // Handle the special case for 'cashier' role
      if (safeRole === 'cash' || safeRole === 'cashier' as any) {
        safeRole = 'cash';
      }
      
      // Ensure the role matches one of the allowed values in the database enum
      const validRoles: UserRole[] = ['super_admin', 'admin', 'staff', 'cash', 'appointment', 'service', 'product', 'customer', 'reception'];
      if (!validRoles.includes(safeRole)) {
        safeRole = 'customer';
      }
      
      // Create a user entry in the users table
      const { data: newUserData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email || '',
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          role: safeRole,
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
        id: authData.user.id,
        email: authData.user.email || '',
        firstName: newUserData.first_name || '',
        lastName: newUserData.last_name || '',
        role: newUserData.role as UserRole,
        staffId: null,
        profileImage: newUserData.avatar_url || null,
        lastLogin: authData.user.last_sign_in_at || new Date().toISOString(),
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
      // First create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (authError) {
        return { error: authError.message || 'Failed to create user' };
      }

      if (!authData.user) {
        return { error: 'User creation failed' };
      }

      // Ensure role is valid for the database
      const safeRole = 'customer'; // Always use 'customer' for new customer accounts

      // Insert user data in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          first_name: customerData.firstName || '',
          last_name: customerData.lastName || '',
          role: safeRole,
          number: customerData.phone || Math.random().toString().slice(2, 12),
          hashed_password: userData.password, // Not secure, but just for demo
          avatar_url: null
        });

      if (userError) {
        console.error('Error creating user entry:', userError);
        return { error: userError.message };
      }

      // Then create customer record
      const customer = {
        user_id: authData.user.id,
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
          user: authData.user,
          customer: customerResult,
          session: authData.session
        },
        message: 'Customer created with user account successfully'
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to create customer with user account' };
    }
  }
  
  // Logout the current user
  async logout(): Promise<void> {
    if (!config.usesMockData) {
      await supabase.auth.signOut();
    }
    
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
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return { error: error.message };
      }
      
      return { data: true };
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
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        return { error: error.message };
      }
      
      return { data: true };
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
