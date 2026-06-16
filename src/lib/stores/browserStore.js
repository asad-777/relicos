import { create } from 'zustand';

export const useBrowserStore = create((set, get) => ({
  tabs: [
    { id: 'tab-1', title: 'New Tab', type: 'search', query: '', url: '' }
  ],
  activeTabId: 'tab-1',

  addTab: () => set((state) => {
    const newTabId = `tab-${Date.now()}`;
    return {
      tabs: [...state.tabs, { id: newTabId, title: 'New Tab', type: 'search', query: '', url: '' }],
      activeTabId: newTabId
    };
  }),

  closeTab: (id) => set((state) => {
    const newTabs = state.tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      const newTabId = `tab-${Date.now()}`;
      return {
        tabs: [{ id: newTabId, title: 'New Tab', type: 'search', query: '', url: '' }],
        activeTabId: newTabId
      };
    }
    
    let newActiveId = state.activeTabId;
    if (id === state.activeTabId) {
      newActiveId = newTabs[newTabs.length - 1].id;
    }
    
    return {
      tabs: newTabs,
      activeTabId: newActiveId
    };
  }),

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, updates) => set((state) => ({
    tabs: state.tabs.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  navigateSearch: (id, query) => set((state) => ({
    tabs: state.tabs.map(t => 
      t.id === id ? { ...t, type: 'search', query, title: query ? `Search: ${query}` : 'New Tab' } : t
    )
  })),

  navigateWeb: (id, url, title) => set((state) => ({
    tabs: state.tabs.map(t => 
      t.id === id ? { ...t, type: 'web', url, title: title || url } : t
    )
  }))
}));
