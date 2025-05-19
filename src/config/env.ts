
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
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_KEY
  },
  
  // Feature flags
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
  }
};
