import { create } from "zustand";

interface UIState {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  isCommandPaletteOpen: boolean;
  isNotificationDrawerOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNotificationDrawer: () => void;
  setNotificationDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  isCommandPaletteOpen: false,
  isNotificationDrawerOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleMobileSidebar: () => set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleNotificationDrawer: () => set((state) => ({ isNotificationDrawerOpen: !state.isNotificationDrawerOpen })),
  setNotificationDrawerOpen: (open) => set({ isNotificationDrawerOpen: open }),
}));
