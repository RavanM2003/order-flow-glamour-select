
import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './use-api';
import { customerService } from '@/services';
import { Customer, CustomerFormData } from '@/models/customer.model';

export function useCustomers() {
  const api = useApi<Customer[]>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fetchedRef = useRef(false);
  
  const fetchCustomers = useCallback(async (forceRefresh = false) => {
    // Skip fetching if we've already fetched and no force refresh is requested
    if (fetchedRef.current && !forceRefresh) return;
    
    const data = await api.execute(
      () => customerService.getAll(),
      {
        showErrorToast: true,
        errorPrefix: 'Failed to load customers'
      }
    );
    
    if (data) {
      setCustomers(data);
      fetchedRef.current = true;
    }
  }, [api]);
  
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  
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
