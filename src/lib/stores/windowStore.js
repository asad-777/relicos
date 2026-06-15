import { create } from 'zustand';

export const useWindowStore = create((set, get) => ({
  windows: [],
  activeZIndex: 10,

  openWindow: (windowData) => {
    const { windows, activeZIndex } = get();
    
    // Check if already open
    const existingWindowIndex = windows.findIndex(w => w.id === windowData.id);
    
    if (existingWindowIndex >= 0) {
      // Focus and restore
      const updatedWindows = [...windows];
      updatedWindows[existingWindowIndex] = {
        ...updatedWindows[existingWindowIndex],
        isMinimized: false,
        zIndex: activeZIndex + 1,
      };
      set({ 
        windows: updatedWindows, 
        activeZIndex: activeZIndex + 1 
      });
      return;
    }

    // Calculate new window position
    let finalX, finalY;
    const width = windowData.width || 600;
    const height = windowData.height || 450;

    if (typeof window !== 'undefined') {
      const centerX = Math.max(0, (window.innerWidth - width) / 2);
      const centerY = Math.max(0, (window.innerHeight - height) / 2);

      // Define priority spawn points
      const spawnPoints = [
        { x: centerX, y: centerY }, // 1. Center
        { x: 40, y: 80 }, // 2. Top-Left
        { x: window.innerWidth - width - 40, y: 80 }, // 3. Top-Right
        { x: 40, y: window.innerHeight - height - 120 }, // 4. Bottom-Left
        { x: window.innerWidth - width - 40, y: window.innerHeight - height - 120 } // 5. Bottom-Right
      ];

      let foundPoint = null;
      for (const pt of spawnPoints) {
        // Check if there's any window very close to this point
        const isOccupied = windows.some(w => 
          !w.isMinimized && Math.abs(w.x - pt.x) < 50 && Math.abs(w.y - pt.y) < 50
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
        // Fallback to center if all spots are occupied
        finalX = centerX;
        finalY = centerY;
      }
    } else {
      finalX = 100;
      finalY = 100;
    }

    // Spawn new window
    const newWindow = {
      ...windowData,
      x: windowData.x !== undefined ? windowData.x : finalX,
      y: windowData.y !== undefined ? windowData.y : finalY,
      width,
      height,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      preMaximizedState: null,
      zIndex: activeZIndex + 1,
    };

    set({ 
      windows: [...windows, newWindow],
      activeZIndex: activeZIndex + 1
    });
  },

  closeWindow: (id) => {
    // 1. Mark as closing to trigger CSS animation
    set((state) => ({
      windows: state.windows.map(w => w.id === id ? { ...w, isClosing: true } : w),
    }));
    
    // 2. Remove after animation completes (300ms)
    setTimeout(() => {
      set((state) => ({
        windows: state.windows.filter((w) => w.id !== id),
      }));
    }, 300);
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) => 
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    }));
  },
  
  restoreWindow: (id) => {
    const { activeZIndex } = get();
    set((state) => ({
      windows: state.windows.map((w) => 
        w.id === id ? { ...w, isMinimized: false, zIndex: activeZIndex + 1 } : w
      ),
      activeZIndex: activeZIndex + 1
    }));
  },

  toggleMaximize: (id) => {
    const { activeZIndex } = get();
    
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id === id) {
          if (w.isMaximized) {
            return {
              ...w,
              isMaximized: false,
              isAnimating: true,
              x: w.preMaximizedState?.x ?? w.x,
              y: w.preMaximizedState?.y ?? w.y,
              width: w.preMaximizedState?.width ?? w.width,
              height: w.preMaximizedState?.height ?? w.height,
              zIndex: activeZIndex + 1
            };
          } else {
            const topBarHeight = 64; 
            const bottomDockHeight = 64;
            return {
              ...w,
              isMaximized: true,
              isAnimating: true,
              preMaximizedState: { x: w.x, y: w.y, width: w.width, height: w.height },
              x: 0,
              y: topBarHeight,
              width: typeof window !== 'undefined' ? window.innerWidth : 1024,
              height: typeof window !== 'undefined' ? window.innerHeight - topBarHeight - bottomDockHeight : 768,
              zIndex: activeZIndex + 1
            };
          }
        }
        return w;
      }),
      activeZIndex: activeZIndex + 1
    }));

    // Clear isAnimating flag after transition finishes
    setTimeout(() => {
      set((state) => ({
        windows: state.windows.map(w => w.id === id ? { ...w, isAnimating: false } : w)
      }));
    }, 500);
  },

  focusWindow: (id) => {
    const { windows, activeZIndex } = get();
    const targetWindow = windows.find(w => w.id === id);
    if (targetWindow && targetWindow.zIndex !== activeZIndex) {
      set({
        windows: windows.map((w) => 
          w.id === id ? { ...w, zIndex: activeZIndex + 1 } : w
        ),
        activeZIndex: activeZIndex + 1
      });
    }
  },

  updateWindowPosition: (id, { x, y }) => {
    set((state) => ({
      windows: state.windows.map((w) => 
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (id, { width, height, x, y }) => {
    // x and y might change if resizing from top or left
    set((state) => ({
      windows: state.windows.map((w) => {
        if (w.id === id) {
          return { 
            ...w, 
            width, 
            height, 
            x: x !== undefined ? x : w.x, 
            y: y !== undefined ? y : w.y,
            isMaximized: false // reset maximize state if manually resized
          };
        }
        return w;
      }),
    }));
  },
}));
