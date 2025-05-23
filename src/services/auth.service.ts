
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '@/models/types';
import type { AuthError } from '@supabase/supabase-js';
import type { User } from '@/models/user.model';

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { user: null, session: null, error: error.message };
    }
    
    let user = null;
    
    if (data.user) {
      // Get user profile data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error("Failed to fetch user data:", userError);
      }
      
      if (userData) {
        // Map Supabase user to our User interface
        user = {
          id: data.user.id,
          email: data.user.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          full_name: userData.full_name || '',
          avatar_url: userData.avatar_url || '',
          role: userData.role as UserRole,
          gender: userData.gender,
          phone: userData.phone || '',
          note: userData.note || '',
          token: data.session?.access_token || '',
          // Add aliases for backward compatibility
          firstName: userData.first_name || '',
          lastName: userData.last_name || ''
        };
      } else {
        // If no user profile found, use basic auth data
        user = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'customer' as UserRole,
        };
      }
    }
    
    return {
      user,
      session: data.session,
      error: null
    };
  } catch (error) {
    console.error("Sign in error:", error);
    const authError = error as AuthError;
    return {
      user: null,
      session: null,
      error: authError.message || 'Sign in failed'
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    const authError = error as AuthError;
    return { error: authError.message || 'Sign out failed' };
  }
};

/**
 * Create a new user account
 */
export const signUp = async (email: string, password: string, userData: any = {}) => {
  try {
    // First create the auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name || userData.firstName || '',
          last_name: userData.last_name || userData.lastName || ''
        }
      }
    });

    if (error) {
      return {
        user: null,
        session: null,
        error: error.message
      };
    }

    let user = null;
    if (data.user) {
      // Filter out 'inactive' role as it's not in database enum
      const role = userData.role && userData.role !== 'inactive' ? userData.role : 'customer';
      
      // Create user profile record with additional data
      const userProfile = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || '',
        full_name: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim(),
        role: role,
        gender: userData.gender || 'other',
        phone: userData.phone || '',
        hashed_password: '' // Password is handled by auth, this is just for schema compatibility
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert([userProfile]);

      if (profileError) {
        console.error("Failed to create user profile:", profileError);
        return {
          user: null,
          session: null,
          error: profileError.message
        };
      }

      // Map response to our User interface
      user = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || '',
        role: role as UserRole,
        phone: userData.phone || '',
        gender: userData.gender || 'other',
        token: data.session?.access_token || ''
      };
    }

    return {
      user,
      session: data.session,
      error: null
    };
  } catch (error: any) {
    console.error("Sign up error:", error);
    const authError = error;
    return {
      user: null,
      session: null,
      error: authError.message || 'Sign up failed'
    };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      return { user: null, error: error.message };
    }
    
    let user = null;
    
    if (data.user) {
      // Get user profile data from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Failed to fetch user data:", userError);
      }
      
      if (userData) {
        // Map Supabase user to our User interface
        user = {
          id: data.user.id,
          email: data.user.email || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          full_name: userData.full_name || '',
          avatar_url: userData.avatar_url || '',
          role: userData.role as UserRole,
          gender: userData.gender,
          phone: userData.phone || '',
          note: userData.note || '',
          // Remove references to roleId that doesn't exist
        };
      } else {
        // If no user profile found, use basic auth data
        user = {
          id: data.user.id,
          email: data.user.email || '',
          role: 'customer' as UserRole,
        };
      }
    }
    
    return {
      user,
      error: null
    };
  } catch (error) {
    console.error("Get current user error:", error);
    const authError = error as AuthError;
    return {
      user: null,
      error: authError.message || 'Failed to get current user'
    };
  }
};

/**
 * Get all staff members
 */
export const getAllStaff = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'staff');
    
    if (error) {
      return { staff: [], error: error.message };
    }
    
    // Cast the data to Staff[]
    const staff = data.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      position: 'Staff Member', // Default position
      user_id: user.id,
      email: user.email,
      phone: user.phone || '',
      specializations: [],
      avatar_url: user.avatar_url
    }));
    
    return {
      staff,
      error: null
    };
  } catch (error) {
    console.error("Get all staff error:", error);
    const authError = error as AuthError;
    return {
      staff: [],
      error: authError.message || 'Failed to get staff members'
    };
  }
};

/**
 * Create a new staff user
 */
export const createStaffUser = async (userData: any) => {
  try {
    // Generate a random password if not provided
    const password = userData.password || uuidv4().substring(0, 12);

    // Create the auth user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password,
      options: {
        data: {
          first_name: userData.first_name || '',
          last_name: userData.last_name || ''
        }
      }
    });

    if (error) {
      return {
        user: null,
        error: error.message
      };
    }

    let user = null;
    if (data.user) {
      // Create user profile with role set to staff
      // Use explicit type casting to match database enum
      const userProfile = {
        id: data.user.id,
        email: userData.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        role: 'staff' as const, // Use const assertion to ensure exact type match
        gender: (userData.gender || 'other') as 'male' | 'female' | 'other',
        phone: userData.phone || '',
        birth_date: userData.birth_date || null,
        hashed_password: ''
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert([userProfile]);

      if (profileError) {
        console.error("Failed to create staff profile:", profileError);
        return {
          user: null,
          error: profileError.message
        };
      }

      // Also create an entry in the staff table
      const staffRecord = {
        user_id: data.user.id,
        position: 'Staff Member',
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
      };

      const { error: staffError } = await supabase
        .from('staff')
        .insert([staffRecord]);

      if (staffError) {
        console.error("Failed to create staff record:", staffError);
      }

      // Map response to our User interface
      user = {
        id: data.user.id,
        email: userData.email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        role: 'staff' as UserRole
      };
    }

    return {
      user,
      error: null
    };
  } catch (error: any) {
    console.error("Create staff user error:", error);
    const authError = error;
    return {
      user: null,
      error: authError.message || 'Failed to create staff user'
    };
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    // Map our User interface to database fields
    const dbUpdates: Record<string, any> = {};
    
    if (updates.first_name !== undefined) 
      dbUpdates.first_name = updates.first_name;
    
    if (updates.last_name !== undefined) 
      dbUpdates.last_name = updates.last_name;
    
    if (updates.full_name !== undefined) 
      dbUpdates.full_name = updates.full_name;
    
    if (updates.avatar_url !== undefined) 
      dbUpdates.avatar_url = updates.avatar_url;
    
    if (updates.gender !== undefined) 
      dbUpdates.gender = updates.gender;
    
    if (updates.phone !== undefined) 
      dbUpdates.phone = updates.phone;
    
    if (updates.note !== undefined) 
      dbUpdates.note = updates.note;
    
    // Handle role conversion - exclude 'inactive' role as it's not in database enum
    if (updates.role !== undefined && updates.role !== 'inactive') 
      dbUpdates.role = updates.role;
    
    const { data, error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return { user: null, error: error.message };
    }
    
    // Map response to our User interface
    const user: User = {
      id: data.id,
      email: data.email,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      full_name: data.full_name || '',
      avatar_url: data.avatar_url || '',
      role: data.role as UserRole,
      gender: data.gender,
      phone: data.phone || '',
      note: data.note || '',
    };
    
    return {
      user,
      error: null
    };
  } catch (error) {
    console.error("Update user profile error:", error);
    const authError = error as AuthError;
    return {
      user: null,
      error: authError.message || 'Failed to update user profile'
    };
  }
};

/**
 * Password reset request
 */
export const requestPasswordReset = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Password reset request error:", error);
    const authError = error as AuthError;
    return { error: authError.message || 'Failed to request password reset' };
  }
};

/**
 * Update password with reset token
 */
export const updatePasswordWithResetToken = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    console.error("Update password error:", error);
    const authError = error as AuthError;
    return { error: authError.message || 'Failed to update password' };
  }
};

export const authService = {
  signInWithEmail,
  signOut,
  signUp,
  getCurrentUser,
  getAllStaff,
  createStaffUser,
  updateUserProfile,
  requestPasswordReset,
  updatePasswordWithResetToken
};
