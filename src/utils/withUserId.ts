
import { supabase } from '@/integrations/supabase/client';

// Simplified version that avoids recursion and type issues
export async function withUserId(userId: string, tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName as any)
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching ${tableName} by user ID:`, err);
    return [];
  }
}

export default withUserId;
