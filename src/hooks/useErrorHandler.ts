
import { useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorOptions {
  title?: string;
  description?: string;
  showToast?: boolean;
  logError?: boolean;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: Error | string, options: ErrorOptions = {}) => {
    const {
      title = 'Xəta',
      description,
      showToast = true,
      logError = true
    } = options;

    const errorMessage = typeof error === 'string' ? error : error.message;
    
    if (logError) {
      console.error('Error:', error);
    }

    if (showToast) {
      toast({
        title,
        description: description || errorMessage,
        variant: 'destructive',
      });
    }

    return errorMessage;
  }, []);

  return { handleError };
};
