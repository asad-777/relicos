import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'original',
      setTheme: (newTheme) => {
        // Apply theme to document element so DaisyUI picks it up
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
