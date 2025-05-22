// Only the context creation and export needs to be modified to ensure proper export
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: Partial<User>) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  fetchUserProfile: () => Promise<User | null>;
  userId: string | null;
}

// Export the UserContext so it can be imported elsewhere
export const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateProfile: async () => {},
  fetchUserProfile: async () => null,
  userId: null
});

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const user = await fetchUserProfile(session.user.id);
          if (user) {
            setUser(user);
            setUserId(user.id);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const user = await fetchUserProfile(session.user.id);
        if (user) {
          setUser(user);
          setUserId(user.id);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId?: string): Promise<User | null> => {
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
      
      if (!userId) return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      if (data) {
        // Map to User interface for compatibility
        const userProfile: User = {
          ...data,
          // Add aliases for backward compatibility
          firstName: data.first_name,
          lastName: data.last_name,
          // Ensure role is properly typed
          role: data.role as UserRole
        };
        return userProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = await fetchUserProfile(data.user.id);
        
        if (userProfile) {
          setUser(userProfile);
          setUserId(userProfile.id);
          toast({
            title: "Uğurla daxil oldunuz",
            description: `Xoş gəldin, ${userProfile.full_name || userProfile.email}!`,
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
      toast({
        variant: "destructive",
        title: "Daxil ola bilmədi",
        description: error instanceof Error ? error.message : 'Xəta baş verdi',
      });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserId(null);
      toast({
        title: "Çıxış edildi",
        description: "Uğurla hesabdan çıxış etdiniz.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      setError(error instanceof Error ? error.message : 'Logout failed');
      toast({
        variant: "destructive",
        title: "Çıxış edilə bilmədi",
        description: error instanceof Error ? error.message : 'Xəta baş verdi',
      });
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, userData?: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: userData?.first_name || userData?.firstName,
            last_name: userData?.last_name || userData?.lastName,
            full_name: userData?.full_name || `${userData?.first_name || userData?.firstName || ''} ${userData?.last_name || userData?.lastName || ''}`.trim(),
            // Add any other user data here
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Optionally create or update the user profile in the users table
        // This might be needed if you have additional user fields not in auth.users
        if (userData && Object.keys(userData).length > 0) {
          await updateProfile(userData);
        }
        
        toast({
          title: "Qeydiyyat uğurlu oldu",
          description: "Hesabınız uğurla yaradıldı.",
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed');
      toast({
        variant: "destructive",
        title: "Qeydiyyat uğursuz oldu",
        description: error instanceof Error ? error.message : 'Xəta baş verdi',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Update the local user state ensuring proper typing
        setUser({
          ...user,
          ...data,
          role: data.role as UserRole
        });
        
        toast({
          title: "Profil yeniləndi",
          description: "Profiliniz uğurla yeniləndi.",
        });
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error instanceof Error ? error.message : 'Profile update failed');
      toast({
        variant: "destructive",
        title: "Profil yenilənə bilmədi",
        description: error instanceof Error ? error.message : 'Xəta baş verdi',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      register,
      updateProfile,
      fetchUserProfile,
      userId
    }}>
      {children}
    </UserContext.Provider>
  );
};
