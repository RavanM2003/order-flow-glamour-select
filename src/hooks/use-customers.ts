
import { useState, useCallback, useEffect, useRef } from "react";
import { useApi } from "./use-api";
import { customerService } from "@/services";
import { Customer } from "@/models/customer.model";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface DatabaseUser {
  id: string;
  birth_date: string | null;
  created_at: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  gender: "male" | "female" | "other" | null;
  note: string | null;
  phone: string;
  updated_at: string | null;
  role: string;
  avatar_url: string | null;
}

// Transform database user to our Customer model
const transformUser = (dbUser: DatabaseUser): Customer => {
  return {
    id: dbUser.id,
    name: dbUser.full_name || `${dbUser.first_name || ''} ${dbUser.last_name || ''}`.trim(),
    email: dbUser.email,
    phone: dbUser.phone,
    gender: dbUser.gender || 'other',
    lastVisit: dbUser.created_at || '',
    totalSpent: 0, // This would need to be calculated from appointments
    birth_date: dbUser.birth_date || '',
    note: dbUser.note || '',
    user_id: dbUser.id, // Same as id since we're working with users table
    created_at: dbUser.created_at || '',
    updated_at: dbUser.updated_at || '',
  };
};

export function useCustomers() {
  const api = useApi<DatabaseUser[]>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fetchedRef = useRef(false);
  const fetchPromiseRef = useRef<Promise<Customer[] | null> | null>(null);

  const fetchCustomers = useCallback(
    async (forceRefresh = false) => {
      // Skip fetching if we've already fetched and no force refresh is requested
      if (fetchedRef.current && !forceRefresh) return customers;

      // If we already have a fetch in progress, return that promise
      if (fetchPromiseRef.current && !forceRefresh) {
        return fetchPromiseRef.current;
      }

      console.log("Fetching customers...");

      try {
        // Start a new fetch and store the promise
        fetchPromiseRef.current = api
          .execute(() => customerService.getAll(), {
            showErrorToast: false, // Don't show error toast yet
            errorPrefix: "Failed to load customers",
          })
          .then(async (data) => {
            if (data && data.length > 0) {
              const transformedData = data.map(user => transformUser(user as unknown as DatabaseUser));
              setCustomers(transformedData);
              fetchedRef.current = true;
              return transformedData;
            }

            // If no data from service, try direct Supabase query
            console.log("Trying to fetch customers directly from Supabase...");
            
            // Get users with role='customer'
            const { data: supabaseData, error } = await supabase
              .from("users")
              .select("*")
              .eq("role", "customer");

            if (error) {
              console.error("Error fetching customers from Supabase:", error);
              toast({
                variant: "destructive",
                title: "Failed to load customers",
                description: error.message,
              });
              return null;
            }

            if (supabaseData && supabaseData.length > 0) {
              // Map users table data to our customer structure
              const transformedData = supabaseData.map(user => transformUser(user as DatabaseUser));
              
              // Sort by most recently updated first
              transformedData.sort((a, b) => 
                new Date(b.updated_at || b.created_at || '').getTime() - 
                new Date(a.updated_at || a.created_at || '').getTime()
              );
              
              setCustomers(transformedData);
              fetchedRef.current = true;
              return transformedData;
            }

            // If everything fails, return null
            return null;
          })
          .catch((error) => {
            console.error("Error in fetchCustomers:", error);
            toast({
              variant: "destructive",
              title: "Failed to load customers",
              description: "Could not load customer data",
            });
            return null;
          })
          .finally(() => {
            // Clear the promise reference when done
            fetchPromiseRef.current = null;
          });

        return fetchPromiseRef.current;
      } catch (error) {
        console.error("Unexpected error in fetchCustomers:", error);
        fetchPromiseRef.current = null;
        return null;
      }
    },
    [api, customers]
  );

  // Only fetch on component mount, not on every render
  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!fetchedRef.current && !fetchPromiseRef.current) {
      fetchCustomers();
    }
    // We intentionally omit fetchCustomers from dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomer = useCallback(async (id: number | string) => {
    const response = await customerService.getById(id);
    return response.data;
  }, []);

  const createCustomer = useCallback(
    async (data: Partial<Customer>) => {
      try {
        const result = await api.execute(() => customerService.create(data), {
          showSuccessToast: true,
          successMessage: "Customer created successfully",
          errorPrefix: "Failed to create customer",
        });

        if (result) {
          // Force a refresh to get the latest data
          await fetchCustomers(true);
        }

        return result;
      } catch (error) {
        console.error("Error in createCustomer:", error);
        return null;
      }
    },
    [api, fetchCustomers]
  );

  const updateCustomer = useCallback(
    async (id: number | string, data: Partial<Customer>) => {
      const result = await api.execute(() => customerService.update(id, data), {
        showSuccessToast: true,
        successMessage: "Customer updated successfully",
        errorPrefix: "Failed to update customer",
        onSuccess: () => {
          fetchCustomers(true);
        },
      });

      return result;
    },
    [api, fetchCustomers]
  );

  return {
    customers,
    isLoading: api.isLoading,
    error: api.error,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
  };
}
