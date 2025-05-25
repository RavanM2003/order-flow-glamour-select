import { QueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

type AuthContext = ReturnType<typeof useAuth>;

// Known table names for type safety
type TableName =
  | "users"
  | "appointments"
  | "products"
  | "services"
  | "staff"
  | "service_categories"
  | "product_categories"
  | "appointment_services"
  | "appointment_products";

type ApiResponse<T> = {
  data: T | T[] | null;
  error?: string;
};

// Create a function that wraps API functions with user_id
export function withUserId<
  T extends (...args: unknown[]) => Promise<ApiResponse<unknown>>
>(
  apiFunction: T,
  auth: AuthContext,
  options: {
    tableName?: TableName;
    requireAuth?: boolean;
    queryClient?: QueryClient;
    queryKey?: string[];
  } = {}
): T {
  const { tableName, requireAuth = true } = options;

  // Create a new function that includes the user_id in the request
  const wrappedFunction = async (...args: Parameters<T>) => {
    const userId = auth?.user?.id;

    if (requireAuth && !userId) {
      throw new Error("Authentication required");
    }

    // If the last argument is an object (usually options), include user_id
    // Otherwise, append a new object with user_id
    const lastArgIndex = args.length - 1;
    const lastArg = args[lastArgIndex];

    if (tableName) {
      // If it's a direct Supabase query
      if (typeof lastArg === "object" && lastArg !== null) {
        args[lastArgIndex] = { ...lastArg, user_id: userId };
      } else {
        args.push({ user_id: userId } as Record<string, unknown>);
      }
    }

    try {
      // Call the original API function with the modified arguments
      const result = await apiFunction(...args);

      // If result is from Supabase and tableName is provided
      if (
        tableName &&
        result &&
        typeof result === "object" &&
        "data" in result
      ) {
        // For list queries, update each item with user_id if not already present
        if (Array.isArray(result.data)) {
          result.data = result.data.map((item: Record<string, unknown>) =>
            item.user_id ? item : { ...item, user_id: userId }
          );
        }
        // For single item queries, update with user_id if not already present
        else if (result.data && typeof result.data === "object") {
          const data = result.data as Record<string, unknown>;
          result.data = data.user_id ? data : { ...data, user_id: userId };
        }
      }

      return result;
    } catch (error) {
      console.error("API call error:", error);
      throw error;
    }
  };

  return wrappedFunction as T;
}

// Simplified helper function for direct Supabase queries
export function queryWithUserId<
  T extends { eq: (key: string, value: string) => T }
>(query: T, userId: string): T {
  return query.eq("user_id", userId);
}

export default withUserId;
