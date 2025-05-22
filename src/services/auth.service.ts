import { supabase } from '@/integrations/supabase/client';
import { User, UserFormData, UserRole } from '@/models/user.model';
import { Staff } from '@/models/staff.model';
import { v4 as uuidv4 } from 'uuid';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const getUserFromSupabaseUser = (supabaseUser: any): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    firstName: supabaseUser.user_metadata?.first_name || '',
    lastName: supabaseUser.user_metadata?.last_name || '',
    role: supabaseUser.user_metadata?.role || 'customer',
    staffId: supabaseUser.user_metadata?.staff_id || '',
    profileImage: supabaseUser.user_metadata?.avatar_url || '',
    roleId: supabaseUser.user_metadata?.role_id?.toString() || ''
  };
};

export const authService = {
  // Get all users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');

      if (error) {
        console.error("Error fetching users:", error);
        return { error: error.message };
      }

      return { data: users as User[] };
    } catch (err: any) {
      console.error("Unexpected error fetching users:", err);
      return { error: err.message };
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        return { error: error.message };
      }

      return { data: user as User };
    } catch (err: any) {
      console.error(`Unexpected error fetching user with ID ${id}:`, err);
      return { error: err.message };
    }
  },

  // Create a new user
  createUser: async (user: UserFormData): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            ...user,
            id: uuidv4(), // Generate a UUID for the new user
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        return { error: error.message };
      }

      return { data: data as User };
    } catch (err: any) {
      console.error("Unexpected error creating user:", err);
      return { error: err.message };
    }
  },

  // Update an existing user
  updateUser: async (id: string, user: Partial<UserFormData>): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...user,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        return { error: error.message };
      }

      return { data: data as User };
    } catch (err: any) {
      console.error(`Unexpected error updating user with ID ${id}:`, err);
      return { error: err.message };
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        return { error: error.message };
      }

      return { data: true };
    } catch (err: any) {
      console.error(`Unexpected error deleting user with ID ${id}:`, err);
      return { error: err.message };
    }
  },

  // Get user by email
  getUserByEmail: async (email: string): Promise<ApiResponse<User>> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error(`Error fetching user with email ${email}:`, error);
        return { error: error.message };
      }

      return { data: data as User };
    } catch (err: any) {
      console.error(`Unexpected error fetching user with email ${email}:`, err);
      return { error: err.message };
    }
  },

  // Get staff members
  getStaffMembers: async (): Promise<ApiResponse<Staff[]>> => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'staff');

      if (error) {
        console.error("Error fetching staff members:", error);
        return { error: error.message };
      }

      return { data: users as Staff[] };
    } catch (err: any) {
      console.error("Unexpected error fetching staff members:", err);
      return { error: err.message };
    }
  },

  // Sign up a new user
  signUp: async (email: string, password: string, formData: UserFormData): Promise<ApiResponse<User>> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: formData.role,
            staffId: formData.staffId,
            avatar_url: formData.profileImage,
            roleId: formData.roleId
          }
        }
      });

      if (authError) {
        console.error("Error signing up:", authError);
        return { error: authError.message };
      }

      if (!authData.user) {
        console.error("No user data returned from signup");
        return { error: "Signup failed: No user data returned" };
      }

      const user: User = getUserFromSupabaseUser(authData.user);
      return { data: user };
    } catch (err: any) {
      console.error("Unexpected error signing up:", err);
      return { error: err.message };
    }
  },

  // Sign in an existing user
  signIn: async (email: string, password: string): Promise<ApiResponse<User>> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        console.error("Error signing in:", authError);
        return { error: authError.message };
      }

      if (!authData.user) {
        console.error("No user data returned from signin");
        return { error: "Signin failed: No user data returned" };
      }

      const user: User = getUserFromSupabaseUser(authData.user);
      return { data: user };
    } catch (err: any) {
      console.error("Unexpected error signing in:", err);
      return { error: err.message };
    }
  },

  // Sign out the current user
  signOut: async (): Promise<ApiResponse<boolean>> => {
    try {
      const { error: authError } = await supabase.auth.signOut();

      if (authError) {
        console.error("Error signing out:", authError);
        return { error: authError.message };
      }

      return { data: true };
    } catch (err: any) {
      console.error("Unexpected error signing out:", err);
      return { error: err.message };
    }
  },

  // Reset user password
  resetPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (authError) {
        console.error("Error resetting password:", authError);
        return { error: authError.message };
      }

      return { data: true };
    } catch (err: any) {
      console.error("Unexpected error resetting password:", err);
      return { error: err.message };
    }
  },

  // Update user password
  updatePassword: async (password: string): Promise<ApiResponse<boolean>> => {
    try {
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        password: password,
      });

      if (authError) {
        console.error("Error updating password:", authError);
        return { error: authError.message };
      }

      return { data: true };
    } catch (err: any) {
      console.error("Unexpected error updating password:", err);
      return { error: err.message };
    }
  },

  // Create initial user if none exists
  createInitialUser: async (user: UserFormData): Promise<ApiResponse<User>> => {
    try {
      // Check if any users exist
      const { data: existingUsers, error: selectError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (selectError) {
        console.error("Error checking existing users:", selectError);
        return { error: selectError.message };
      }

      if (existingUsers && existingUsers.length > 0) {
        console.log("Initial user already exists.");
        return { data: existingUsers[0] as User };
      }

      // If no users exist, create the initial user
      const userData = {
        id: uuidv4(),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: user.firstName + ' ' + user.lastName,
        gender: user.gender,
        birth_date: user.birthDate,
        phone: user.phone,
        note: user.note,
        role: user.role,
        hashed_password: 'default-password',  // This should be set properly in a real app
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error("Error creating initial user:", error);
        return { error: error.message };
      }

      return { data: data as User };
    } catch (err: any) {
      console.error("Unexpected error creating initial user:", err);
      return { error: err.message };
    }
  },
};
