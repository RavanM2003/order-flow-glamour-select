
// Only the context creation and export needs to be modified to ensure proper export
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';

interface UserContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  fetchUserProfile: () => Promise<User | null>;
  userId: string | null;
}

// Export the UserContext so it can be imported elsewhere
export const UserContext = createContext<UserContextProps>({
  user: null,
  loading: true,
  error: null,
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

  // Update user profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Map role to string for database storage and filter out 'inactive' role
      const dbUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Handle role conversion - exclude 'inactive' role as it's not in database enum
      if (updates.role && updates.role !== 'inactive') {
        dbUpdates.role = updates.role;
      } else if (updates.role === 'inactive') {
        // Default to 'customer' if 'inactive' role is provided
        dbUpdates.role = 'customer';
      }

      const { data, error } = await supabase
        .from('users')
        .update(dbUpdates)
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
      updateProfile,
      fetchUserProfile,
      userId
    }}>
      {children}
    </UserContext.Provider>
  );
};
