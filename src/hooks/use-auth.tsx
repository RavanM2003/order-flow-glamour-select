
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { User, UserSession } from '@/models/user.model';
import { useToast } from './use-toast';

// Local storage keys
const TOKEN_KEY = 'salon-auth-token';
const USER_KEY = 'salon-auth-user';
const EXPIRES_KEY = 'salon-auth-expires';

// Create context
interface AuthContextType {
  session: UserSession;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  checkAccess: (requiredRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<UserSession>({
    user: null,
    token: null,
    isAuthenticated: false,
    expiresAt: null
  });

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        const savedExpires = localStorage.getItem(EXPIRES_KEY);
        
        if (savedToken && savedUser && savedExpires) {
          const expiresAt = parseInt(savedExpires, 10);
          
          // Check if token has expired
          if (expiresAt > Date.now()) {
            // Token still valid, restore session
            const user = JSON.parse(savedUser) as User;
            setSession({
              user,
              token: savedToken,
              isAuthenticated: true,
              expiresAt
            });
          } else {
            // Token expired, clear storage
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(EXPIRES_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.error || !response.data) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: response.error || "Invalid credentials"
        });
        return false;
      }
      
      const { user, token, expiresAt } = response.data;
      
      // Store session data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(EXPIRES_KEY, expiresAt.toString());
      
      // Update state
      setSession({
        user,
        token,
        isAuthenticated: true,
        expiresAt
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || user.email}!`
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    
    // Reset session state
    setSession({
      user: null,
      token: null,
      isAuthenticated: false,
      expiresAt: null
    });
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };

  // Check if user has access to a feature based on their role
  const checkAccess = (requiredRoles: string[]): boolean => {
    if (!session.isAuthenticated || !session.user) return false;
    
    // If no specific roles are required, any authenticated user has access
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    // Admin role has access to everything
    if (session.user.role === 'admin') return true;
    
    // Check if user's role is in the required roles list
    return requiredRoles.includes(session.user.role);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isLoading, checkAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
