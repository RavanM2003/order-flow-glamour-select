
import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './use-api';
import { customerService } from '@/services';
import { Customer, CustomerFormData } from '@/models/customer.model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useCustomers() {
  const api = useApi<Customer[]>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fetchedRef = useRef(false);
  const fetchPromiseRef = useRef<Promise<Customer[] | null> | null>(null);
  
  const fetchCustomers = useCallback(async (forceRefresh = false) => {
    // Skip fetching if we've already fetched and no force refresh is requested
    if (fetchedRef.current && !forceRefresh) return customers;
    
    // If we already have a fetch in progress, return that promise
    if (fetchPromiseRef.current && !forceRefresh) {
      return fetchPromiseRef.current;
    }
    
    console.log('Fetching customers...');
    
    // Try to get data from Supabase directly if service doesn't work
    try {
      // Start a new fetch and store the promise
      fetchPromiseRef.current = api.execute(
        () => customerService.getAll(),
        {
          showErrorToast: false, // Don't show error toast yet
          errorPrefix: 'Failed to load customers'
        }
      ).then(async (data) => {
        if (data && data.length > 0) {
          setCustomers(data);
          fetchedRef.current = true;
          return data;
        }
        
        // If no data from service, try direct Supabase query
        console.log('Trying to fetch customers directly from Supabase...');
        const { data: supabaseData, error } = await supabase
          .from('customers')
          .select('*');
          
        if (error) {
          console.error('Error fetching customers from Supabase:', error);
          toast({
            variant: "destructive",
            title: "Failed to load customers",
            description: error.message
          });
          return null;
        }
        
        if (supabaseData && supabaseData.length > 0) {
          setCustomers(supabaseData);
          fetchedRef.current = true;
          return supabaseData;
        }
        
        // If everything fails, return null
        return null;
      }).catch(error => {
        console.error('Error in fetchCustomers:', error);
        toast({
          variant: "destructive",
          title: "Failed to load customers",
          description: "Could not load customer data"
        });
        return null;
      }).finally(() => {
        // Clear the promise reference when done
        fetchPromiseRef.current = null;
      });
      
      return fetchPromiseRef.current;
    } catch (error) {
      console.error('Unexpected error in fetchCustomers:', error);
      fetchPromiseRef.current = null;
      return null;
    }
  }, [api, customers]);
  
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
  
  const createCustomer = useCallback(async (data: CustomerFormData) => {
    const result = await api.execute(
      () => customerService.create(data),
      {
        showSuccessToast: true,
        successMessage: 'Customer created successfully',
        errorPrefix: 'Failed to create customer',
        onSuccess: () => {
          fetchCustomers(true);
        }
      }
    );
    
    return result;
  }, [api, fetchCustomers]);
  
  const updateCustomer = useCallback(async (id: number | string, data: CustomerFormData) => {
    const result = await api.execute(
      () => customerService.update(id, data),
      {
        showSuccessToast: true,
        successMessage: 'Customer updated successfully',
        errorPrefix: 'Failed to update customer',
        onSuccess: () => {
          fetchCustomers(true);
        }
      }
    );
    
    return result;
  }, [api, fetchCustomers]);
  
  return {
    customers,
    isLoading: api.isLoading,
    error: api.error,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer
  };
}
