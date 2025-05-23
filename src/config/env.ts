
// Environment Configuration

interface Config {
  title: string;
  api: {
    url: any;
    key: any;
    schema: {
      auth: {
        login: string;
        register: string;
        logout: string;
        resetPassword: string;
        profile: string;
      };
      staff: {
        getAll: string;
        getById: (id: string | number) => string;
        create: string;
        update: (id: string | number) => string;
        delete: (id: string | number) => string;
        getAppointments: (id: string | number) => string;
        getAvailability: (id: string | number) => string;
        setAvailability: (id: string | number) => string;
        getWorkingHours: (id: string | number) => string;
        setWorkingHours: (id: string | number) => string;
        checkAvailability: (id: string | number, date: Date) => string;
      };
      // Other schema definitions here
    };
  };
  features: {
    debugMode: boolean;
    showDebugInfo?: boolean;
  };
  // Add these properties
  usesMockData?: boolean;
  featureFlags?: {
    showDebugInfo?: boolean;
  };
}

export const config: Config = {
  title: "Beauty Salon",
  api: {
    url: import.meta.env.VITE_API_URL || "",
    key: import.meta.env.VITE_API_KEY || "",
    schema: {
      auth: {
        login: "/auth/login",
        register: "/auth/register",
        logout: "/auth/logout",
        resetPassword: "/auth/reset-password",
        profile: "/auth/profile",
      },
      staff: {
        getAll: "/staff",
        getById: (id) => `/staff/${id}`,
        create: "/staff",
        update: (id) => `/staff/${id}`,
        delete: (id) => `/staff/${id}`,
        getAppointments: (id) => `/staff/${id}/appointments`,
        getAvailability: (id) => `/staff/${id}/availability`,
        setAvailability: (id) => `/staff/${id}/availability`,
        getWorkingHours: (id) => `/staff/${id}/working-hours`,
        setWorkingHours: (id) => `/staff/${id}/working-hours`,
        checkAvailability: (id, date) => `/staff/${id}/check-availability?date=${date.toISOString()}`,
      },
      // Other schemas configuration would go here
    }
  },
  features: {
    debugMode: import.meta.env.MODE !== "production",
    showDebugInfo: import.meta.env.MODE !== "production"
  },
  // Add these properties to match the interface
  usesMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  featureFlags: {
    showDebugInfo: import.meta.env.MODE !== "production"
  }
};
