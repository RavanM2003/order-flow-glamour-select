
import { useState, useCallback } from "react";
import { ApiResponse } from "@/models/types";
import { toast } from "@/components/ui/use-toast";

// Generic hook for API calls with loading and error states
export function useApi<T = unknown>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  // Reset states
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  // Execute an API call
  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<ApiResponse<R>>,
      options: {
        showSuccessToast?: boolean;
        showErrorToast?: boolean;
        successMessage?: string;
        errorPrefix?: string;
        onSuccess?: (data: R) => void;
        onError?: (error: string) => void;
      } = {}
    ): Promise<R | null> => {
      const {
        showSuccessToast = false,
        showErrorToast = true,
        successMessage = "Operation completed successfully",
        errorPrefix = "Error",
        onSuccess,
        onError,
      } = options;

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiCall();

        if (response.error) {
          setError(response.error);
          if (showErrorToast) {
            toast({
              title: errorPrefix,
              description: response.error,
              variant: "destructive",
            });
          }
          onError?.(response.error);
          return null;
        }

        // Check if data exists and is not an empty array
        if (response.data !== undefined && response.data !== null) {
          setData(response.data as unknown as T);
          if (showSuccessToast) {
            toast({
              title: "Success",
              description: successMessage,
            });
          }
          onSuccess?.(response.data);
          return response.data;
        }

        return null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        if (showErrorToast) {
          toast({
            title: errorPrefix,
            description: errorMessage,
            variant: "destructive",
          });
        }
        onError?.(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
}
