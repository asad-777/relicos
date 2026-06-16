import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_ICONS = [];

export const useDesktopStore = create(
  persist(
    (set, get) => ({
      icons: DEFAULT_ICONS,
      selectedIconIds: [],

      addIcon: (appId, x, y) => set((state) => ({
        icons: [...state.icons, {
          instanceId: `icon-${appId}-${Date.now()}`,
          appId,
          x,
          y
        }]
      })),

      removeIcon: (instanceId) => set((state) => ({
        icons: state.icons.filter(i => i.instanceId !== instanceId),
        selectedIconIds: state.selectedIconIds.filter(id => id !== instanceId)
      })),

      updateIconPosition: (instanceId, newX, newY) => set((state) => ({
        icons: state.icons.map(i => 
          i.instanceId === instanceId ? { ...i, x: newX, y: newY } : i
        )
      })),

      updateMultipleIconPositions: (updates) => set((state) => {
        // updates is an array of { instanceId, dx, dy }
        const updateMap = new Map(updates.map(u => [u.instanceId, u]));
        return {
          icons: state.icons.map(i => {
            const update = updateMap.get(i.instanceId);
            if (update) {
              return { ...i, x: i.x + update.dx, y: Math.max(0, i.y + update.dy) };
            }
            return i;
          })
        };
      }),

      selectIcon: (instanceId, multiSelect = false) => set((state) => {
        if (multiSelect) {
          if (state.selectedIconIds.includes(instanceId)) {
            return { selectedIconIds: state.selectedIconIds.filter(id => id !== instanceId) };
          }
          return { selectedIconIds: [...state.selectedIconIds, instanceId] };
        }
        return { selectedIconIds: [instanceId] };
      }),

      setSelection: (instanceIds) => set({ selectedIconIds: instanceIds }),
      clearSelection: () => set({ selectedIconIds: [] })
    }),
    {
      name: 'relicos-desktop',
    }
  )
);
