import { AuthResponse, CustomerWithUserFormData, User, UserCredentials } from "@/models/user.model";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { staffService } from "./staff.service";

const uuid = uuidv4();

export const authService = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      
      if (error) {
        console.error('Login error:', error);
        return { user: null, session: null, error: error.message };
      }
      
      const { user, session } = data;
      
      if (!user || !session) {
        return { user: null, session: null, error: 'Failed to retrieve user session after login.' };
      }
      
      const token = session.access_token;
      const expiresAt = session.expires_at;
      
      return {
        user,
        session,
        error: null,
        token,
        expiresAt
      };
    } catch (err) {
      console.error('Login failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        return { user: null, session: null, error: error.message };
      }
      return { user: null, session: null, error: null };
    } catch (err) {
      console.error('Logout failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  register: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp(credentials);
  
      if (error) {
        console.error('Registration error:', error);
        return { user: null, session: null, error: error.message };
      }
  
      const { user, session } = data;
  
      if (!user) {
        return { user: null, session: null, error: 'Failed to retrieve user after registration.' };
      }
  
      return { user, session, error: null };
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  getSession: async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return { user: null, session: null, error: error.message };
      }
      
      const { session } = data;
      
      if (!session) {
        return { user: null, session: null, error: 'No active session found.' };
      }
      
      const user = session.user;
      const token = session.access_token;
      const expiresAt = session.expires_at;
      
      return {
        user,
        session,
        error: null,
        token,
        expiresAt
      };
    } catch (err) {
      console.error('Failed to get session:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  updateUser: async (updates: Partial<User>): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates);
      
      if (error) {
        console.error('Update user error:', error);
        return { user: null, session: null, error: error.message };
      }
      
      const { user } = data;
      
      if (!user) {
        return { user: null, session: null, error: 'Failed to retrieve updated user.' };
      }
      
      return { user, session: null, error: null };
    } catch (err) {
      console.error('Failed to update user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  resetPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        console.error('Reset password error:', error);
        return { user: null, session: null, error: error.message };
      }
      
      // Password reset link sent
      return { user: null, session: null, error: null };
    } catch (err) {
      console.error('Failed to reset password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  updatePassword: async (password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Update password error:', error);
        return { user: null, session: null, error: error.message };
      }
      
      const { user } = data;
      
      if (!user) {
        return { user: null, session: null, error: 'Failed to retrieve updated user.' };
      }
      
      return { user, session: null, error: null };
    } catch (err) {
      console.error('Failed to update password:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  createCustomerWithUser: async (data: CustomerWithUserFormData): Promise<AuthResponse> => {
    try {
      // Create user in auth.users table
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || ""
      });
  
      if (authError) {
        console.error('Error creating user:', authError);
        return { user: null, session: null, error: authError.message };
      }
  
      const { user: authUser, session } = authData;
      if (!authUser) {
        return { user: null, session: null, error: 'Failed to retrieve user after registration.' };
      }
  
      // Create user in public.users table
      const staffId = uuidv4();
      const user = {
        id: uuid,
        email: data.email,
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        full_name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        gender: data.gender,
        birth_date: data.birth_date,
        phone: data.phone,
        note: data.note,
        role: 'customer',
        staffId: staffId?.toString() || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
  
      const { error: userError } = await supabase
        .from('users')
        .insert([user]);
  
      if (userError) {
        console.error('Error creating user details:', userError);
        return { user: null, session: null, error: userError.message };
      }
  
      return {
        user: user as User,
        token: session?.access_token || '',
        expiresAt: session?.expires_at || 0,
        session: null,
        error: null
      };
    } catch (err) {
      console.error('Failed to create customer with user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  },

  createUser: async (email: string, role: string, staffId?: string, roleId?: number): Promise<AuthResponse> => {
    try {
      // Create user in public.users table
      const uuid = uuidv4();
      const user = {
        id: uuid,
        email,
        role,
        staffId: staffId?.toString() || '',
        roleId: roleId?.toString() || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: userError } = await supabase
        .from('users')
        .insert([user]);

      if (userError) {
        console.error('Error creating user details:', userError);
        return { user: null, session: null, error: userError.message };
      }

      return {
        user: user as User,
        token: '',
        expiresAt: 0,
        session: null,
        error: null
      };
    } catch (err) {
      console.error('Failed to create user:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      return { user: null, session: null, error: errorMessage };
    }
  }
};
