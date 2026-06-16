import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWidgetStore = create(
  persist(
    (set, get) => ({
      activeWidgets: [
        { instanceId: 'analogClock-default', widgetId: 'analogClock', x: 400, y: 200, width: 'auto', height: 'auto' },
        { instanceId: 'weather-default', widgetId: 'weather', x: 64, y: 450, width: 'auto', height: 'auto' },
        { instanceId: 'calendar-default', widgetId: 'calendar', x: 264, y: 250, width: 'auto', height: 'auto' },
      ], // array of { instanceId, widgetId, x, y, width, height }
      
      addWidget: (widgetId, defaultX = 100, defaultY = 100) => {
        const instanceId = `${widgetId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        let finalX = defaultX;
        let finalY = defaultY;
        
        if (typeof window !== 'undefined') {
          const spawnPoints = [
            { x: defaultX, y: defaultY },
            { x: defaultX + 50, y: defaultY + 50 },
            { x: defaultX + 100, y: defaultY + 100 },
            { x: defaultX + 150, y: defaultY + 150 },
          ];
          
          const currentWidgets = get().activeWidgets;
          let foundPoint = null;
          
          for (const pt of spawnPoints) {
            const isOccupied = currentWidgets.some(w => 
              Math.abs(w.x - pt.x) < 30 && Math.abs(w.y - pt.y) < 30
            );
            if (!isOccupied) {
              foundPoint = pt;
              break;
            }
          }
          
          if (foundPoint) {
            finalX = foundPoint.x;
            finalY = foundPoint.y;
          } else {
            finalX = defaultX + Math.floor(Math.random() * 50);
            finalY = defaultY + Math.floor(Math.random() * 50);
          }
        }

        set((state) => ({
          activeWidgets: [
            ...state.activeWidgets,
            { instanceId, widgetId, x: finalX, y: finalY, width: 'auto', height: 'auto' }
          ]
        }));
      },
      
      removeWidget: (instanceId) => {
        set((state) => ({
          activeWidgets: state.activeWidgets.filter((w) => w.instanceId !== instanceId)
        }));
      },
      
      updateWidgetPosition: (instanceId, x, y) => {
        set((state) => ({
          activeWidgets: state.activeWidgets.map((w) => 
            w.instanceId === instanceId ? { ...w, x, y } : w
          )
        }));
      },

      updateWidgetSize: (instanceId, width, height) => {
        set((state) => ({
          activeWidgets: state.activeWidgets.map((w) => 
            w.instanceId === instanceId ? { ...w, width, height } : w
          )
        }));
      }
    }),
    {
      name: 'widget-storage',
    }
  )
);
