import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const THEMES = ['original', 'pocket', 'color', 'advance', 'twilight'];

export const BACKGROUNDS = [
  'wallhaven-4vr8m3_1920x1080',
  'wallhaven-72woj3_1920x1080',
  'wallhaven-76lpge_1920x1080',
  'wallhaven-83m6lk_1920x1080',
  'wallhaven-neomdr_1920x1080'
];

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'original',
      background: 'wallhaven-4vr8m3_1920x1080',
      corners: 'round',
      
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
