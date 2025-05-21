
/**
 * This file manages environment configuration for different operating modes:
 * - local: Uses mock data for development
 * - staging: Uses Supabase for backend operations
 * - prod: Uses a custom API for backend operations
 */

type AppMode = 'local' | 'staging' | 'prod';

interface AppConfig {
  mode: AppMode;
  usesMockData: boolean;
  usesSupabase: boolean;
  usesCustomApi: boolean;
  apiUrl: string | null;
}

// Get environment variables
const appMode = (import.meta.env.VITE_APP_MODE || 'prod') as AppMode; // Changed default to 'prod'
const prodApiUrl = import.meta.env.VITE_PROD_API_URL || null;
const forceMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Configure based on mode
const getConfig = (): AppConfig => {
  switch (appMode) {
    case 'local':
      return {
        mode: 'local',
        usesMockData: true,
        usesSupabase: false,
        usesCustomApi: false,
        apiUrl: null
      };
    
    case 'staging':
      return {
        mode: 'staging',
        usesMockData: forceMockData,
        usesSupabase: true,
        usesCustomApi: false,
        apiUrl: null
      };
    
    case 'prod':
      if (!prodApiUrl) {
        console.error('Production API URL is required when using prod mode');
      }
      
      return {
        mode: 'prod',
        usesMockData: false, // Ensure we're not using mock data in prod
        usesSupabase: false,
        usesCustomApi: true,
        apiUrl: prodApiUrl
      };
    
    default:
      console.warn(`Unknown app mode: ${appMode}, defaulting to prod`); // Changed default to prod
      return {
        mode: 'prod', // Changed default to prod
        usesMockData: false, // Don't use mock data by default in prod
        usesSupabase: false,
        usesCustomApi: true,
        apiUrl: prodApiUrl
      };
  }
};

export const appConfig = getConfig();

// Example API schema for production API
export const apiSchema = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    resetPassword: '/auth/reset-password',
    profile: '/auth/profile'
  },
  
  // Staff
  staff: {
    getAll: '/staff',
    getById: (id: number | string) => `/staff/${id}`,
    create: '/staff',
    update: (id: number | string) => `/staff/${id}`,
    delete: (id: number | string) => `/staff/${id}`,
    
    getPayments: (id: number | string) => `/staff/${id}/payments`,
    getServiceRecords: (id: number | string) => `/staff/${id}/service-records`,
    calculateEarnings: (id: number | string, month: number, year: number) => 
      `/staff/${id}/earnings?month=${month}&year=${year}`,
    
    getWorkingHours: (id: number | string) => `/staff/${id}/working-hours`,
    updateWorkingHours: (id: number | string, dayOfWeek: number) => 
      `/staff/${id}/working-hours/${dayOfWeek}`,
    checkAvailability: (id: number | string, date: Date) => 
      `/staff/${id}/availability?date=${date.toISOString()}`
  },
  
  // Customers
  customers: {
    getAll: '/customers',
    getById: (id: number | string) => `/customers/${id}`,
    create: '/customers',
    update: (id: number | string) => `/customers/${id}`,
    delete: (id: number | string) => `/customers/${id}`,
    
    getAppointments: (id: number | string) => `/customers/${id}/appointments`,
    getPaymentHistory: (id: number | string) => `/customers/${id}/payments`
  },
  
  // Products
  products: {
    getAll: '/products',
    getById: (id: number | string) => `/products/${id}`,
    create: '/products',
    update: (id: number | string) => `/products/${id}`,
    delete: (id: number | string) => `/products/${id}`
  },
  
  // Services
  services: {
    getAll: '/services',
    getById: (id: number | string) => `/services/${id}`,
    create: '/services',
    update: (id: number | string) => `/services/${id}`,
    delete: (id: number | string) => `/services/${id}`,
    
    getProducts: (id: number | string) => `/services/${id}/products`
  },
  
  // Appointments
  appointments: {
    getAll: '/appointments',
    getById: (id: number | string) => `/appointments/${id}`,
    create: '/appointments',
    update: (id: number | string) => `/appointments/${id}`,
    delete: (id: number | string) => `/appointments/${id}`,
    
    getServices: (id: number | string) => `/appointments/${id}/services`,
    getProducts: (id: number | string) => `/appointments/${id}/products`,
    complete: (id: number | string) => `/appointments/${id}/complete`,
    cancel: (id: number | string) => `/appointments/${id}/cancel`
  },
  
  // Payments
  payments: {
    getAll: '/payments',
    getById: (id: number | string) => `/payments/${id}`,
    create: '/payments',
    update: (id: number | string) => `/payments/${id}`,
    delete: (id: number | string) => `/payments/${id}`
  },
  
  // Roles
  roles: {
    getAll: '/roles',
    getById: (id: number | string) => `/roles/${id}`
  }
};
