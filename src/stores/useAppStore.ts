
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  notifications: number;
  globalLoading: boolean;
  theme: 'light' | 'dark';
  language: 'az' | 'en';
}

interface AppActions {
  setSidebarOpen: (open: boolean) => void;
  setNotifications: (count: number) => void;
  setGlobalLoading: (loading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'az' | 'en') => void;
}

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set) => ({
      // State
      sidebarOpen: false,
      notifications: 0,
      globalLoading: false,
      theme: 'light',
      language: 'az',
      
      // Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setNotifications: (count) => set({ notifications: count }),
      setGlobalLoading: (loading) => set({ globalLoading: loading }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'app-store' }
  )
);
