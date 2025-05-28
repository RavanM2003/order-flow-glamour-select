
import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    }
  }
});

// Query key factories for consistency
export const queryKeys = {
  all: ['app'] as const,
  
  users: () => [...queryKeys.all, 'users'] as const,
  user: (id: string) => [...queryKeys.users(), id] as const,
  customers: (filters?: any) => [...queryKeys.users(), 'customers', filters] as const,
  staff: (filters?: any) => [...queryKeys.users(), 'staff', filters] as const,
  
  services: () => [...queryKeys.all, 'services'] as const,
  service: (id: number) => [...queryKeys.services(), id.toString()] as const,
  servicesWithCategory: (filters?: any) => [...queryKeys.services(), 'with-category', filters] as const,
  servicesByStaff: (staffId: string) => [...queryKeys.services(), 'by-staff', staffId] as const,
  
  products: () => [...queryKeys.all, 'products'] as const,
  product: (id: number) => [...queryKeys.products(), id.toString()] as const,
  productsInStock: () => [...queryKeys.products(), 'in-stock'] as const,
  
  appointments: () => [...queryKeys.all, 'appointments'] as const,
  appointment: (id: number) => [...queryKeys.appointments(), id.toString()] as const,
  appointmentsByDate: (date: string) => [...queryKeys.appointments(), 'by-date', date] as const,
  appointmentsByCustomer: (customerId: string) => [...queryKeys.appointments(), 'by-customer', customerId] as const,
  appointmentsByStaff: (staffId: string) => [...queryKeys.appointments(), 'by-staff', staffId] as const,
  appointmentSummary: (id: number) => [...queryKeys.appointment(id), 'summary'] as const,
  
  settings: () => [...queryKeys.all, 'settings'] as const,
  setting: (key: string, lang?: string) => [...queryKeys.settings(), key, lang || 'az'] as const,
  
  transactions: () => [...queryKeys.all, 'transactions'] as const,
  transactionsByDate: (from: string, to: string) => [...queryKeys.transactions(), 'by-date', from, to] as const,
  
  analytics: () => [...queryKeys.all, 'analytics'] as const,
  dashboardStats: () => [...queryKeys.analytics(), 'dashboard'] as const,
} as const;
