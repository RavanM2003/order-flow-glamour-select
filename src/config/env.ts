
type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiBaseUrl: string;
  usesMockData: boolean;
  useSupabase: boolean;
  appName: string;
}

// Current environment
export const currentEnv: Environment = 
  (import.meta.env.VITE_APP_ENV as Environment) || 'development';

// Environment-specific configurations
const envConfigs: Record<Environment, EnvConfig> = {
  development: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: true,
    useSupabase: true,
    appName: 'Gözəllik Salonu (Dev)'
  },
  staging: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: true,
    useSupabase: false,
    appName: 'Gözəllik Salonu (Staging)'
  },
  production: {
    apiBaseUrl: import.meta.env.VITE_API_URL || '/api',
    usesMockData: false,
    useSupabase: true,
    appName: 'Gözəllik Salonu'
  }
};

// Export the config for the current environment
export const config = envConfigs[currentEnv];
