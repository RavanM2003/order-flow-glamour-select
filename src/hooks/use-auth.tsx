
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithEmail, signOut, signUp, getCurrentUser, updateUserProfile } from '@/services/auth.service';
import { User, UserRole } from '@/models/user.model';
import { toast } from '@/components/ui/use-toast';

interface AuthContextProps {
  user: User | null;
  session: any | null;
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
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user session on mount
    const checkSession = async () => {
      setIsLoading(true);
      
      try {
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error("Session check error:", error);
          setError(error);
        } else if (user) {
          setUser(user);
          // Create a mock session for consistency
          setSession({
            access_token: `mock_token_${user.id}`,
            user: { id: user.id, email: user.email }
          });
        }
      } catch (err) {
        console.error("Session check error:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user, session, error } = await signInWithEmail(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      if (user && session) {
        setUser(user);
        setSession(session);
        // Store user ID in localStorage for session persistence
        localStorage.setItem('current_user_id', user.id);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.full_name || user.email}!`,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Failed to login");
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem('current_user_id');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : "Failed to logout");
      
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
      throw err;
    }
  };

  const register = async (email: string, password: string, userData?: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { user, session, error } = await signUp(email, password, userData);
      
      if (error) {
        throw new Error(error);
      }
      
      if (user && session) {
        setUser(user);
        setSession(session);
        localStorage.setItem('current_user_id', user.id);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register");
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err instanceof Error ? err.message : 'An error occurred',
      });
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
      const { user: updatedUser, error } = await updateUserProfile(user.id, updates);
      
      if (error) {
        throw new Error(error);
      }
      
      if (updatedUser) {
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated."
        });
      }
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
