
import { useUser } from '@/context/UserContext';

/**
 * Hook to get the current user ID for database operations
 * 
 * @returns An object with the current user ID and a method to attach it to data objects
 */
export function useCurrentUserId() {
  const { getUserId } = useUser();
  
  /**
   * Attaches the current user ID to an object for database operations
   * 
   * @param data The data object to attach the user_id to
   * @returns The data with user_id attached
   */
  const withUserId = <T extends Record<string, any>>(data: T): T & { user_id: string } => {
    const userId = getUserId();
    
    if (!userId) {
      console.warn('No user ID available for operation. Make sure user is authenticated.');
      return { ...data, user_id: 'anonymous' } as T & { user_id: string };
    }
    
    return { ...data, user_id: userId };
  };
  
  return {
    userId: getUserId(),
    withUserId,
  };
}
