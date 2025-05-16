
// Environment configuration system

// Define environment types
export type Environment = 'local' | 'test' | 'production';

// Determine current environment
const determineEnv = (): Environment => {
  // Check for environment variable from Vite
  const env = import.meta.env.VITE_APP_ENV;
  
  if (env === 'test') return 'test';
  if (env === 'production') return 'production';
  return 'local'; // Default to local if not specified
};

export const currentEnv = determineEnv();

// Environment-specific configuration
export const config = {
  usesMockData: currentEnv === 'local',
  apiBaseUrl: (() => {
    // Use environment-specific API URLs
    if (currentEnv === 'production') {
      return import.meta.env.VITE_API_URL || 'https://api.glamourstudio.com';
    } else if (currentEnv === 'test') {
      return import.meta.env.VITE_API_URL || 'https://test-api.glamourstudio.com';
    } else {
      // For local development, we'll use mock data or a local API
      return import.meta.env.VITE_API_URL || '/api';
    }
  })(),
  apiKey: import.meta.env.VITE_API_KEY || '',
  featureFlags: {
    showDebugInfo: currentEnv === 'local' || import.meta.env.VITE_DEBUG_MODE === 'true',
    enableAnalytics: currentEnv !== 'local' || import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  }
};

// Display current environment in console for debugging
console.log(`Running in ${currentEnv} environment with config:`, config);
