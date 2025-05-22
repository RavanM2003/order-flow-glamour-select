
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/models/user.model';
import { supabase } from '@/integrations/supabase/client';

// Context interface
interface UserContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  setCurrentUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  getUserId: () => string | null;
}

// Default context value
const defaultContextValue: UserContextType = {
  currentUser: null,
  isLoading: true,
  error: null,
  setCurrentUser: () => {},
  refreshUser: async () => {},
  getUserId: () => null,
};

// Create context
const UserContext = createContext<UserContextType>(defaultContextValue);

// Provider props
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedData = localStorage.getItem('auth_user');
      if (storedData) {
        try {
          const { user } = JSON.parse(storedData);
          if (user) {
            setCurrentUser(user);
          }
        } catch (err) {
          console.error('Failed to parse stored user data', err);
          setError('Failed to load user data');
        }
      }
      setIsLoading(false);
    };

    loadUserFromStorage();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch complete user data from our users table
        const getUserData = async () => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          if (data) {
            setCurrentUser(data as User);
            localStorage.setItem('auth_user', JSON.stringify({ user: data }));
          }
        };

        // Use setTimeout to avoid potential deadlocks
        setTimeout(() => {
          getUserData();
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        localStorage.removeItem('auth_user');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Get fresh user data from the database
  const refreshUser = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCurrentUser(data as User);
        localStorage.setItem('auth_user', JSON.stringify({ user: data }));
      }
    } catch (err) {
      console.error('Error refreshing user data', err);
      setError('Failed to refresh user data');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user ID
  const getUserId = () => {
    return currentUser?.id || null;
  };

  // Context value
  const value = {
    currentUser,
    isLoading,
    error,
    setCurrentUser,
    refreshUser,
    getUserId,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
