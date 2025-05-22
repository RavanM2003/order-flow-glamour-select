
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/models/customer.model';
import { useToast } from './use-toast';

// Define CustomerFormData type
export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  address?: string;
}

// Define database customer type for mapping
interface DatabaseCustomer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  gender?: string;
  birth_date?: string;
  note?: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Map database customer to frontend customer model
  const mapDbCustomerToCustomer = useCallback((dbCustomer: DatabaseCustomer): Customer => {
    return {
      id: dbCustomer.id,
      name: dbCustomer.full_name || '',
      email: dbCustomer.email || '',
      phone: dbCustomer.phone || '',
      gender: dbCustomer.gender || 'other',
      birth_date: dbCustomer.birth_date,
      note: dbCustomer.note,
      lastVisit: '',  // Would be calculated from appointments
      totalSpent: 0,   // Would be calculated from payments
      created_at: dbCustomer.created_at,
      updated_at: dbCustomer.updated_at,
    };
  }, []);

  // Fetch all customers
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'customer');

      if (error) throw new Error(error.message);

      if (data) {
        const mappedCustomers = data.map(mapDbCustomerToCustomer);
        setCustomers(mappedCustomers);
      }
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching customers',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [mapDbCustomerToCustomer, toast]);

  // Create a new customer
  const createCustomer = useCallback(async (customerData: CustomerFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform frontend model to database model
      const dbCustomer = {
        full_name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        gender: customerData.gender || 'other',
        birth_date: customerData.birth_date,
        note: customerData.note,
        role: 'customer',
        hashed_password: 'temp_password_hash' // Required field in the database
      };

      const { data, error } = await supabase
        .from('users')
        .insert([dbCustomer])
        .select();

      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        const newCustomer = mapDbCustomerToCustomer(data[0] as DatabaseCustomer);
        setCustomers(prev => [...prev, newCustomer]);
        toast({
          title: 'Customer created',
          description: `${newCustomer.name} has been added successfully.`
        });
        return newCustomer;
      }
      return null;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error creating customer',
        description: err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [mapDbCustomerToCustomer, toast]);

  // Update an existing customer
  const updateCustomer = useCallback(async (id: string, customerData: Partial<CustomerFormData>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform frontend model to database model
      const dbCustomer: any = {};
      
      if (customerData.name !== undefined) dbCustomer.full_name = customerData.name;
      if (customerData.email !== undefined) dbCustomer.email = customerData.email;
      if (customerData.phone !== undefined) dbCustomer.phone = customerData.phone;
      if (customerData.gender !== undefined) dbCustomer.gender = customerData.gender;
      if (customerData.birth_date !== undefined) dbCustomer.birth_date = customerData.birth_date;
      if (customerData.note !== undefined) dbCustomer.note = customerData.note;

      const { data, error } = await supabase
        .from('users')
        .update(dbCustomer)
        .eq('id', id)
        .select();

      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        const updatedCustomer = mapDbCustomerToCustomer(data[0] as DatabaseCustomer);
        setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
        toast({
          title: 'Customer updated',
          description: `${updatedCustomer.name} has been updated successfully.`
        });
        return updatedCustomer;
      }
      return null;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error updating customer',
        description: err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [mapDbCustomerToCustomer, toast]);

  // Delete a customer
  const deleteCustomer = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      setCustomers(prev => prev.filter(c => c.id !== id));
      toast({
        title: 'Customer deleted',
        description: 'Customer has been deleted successfully.'
      });
      return true;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error deleting customer',
        description: err.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Get a single customer by ID
  const getCustomerById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('role', 'customer')
        .single();

      if (error) throw new Error(error.message);

      if (data) {
        return mapDbCustomerToCustomer(data as DatabaseCustomer);
      }
      return null;
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Error fetching customer',
        description: err.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [mapDbCustomerToCustomer, toast]);

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
  };
}
