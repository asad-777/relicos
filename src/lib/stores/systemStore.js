import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_NOTIFICATIONS = [
  { id: 1, title: 'System Boot', message: 'RelicOS initialized successfully.', time: 'Just now', type: 'info' },
  { id: 2, title: 'Network Connected', message: 'Connected to RelicNet (5G)', time: '2m ago', type: 'success' },
];

export const useSystemStore = create(
  persist(
    (set, get) => ({
      brightness: 100, // 0 to 100
      volume: 80, // 0 to 100
      isMuted: false,
      wifiStatus: 'connected', // 'connected', 'disconnected'
      batteryLevel: 87,
      isCharging: true,
      notifications: DEFAULT_NOTIFICATIONS,

      setBrightness: (level) => set({ brightness: Math.max(0, Math.min(100, level)) }),
      setVolume: (level) => set({ volume: Math.max(0, Math.min(100, level)), isMuted: level === 0 }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      
      addNotification: (title, message, type = 'info') => set((state) => ({
        notifications: [
          { id: Date.now(), title, message, time: 'Just now', type },
          ...state.notifications
        ].slice(0, 10) // Keep max 10
      })),
      clearNotifications: () => set({ notifications: [] }),
      dismissNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'relicos-system',
    }
  )
);
