import { create } from 'zustand';

export const useWindowStore = create((set) => ({
  windows: [],
  
  // Open a new window or bring it to front if already open
  openWindow: (appData) => set((state) => {
    const existingWindow = state.windows.find(w => w.id === appData.id);
    if (existingWindow) {
      // Bring to front
      const highestZIndex = Math.max(0, ...state.windows.map(w => w.zIndex || 0));
      return {
        windows: state.windows.map(w => 
          w.id === appData.id 
            ? { ...w, zIndex: highestZIndex + 1, minimized: false }
            : w
        )
      };
    }

    // Determine highest zIndex
    const highestZIndex = Math.max(0, ...state.windows.map(w => w.zIndex || 0));
    
    // Calculate a slight stagger based on how many windows are open to avoid perfect overlapping
    const staggerOffset = state.windows.length * 20;

    const newWindow = {
      ...appData,
      zIndex: highestZIndex + 1,
      minimized: false,
      position: appData.defaultPosition || { x: 50 + staggerOffset, y: 50 + staggerOffset },
      size: appData.defaultSize || { width: 800, height: 600 } // Good default size as asked in plan
    };

    return { windows: [...state.windows, newWindow] };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id)
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    )
  })),

  focusWindow: (id) => set((state) => {
    const highestZIndex = Math.max(0, ...state.windows.map(w => w.zIndex || 0));
    return {
      windows: state.windows.map(w => 
        w.id === id ? { ...w, zIndex: highestZIndex + 1, minimized: false } : w
      )
    };
  }),

  updateWindowPosition: (id, position) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, position } : w
    )
  })),

  updateWindowSize: (id, size) => set((state) => ({
    windows: state.windows.map(w => 
      w.id === id ? { ...w, size, position: w.position } : w
    )
  })),
}));
