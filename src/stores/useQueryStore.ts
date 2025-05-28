
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface QueryState {
  // Global loading states
  isGlobalLoading: boolean;
  loadingOperations: Set<string>;
  
  // Cache invalidation
  invalidationKeys: Set<string>;
  
  // Error states
  globalError: string | null;
  operationErrors: Map<string, string>;
}

interface QueryActions {
  // Loading management
  setGlobalLoading: (loading: boolean) => void;
  addLoadingOperation: (key: string) => void;
  removeLoadingOperation: (key: string) => void;
  
  // Cache management
  invalidateQueries: (keys: string[]) => void;
  clearInvalidationKeys: () => void;
  
  // Error management
  setGlobalError: (error: string | null) => void;
  setOperationError: (key: string, error: string) => void;
  clearOperationError: (key: string) => void;
  clearAllErrors: () => void;
}

export const useQueryStore = create<QueryState & QueryActions>()(
  devtools(
    (set, get) => ({
      // State
      isGlobalLoading: false,
      loadingOperations: new Set(),
      invalidationKeys: new Set(),
      globalError: null,
      operationErrors: new Map(),
      
      // Actions
      setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
      
      addLoadingOperation: (key) => set((state) => ({
        loadingOperations: new Set([...state.loadingOperations, key])
      })),
      
      removeLoadingOperation: (key) => set((state) => {
        const newSet = new Set(state.loadingOperations);
        newSet.delete(key);
        return { loadingOperations: newSet };
      }),
      
      invalidateQueries: (keys) => set((state) => ({
        invalidationKeys: new Set([...state.invalidationKeys, ...keys])
      })),
      
      clearInvalidationKeys: () => set({ invalidationKeys: new Set() }),
      
      setGlobalError: (error) => set({ globalError: error }),
      
      setOperationError: (key, error) => set((state) => {
        const newMap = new Map(state.operationErrors);
        newMap.set(key, error);
        return { operationErrors: newMap };
      }),
      
      clearOperationError: (key) => set((state) => {
        const newMap = new Map(state.operationErrors);
        newMap.delete(key);
        return { operationErrors: newMap };
      }),
      
      clearAllErrors: () => set({
        globalError: null,
        operationErrors: new Map()
      })
    }),
    { name: 'query-store' }
  )
);
