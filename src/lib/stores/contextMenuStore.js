import { create } from 'zustand';

export const useContextMenuStore = create((set) => ({
  isOpen: false,
  x: 0,
  y: 0,
  items: [], // Array of { label, icon: IconComponent, onClick: Function, divider: boolean }

  openMenu: (x, y, items) => set({
    isOpen: true,
    x,
    y,
    items
  }),

  closeMenu: () => set({ isOpen: false })
}));
