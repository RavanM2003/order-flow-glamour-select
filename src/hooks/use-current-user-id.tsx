
import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

/**
 * Hook to get the current user ID
 * 
 * @returns The current user ID or null if no user is logged in
 */
export function useCurrentUserId() {
  const userContext = useContext(UserContext);
  return userContext?.userId || null;
}

export const getCurrentUserId = (): string | null => {
  // Try to get from localStorage
  try {
    const storedData = localStorage.getItem('auth_user');
    if (storedData) {
      const { user } = JSON.parse(storedData);
      return user?.id || null;
    }
  } catch (e) {
    console.error('Failed to get user ID from local storage', e);
  }
  
  return null;
};
