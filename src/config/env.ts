
type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiBaseUrl: string;
  usesMockData: boolean;
  useSupabase: boolean;
  appName: string;
  featureFlags: {
    showDebugInfo: boolean;
    enableAdvancedFiltering: boolean;
    enableBatchOperations: boolean;
  };
}

// Current environment
export const currentEnv: Environment = 
  (import.meta.env.VITE_APP_ENV as Environment) || 'development';

// Environment-specific configurations
const envConfigs: Record<Environment, EnvConfig> = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: true,
    useSupabase: false,
    appName: 'Gözəllik Salonu (Dev)',
    featureFlags: {
      showDebugInfo: true,
      enableAdvancedFiltering: true,
      enableBatchOperations: false
    }
  },
  staging: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: false,
    useSupabase: true,
    appName: 'Gözəllik Salonu (Staging)',
    featureFlags: {
      showDebugInfo: true,
      enableAdvancedFiltering: true,
      enableBatchOperations: true
    }
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: false,
    useSupabase: false,
    appName: 'Gözəllik Salonu',
    featureFlags: {
      showDebugInfo: false,
      enableAdvancedFiltering: true,
      enableBatchOperations: true
    }
  }
};

// Export the config for the current environment
export const config = envConfigs[currentEnv];
