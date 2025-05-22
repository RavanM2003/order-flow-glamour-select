
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null; // Added session property
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session on mount
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setSession(data.session);
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData.user) {
            // Get additional user data from users table if needed
            const { data: profileData } = await supabase
              .from('users')
              .select('*')
              .eq('id', userData.user.id)
              .single();
            
            if (profileData) {
              // Set user with proper type handling
              setUser({
                id: userData.user.id,
                email: userData.user.email || '',
                firstName: profileData.first_name || '',
                lastName: profileData.last_name || '',
                role: profileData.role as UserRole,
                staffId: profileData.staff_id || '',
                profileImage: profileData.avatar_url || '',
                roleId: profileData.role_id?.toString() || ''
              });
            } else {
              // Basic user data from auth
              setUser({
                id: userData.user.id,
                email: userData.user.email || '',
                role: 'customer' as UserRole,
                firstName: '',
                lastName: '',
                staffId: '',
                profileImage: '',
                roleId: ''
              });
            }
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    
    // Auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setSession(session);
          setIsLoading(true);
          
          try {
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData.user) {
              // Get profile data
              const { data: profileData } = await supabase
                .from('users')
                .select('*')
                .eq('id', userData.user.id)
                .single();
              
              if (profileData) {
                setUser({
                  id: userData.user.id,
                  email: userData.user.email || '',
                  firstName: profileData.first_name || '',
                  lastName: profileData.last_name || '',
                  role: profileData.role as UserRole,
                  staffId: profileData.staff_id || '',
                  profileImage: profileData.avatar_url || '',
                  roleId: profileData.role_id?.toString() || ''
                });
              }
            }
          } catch (err) {
            console.error("Auth state change error:", err);
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        setSession(data.session);
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileData) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || '',
            role: profileData.role as UserRole,
            staffId: profileData.staff_id || '',
            profileImage: profileData.avatar_url || '',
            roleId: profileData.role_id?.toString() || ''
          });
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  };

  const register = async (email: string, password: string, userData?: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: userData?.firstName || '',
            last_name: userData?.lastName || '',
          }
        }
      });
      
      if (error) throw error;
      
      // Create a profile record if user is created
      if (data.user) {
        const userProfile = {
          id: data.user.id,
          email,
          first_name: userData?.firstName || '',
          last_name: userData?.lastName || '',
          role: userData?.role || 'customer',
          hashed_password: '', // Required field for users table
          phone: userData?.phone || '' // Required field for users table
        };
        
        await supabase.from('users').insert([userProfile]);
        
        // Don't set user here as the onAuthStateChange will handle it
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Map to database field names
      const dbUpdates: any = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        avatar_url: updates.profileImage,
        // Add other fields as needed
      };
      
      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key] === undefined) {
          delete dbUpdates[key];
        }
      });
      
      const { error } = await supabase
        .from('users')
        .update(dbUpdates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Fix the partial user update
      setUser(prevUser => {
        if (!prevUser) return null;
        return {
          ...prevUser,
          ...updates
        };
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
