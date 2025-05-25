import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "@/models/types";
import type { AuthError } from "@supabase/supabase-js";
import type { User } from "@/models/user.model";

type UserUpdateData = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  gender?: "male" | "female" | "other";
  phone?: string;
  note?: string;
  role?: UserRole;
};

type SignUpData = {
  email?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  firstName?: string;
  role?: UserRole;
  gender?: "male" | "female" | "other";
  phone?: string;
};

type StaffUserData = SignUpData & {
  email: string;
  password?: string;
  birth_date?: string;
};

/**
 * Sign in by checking credentials directly in public.users table
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    console.log("Attempting login with:", { email, password });
    
    // Query the public.users table directly using maybeSingle() to avoid errors when no data found
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("hashed_password", password)
      .maybeSingle();

    console.log("Database query result:", { userData, userError });

    if (userError) {
      console.error("Database error:", userError);
      return { 
        user: null, 
        session: null, 
        error: "Database error occurred" 
      };
    }

    if (!userData) {
      console.log("No user found with provided credentials");
      return { 
        user: null, 
        session: null, 
        error: "Invalid login credentials" 
      };
    }

    // Create a mock session object since we're not using Supabase Auth
    const mockSession = {
      access_token: `mock_token_${userData.id}`,
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      refresh_token: `refresh_${userData.id}`,
      user: {
        id: userData.id,
        email: userData.email,
      }
    };

    // Map database user to our User interface
    const user: User = {
      id: userData.id,
      email: userData.email || "",
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      full_name: userData.full_name || "",
      avatar_url: userData.avatar_url || "",
      role: userData.role as UserRole,
      gender: userData.gender,
      phone: userData.phone || "",
      note: userData.note || "",
      // Add aliases for backward compatibility
      firstName: userData.first_name || "",
      lastName: userData.last_name || "",
    };

    console.log("Login successful for user:", user);

    return {
      user,
      session: mockSession,
      error: null,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      user: null,
      session: null,
      error: "Sign in failed",
    };
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    // Since we're not using Supabase Auth, just clear local storage or session
    localStorage.removeItem('supabase.auth.token');
    return { error: null };
  } catch (error) {
    console.error("Sign out error:", error);
    return { error: "Sign out failed" };
  }
};

const createUserProfile = async (
  userId: string,
  userData: SignUpData,
  role: UserRole
) => {
  const userProfile = {
    id: userId,
    email: userData.email || "",
    first_name: userData.first_name || userData.firstName || "",
    last_name: userData.last_name || userData.lastName || "",
    full_name: `${userData.first_name || userData.firstName || ""} ${
      userData.last_name || userData.lastName || ""
    }`.trim(),
    role: role === "inactive" ? "customer" : role,
    gender: userData.gender || "other",
    phone: userData.phone || "",
    hashed_password: "",
  };

  const { error: profileError } = await supabase
    .from("users")
    .insert([userProfile]);

  if (profileError) {
    throw new Error(profileError.message);
  }

  return userProfile;
};

/**
 * Create a new user account directly in public.users table
 */
export const signUp = async (
  email: string,
  password: string,
  userData: SignUpData = {}
) => {
  try {
    // Generate a new UUID for the user
    const userId = uuidv4();
    
    const userProfile = {
      id: userId,
      email: email,
      hashed_password: password, // Store password directly (consider hashing in production)
      first_name: userData.first_name || userData.firstName || "",
      last_name: userData.last_name || userData.lastName || "",
      full_name: `${userData.first_name || userData.firstName || ""} ${
        userData.last_name || userData.lastName || ""
      }`.trim(),
      role: userData.role && userData.role !== "inactive" ? userData.role : "customer",
      gender: userData.gender || "other",
      phone: userData.phone || "",
    };

    const { data, error } = await supabase
      .from("users")
      .insert([userProfile])
      .select()
      .single();

    if (error) {
      return { user: null, session: null, error: error.message };
    }

    // Create mock session for the new user
    const mockSession = {
      access_token: `mock_token_${data.id}`,
      token_type: "bearer",
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      refresh_token: `refresh_${data.id}`,
      user: {
        id: data.id,
        email: data.email,
      }
    };

    return {
      user: {
        id: data.id,
        email: data.email || "",
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role as UserRole,
        phone: data.phone,
        gender: data.gender,
      },
      session: mockSession,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Sign up error:", error);
    return {
      user: null,
      session: null,
      error: "Sign up failed",
    };
  }
};

/**
 * Get current authenticated user from local storage or session
 */
export const getCurrentUser = async () => {
  try {
    // Since we're not using Supabase Auth, check if we have a stored user session
    const storedToken = localStorage.getItem('current_user_id');
    
    if (!storedToken) {
      return { user: null, error: null };
    }

    // Get user data from users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", storedToken)
      .single();

    if (userError) {
      return { user: null, error: userError.message };
    }

    if (userData) {
      // Map database user to our User interface
      const user: User = {
        id: userData.id,
        email: userData.email || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        full_name: userData.full_name || "",
        avatar_url: userData.avatar_url || "",
        role: userData.role as UserRole,
        gender: userData.gender,
        phone: userData.phone || "",
        note: userData.note || "",
      };

      return { user, error: null };
    }

    return { user: null, error: null };
  } catch (error) {
    console.error("Get current user error:", error);
    return {
      user: null,
      error: "Failed to get current user",
    };
  }
};

/**
 * Get all staff members
 */
export const getAllStaff = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "staff");

    if (error) {
      return { staff: [], error: error.message };
    }

    // Cast the data to Staff[]
    const staff = data.map((user) => ({
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      position: "Staff Member", // Default position
      user_id: user.id,
      email: user.email,
      phone: user.phone || "",
      specializations: [],
      avatar_url: user.avatar_url,
    }));

    return {
      staff,
      error: null,
    };
  } catch (error) {
    console.error("Get all staff error:", error);
    const authError = error as AuthError;
    return {
      staff: [],
      error: authError.message || "Failed to get staff members",
    };
  }
};

/**
 * Create a new staff user
 */
export const createStaffUser = async (userData: StaffUserData) => {
  try {
    // Generate a random password if not provided
    const password = userData.password || uuidv4().substring(0, 12);

    // Create the auth user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password,
      options: {
        data: {
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
        },
      },
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    let user = null;
    if (data.user) {
      // Create user profile with role set to staff
      // Use explicit type casting to match database enum
      const userProfile = {
        id: data.user.id,
        email: userData.email,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        full_name: `${userData.first_name || ""} ${
          userData.last_name || ""
        }`.trim(),
        role: "staff" as const, // Use const assertion to ensure exact type match
        gender: (userData.gender || "other") as "male" | "female" | "other",
        phone: userData.phone || "",
        birth_date: userData.birth_date || null,
        hashed_password: "",
      };

      const { error: profileError } = await supabase
        .from("users")
        .insert([userProfile]);

      if (profileError) {
        console.error("Failed to create staff profile:", profileError);
        return {
          user: null,
          error: profileError.message,
        };
      }

      // Also create an entry in the staff table
      const staffRecord = {
        user_id: data.user.id,
        position: "Staff Member",
        name: `${userData.first_name || ""} ${userData.last_name || ""}`.trim(),
      };

      const { error: staffError } = await supabase
        .from("staff")
        .insert([staffRecord]);

      if (staffError) {
        console.error("Failed to create staff record:", staffError);
      }

      // Map response to our User interface
      user = {
        id: data.user.id,
        email: userData.email,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        role: "staff" as UserRole,
      };
    }

    return {
      user,
      error: null,
    };
  } catch (error: unknown) {
    console.error("Create staff user error:", error);
    const authError = error as AuthError;
    return {
      user: null,
      error: authError.message || "Failed to create staff user",
    };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: UserUpdateData
) => {
  try {
    // Map our User interface to database fields
    const dbUpdates: Record<string, string | UserRole> = {};

    if (updates.first_name !== undefined)
      dbUpdates.first_name = updates.first_name;

    if (updates.last_name !== undefined)
      dbUpdates.last_name = updates.last_name;

    if (updates.full_name !== undefined)
      dbUpdates.full_name = updates.full_name;

    if (updates.avatar_url !== undefined)
      dbUpdates.avatar_url = updates.avatar_url;

    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;

    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;

    if (updates.note !== undefined) dbUpdates.note = updates.note;

    // Handle role conversion - exclude 'inactive' role as it's not in database enum
    if (updates.role !== undefined && updates.role !== "inactive")
      dbUpdates.role = updates.role;

    const { data, error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return { user: null, error: error.message };
    }

    // Map response to our User interface
    const user: User = {
      id: data.id,
      email: data.email,
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      full_name: data.full_name || "",
      avatar_url: data.avatar_url || "",
      role: data.role as UserRole,
      gender: data.gender,
      phone: data.phone || "",
      note: data.note || "",
    };

    return {
      user,
      error: null,
    };
  } catch (error) {
    console.error("Update user profile error:", error);
    const authError = error as AuthError;
    return {
      user: null,
      error: authError.message || "Failed to update user profile",
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
    return { error: authError.message || "Failed to request password reset" };
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
    return { error: authError.message || "Failed to update password" };
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
  updatePasswordWithResetToken,
};
