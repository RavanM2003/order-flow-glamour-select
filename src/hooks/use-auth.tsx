
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { config } from '@/config/env';
import { UserRole } from '@/models/user.model';
import { ROLE_PERMISSIONS } from '@/models/role.model';

// Interface for our session state
interface UserSession {
  user: User | null;
  isAuthenticated: boolean;
  profile: {
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    avatar: string | null;
    staffId: number | null;
    roleId: number | null;
  } | null;
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
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [session, setSession] = useState<UserSession>({
    user: null,
    isAuthenticated: false,
    profile: null
  });

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user data directly from users table since we no longer have a profiles table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*, staff(*)')
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Update session state based on auth state
  const updateSessionState = async (session: Session | null) => {
    if (session?.user) {
      // First, update state with basic user data
      setSession(prev => ({
        ...prev,
        user: session.user,
        isAuthenticated: true
      }));
      
      // Then fetch profile in background
      const userData = await fetchUserProfile(session.user.id);
      
      if (userData) {
        // Get the staff record if it exists
        const staffData = userData.staff;
        
        // Handle staffData properly - it could be null, an object, or something else
        let staffId = null;
        if (staffData && typeof staffData === 'object' && !Array.isArray(staffData)) {
          // If it's a non-array object, access the id
          staffId = staffData.id;
        }

        setSession(prev => ({
          ...prev,
          profile: {
            firstName: userData.first_name || null,
            lastName: userData.last_name || null,
            role: userData.role as UserRole,
            avatar: userData.avatar_url || null,
            staffId: staffId,
            roleId: staffId // Using staff ID as role ID since we don't have role_id
          }
        }));
      }
    } else {
      setSession({
        user: null,
        isAuthenticated: false,
        profile: null
      });
    }
    
    setIsLoading(false);
  };

  // Fix auth deadlock by avoiding direct calls within listener
  const safeUpdateSessionState = (session: Session | null) => {
    // Use setTimeout to avoid recursive deadlocks
    setTimeout(() => {
      updateSessionState(session);
    }, 0);
  };

  // Initialize auth state
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSupabaseSession(session);
        safeUpdateSessionState(session);
      }
    );

    // Then check for existing session
    const initAuth = async () => {
      try {
        console.log('Checking for existing session...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session data:', session ? 'Session exists' : 'No session');
        setSupabaseSession(session);
        await updateSessionState(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoading(false);
      }
    };

    initAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          variant: "destructive",
          title: "Giriş uğursuz oldu",
          description: error.message
        });
        setIsLoading(false);
        return false;
      }

      if (data.session) {
        console.log('Login successful');
        toast({
          title: "Giriş uğurlu",
          description: "Xoş gəlmisiniz!"
        });
        return true;
      }

      return false;
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast({
          variant: "destructive",
          title: "Qeydiyyat uğursuz oldu",
          description: error.message
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log('Signup successful');
        toast({
          title: "Qeydiyyat uğurlu",
          description: "Hesabınız yaradıldı. İndi daxil ola bilərsiniz."
        });
        return true;
      }

      return false;
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          variant: "destructive",
          title: "Çıxış xətası",
          description: error.message
        });
      } else {
        console.log('Logout successful');
        toast({
          title: "Çıxış edildi",
          description: "Sistemdən uğurla çıxış etdiniz"
        });
      }
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
    if (!session.isAuthenticated || !session.profile) return false;
    
    // If no specific roles are required, any authenticated user has access
    if (!requiredRoles || requiredRoles.length === 0) return true;
    
    // Super admin role has access to everything
    if (session.profile.role === 'super_admin') return true;
    
    // Check if user's role is in the required roles
    return requiredRoles.includes(session.profile.role);
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!session.isAuthenticated || !session.profile) return false;
    
    const role = session.profile.role as string;
    
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
