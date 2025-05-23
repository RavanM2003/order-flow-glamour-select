
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
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
                first_name: profileData.first_name || '',
                last_name: profileData.last_name || '',
                role: profileData.role as UserRole,
                phone: profileData.phone || '',
                note: profileData.note || '',
                gender: profileData.gender,
                birth_date: profileData.birth_date,
                full_name: profileData.full_name,
                avatar_url: profileData.avatar_url,
                // Add aliases for backward compatibility
                firstName: profileData.first_name || '',
                lastName: profileData.last_name || ''
              });
            } else {
              // Basic user data from auth
              setUser({
                id: userData.user.id,
                email: userData.user.email || '',
                role: 'customer' as UserRole,
                first_name: '',
                last_name: '',
                phone: '',
                // Add aliases for backward compatibility
                firstName: '',
                lastName: ''
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
                  first_name: profileData.first_name || '',
                  last_name: profileData.last_name || '',
                  role: profileData.role as UserRole,
                  phone: profileData.phone || '',
                  note: profileData.note || '',
                  gender: profileData.gender,
                  birth_date: profileData.birth_date,
                  full_name: profileData.full_name,
                  avatar_url: profileData.avatar_url,
                  // Add aliases for backward compatibility
                  firstName: profileData.first_name || '',
                  lastName: profileData.last_name || ''
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
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            role: profileData.role as UserRole,
            phone: profileData.phone || '',
            note: profileData.note || '',
            gender: profileData.gender,
            birth_date: profileData.birth_date,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
            // Add aliases for backward compatibility
            firstName: profileData.first_name || '',
            lastName: profileData.last_name || ''
          });
        }
      }

      return;
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      return;
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Failed to logout");
      throw err;
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
            first_name: userData?.first_name || userData?.firstName || '',
            last_name: userData?.last_name || userData?.lastName || '',
          }
        }
      });
      
      if (error) throw error;
      
      // Create a profile record if user is created
      if (data.user) {
        // Filter out 'inactive' role as it's not in database enum
        const role = userData?.role && userData.role !== 'inactive' ? userData.role : 'customer';
        
        const userProfile = {
          id: data.user.id,
          email,
          first_name: userData?.first_name || userData?.firstName || '',
          last_name: userData?.last_name || userData?.lastName || '',
          role: role,
          hashed_password: '',  // Required field for users table
          phone: userData?.phone || '' // Required field for users table
        };
        
        await supabase.from('users').insert(userProfile);
      }

      return;
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Map to database field names and filter out 'inactive' role
      const dbUpdates: any = {
        first_name: updates.first_name || updates.firstName,
        last_name: updates.last_name || updates.lastName,
        avatar_url: updates.avatar_url,
        // Add other fields as needed
      };
      
      // Handle role conversion - exclude 'inactive' role as it's not in database enum
      if (updates.role && updates.role !== 'inactive') {
        dbUpdates.role = updates.role;
      }
      
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
      if (user) {
        setUser({
          ...user,
          ...updates,
          // Ensure aliases are updated too
          firstName: updates.first_name || updates.firstName || user.first_name || user.firstName,
          lastName: updates.last_name || updates.lastName || user.last_name || user.lastName
        });
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });

      return;
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err instanceof Error ? err.message : "Failed to update profile");
      
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile"
      });
      throw err;
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
