
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
  apiBaseUrl: currentEnv === 'production' 
    ? 'https://api.glamourstudio.com' 
    : currentEnv === 'test'
      ? 'https://test-api.glamourstudio.com'
      : '/api', // Local mock API path
  featureFlags: {
    showDebugInfo: currentEnv === 'local',
    enableAnalytics: currentEnv !== 'local',
  }
};

// Display current environment in console for debugging
console.log(`Running in ${currentEnv} environment with config:`, config);
