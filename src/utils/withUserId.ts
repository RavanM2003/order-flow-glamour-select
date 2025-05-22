
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the current user ID from localStorage
 * 
 * @returns The current user ID or null if not found
 */
export function getCurrentUserId(): string | null {
  try {
    const authData = localStorage.getItem('auth_user');
    if (authData) {
      const { user } = JSON.parse(authData);
      return user?.id || null;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving current user ID:', error);
    return null;
  }
}

/**
 * Helper function to add the current user ID to any data object
 * 
 * @param data The data object to add user_id to
 * @returns A new object with user_id added
 */
export function withUserId<T extends Record<string, any>>(data: T): T & { user_id: string | null } {
  const userId = getCurrentUserId();
  return {
    ...data,
    user_id: userId
  };
}

/**
 * Creates a Supabase insert that automatically includes the current user ID
 * 
 * @param tableName The table to insert into
 * @param data The data to insert
 * @returns The Supabase query builder
 */
export function insertWithUserId<T extends Record<string, any>>(
  tableName: "appointments" | "products" | "users" | "services" | "service_categories" | "staff" | 
  "appointment_products" | "appointment_services" | "histories" | "invoices" | "payments" | 
  "product_categories" | "promo_codes" | "service_products" | "staff_availability", 
  data: T
) {
  const dataWithUserId = withUserId(data);
  return supabase.from(tableName).insert(dataWithUserId);
}

/**
 * Creates a Supabase update that automatically includes the current user ID for tracking
 * 
 * @param tableName The table to update
 * @param data The data to update
 * @param matchColumn The column to match (typically 'id')
 * @param matchValue The value to match on
 * @returns The Supabase query builder
 */
export function updateWithUserId<T extends Record<string, any>>(
  tableName: "appointments" | "products" | "users" | "services" | "service_categories" | "staff" | 
  "appointment_products" | "appointment_services" | "histories" | "invoices" | "payments" | 
  "product_categories" | "promo_codes" | "service_products" | "staff_availability",
  data: T, 
  matchColumn: string,
  matchValue: string | number
) {
  // For updates, we may want to track who updated the record
  // but not necessarily change the original creator
  const dataWithUpdaterId = { 
    ...data,
    updated_by: getCurrentUserId()
  };
  
  return supabase.from(tableName).update(dataWithUpdaterId).eq(matchColumn, matchValue);
}
