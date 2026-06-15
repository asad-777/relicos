'use client';

import { useThemeStore } from '@/lib/stores/themeStore';
import { useEffect, useState } from 'react';

const THEMES = [
  { id: 'original', label: 'Original' },
  { id: 'pocket', label: 'Pocket' },
  { id: 'color', label: 'Color' },
  { id: 'advance', label: 'Advance' },
  { id: 'twilight', label: 'Twilight' }
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-32 h-10 border-2 border-base-content bg-base-100 flex items-center px-2">
        <span className="font-heading uppercase text-xs opacity-50">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative group/theme flex items-center">
      <select 
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="appearance-none font-heading uppercase text-sm h-10 pl-3 pr-8 rounded-none border-2 border-base-content bg-base-100 text-base-content shadow-[4px_4px_0px_var(--color-base-content)] focus:outline-none focus:ring-0 cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_var(--color-base-content)] transition-all"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            Theme: {t.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-base-content"></div>
    </div>
  );
}
