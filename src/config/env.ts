
import { appConfig, apiSchema } from './modes';

// Export the application environment configuration
export const config = {
  ...appConfig,
  
  // API configuration
  api: {
    url: appConfig.apiUrl || import.meta.env.VITE_API_URL,
    key: import.meta.env.VITE_API_KEY,
    schema: apiSchema
  },
  
  // API Base URL (derived from API URL or environment variable)
  apiBaseUrl: appConfig.apiUrl || import.meta.env.VITE_API_URL,
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY
  },
  
  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
  },
  
  // Environment info
  usesMockData: appConfig.usesMockData,
  usesSupabase: appConfig.usesSupabase,
  usesCustomApi: appConfig.usesCustomApi,
  
  // Feature flags for debug display
  featureFlags: {
    showDebugInfo: import.meta.env.VITE_DEBUG_MODE === 'true'
  }
};

// Export current environment for convenience
export const currentEnv = appConfig.mode;
