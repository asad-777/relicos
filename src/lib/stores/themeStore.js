import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = ['original', 'pocket', 'color', 'advance', 'twilight'];

// Backgrounds are fetched dynamically from /api/assets

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'original',
      background: 'wallhaven-4vr8m3_1920x1080',
      backgrounds: [],
      corners: 'round',
      
      setBackgrounds: (bgs) => set({ backgrounds: bgs }),

      setTheme: (newTheme) => {
        if (THEMES.includes(newTheme)) {
          set({ theme: newTheme });
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
          }
        }
      },
      
      setBackground: (bg) => {
        set({ background: bg });
      },
      
      setCorners: (c) => {
        set({ corners: c });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-corners', c);
        }
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);
