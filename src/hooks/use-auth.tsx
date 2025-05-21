
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { config } from '@/config/env';
import { UserRole } from '@/models/user.model';
import { ROLE_PERMISSIONS } from '@/models/role.model';

// Interface for our session state
interface UserSession {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
    staffId: number | null;
    roleId: number | null;
  } | null;
  profile: {
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    profileImage: string | null;
  } | null;
  isAuthenticated: boolean;
}

// Create context
interface AuthContextType {
  session: UserSession;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  checkAccess: (requiredRoles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<UserSession>({
    user: null,
    profile: null,
    isAuthenticated: false
  });

  // Check for existing session in localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('auth_user');
    
    if (storedData) {
      try {
        const { user, expiry } = JSON.parse(storedData);
        
        // Check if token is expired
        if (!expiry || expiry > Date.now()) {
          setSession({
            user,
            profile: {
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              profileImage: user.profileImage
            },
            isAuthenticated: true
          });
        } else {
          // Clear expired data
          localStorage.removeItem('auth_user');
        }
      } catch (e) {
        console.error('Failed to parse stored auth data', e);
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  // Login function using public.users table
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login with custom users table:', email);
      
      // Check if the user exists in the custom users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, staff(*)')
        .eq('email', email)
        .single();
        
      if (userError || !userData) {
        console.error('Login error:', userError?.message || 'User not found');
        toast({
          variant: "destructive",
          title: "Giriş uğursuz oldu",
          description: "İstifadəçi adı və ya şifrə səhvdir"
        });
        setIsLoading(false);
        return false;
      }
      
      // For demonstration purposes, password validation is simplified
      // In a real implementation, you would use proper password hashing
      const isPasswordValid = userData.hashed_password === password ||
                            password === 'admin123'; // Hardcoded for demo purposes
      
      if (!isPasswordValid) {
        console.error('Login error: Invalid password');
        toast({
          variant: "destructive",
          title: "Giriş uğursuz oldu",
          description: "İstifadəçi adı və ya şifrə səhvdir"
        });
        setIsLoading(false);
        return false;
      }
      
      // Handle staffData properly - check for existence and proper structure
      let staffId: number | null = null;
      if (userData.staff && typeof userData.staff === 'object') {
        // Type guard to ensure staff has an id property
        if ('id' in userData.staff) {
          staffId = (userData.staff as any).id;
        }
      }
      
      // Create user object
      const user = {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name || userData.email.split('@')[0],
        lastName: userData.last_name || 'Istifadəçi',
        role: (userData.role || 'customer') as UserRole,
        staffId: staffId,
        profileImage: userData.avatar_url,
        roleId: staffId // Using staff ID as role ID
      };
      
      // Create a mock token and expiry (24 hours)
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      
      // Save user to storage
      localStorage.setItem('auth_user', JSON.stringify({
        user,
        expiry: expiresAt
      }));
      
      // Update session
      setSession({
        user,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImage: user.profileImage
        },
        isAuthenticated: true
      });
      
      toast({
        title: "Giriş uğurlu",
        description: "Xoş gəlmisiniz!"
      });
      
      setIsLoading(false);
      return true;
      
    } catch (error) {
      console.error('Login unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Giriş xətası",
        description: "Gözlənilməz bir xəta baş verdi"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting signup for:', email);
      
      // Create a user entry in the users table directly
      const { data: newUserData, error: userError } = await supabase
        .from('users')
        .insert({
          email: email,
          first_name: email.split('@')[0],
          last_name: 'Istifadəçi',
          role: 'customer',
          number: Math.random().toString().slice(2, 12), // Generate random number
          hashed_password: password, // Not secure, but just for demo
          avatar_url: null
        })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user entry:', userError);
        toast({
          variant: "destructive",
          title: "Qeydiyyat uğursuz oldu",
          description: userError.message
        });
        setIsLoading(false);
        return false;
      }
      
      toast({
        title: "Qeydiyyat uğurlu",
        description: "Hesabınız yaradıldı. İndi daxil ola bilərsiniz."
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Qeydiyyat xətası",
        description: "Gözlənilməz bir xəta baş verdi"
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Just remove the local storage item and update state
      localStorage.removeItem('auth_user');
      localStorage.removeItem('MOCK_USER_DATA');
      
      setSession({
        user: null,
        profile: null,
        isAuthenticated: false
      });
      
      toast({
        title: "Çıxış edildi",
        description: "Sistemdən uğurla çıxış etdiniz"
      });
    } catch (error) {
      console.error('Logout unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Çıxış xətası",
        description: "Gözlənilməz bir xəta baş verdi"
      });
    }
  };

  // Check if user has access based on role
  const checkAccess = (requiredRoles: string[]): boolean => {
    if (!session.isAuthenticated || !session.user) return false;
    
    // If no specific roles are required, any authenticated user has access
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    // Super admin role has access to everything
    if (session.user.role === 'super_admin') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(session.user.role);
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!session.isAuthenticated || !session.user) return false;
    
    const role = session.user.role as string;
    
    // Super admin has all permissions
    if (role === 'super_admin') return true;
    
    // Check role permissions
    if (ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
      const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
      return permissions.includes('all') || permissions.includes(permission);
    }
    
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      login, 
      signup,
      logout, 
      isLoading, 
      checkAccess,
      hasPermission
    }}>
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
