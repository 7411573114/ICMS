"use client";

import { create } from "zustand";

interface UIState {
    sidebarCollapsed: boolean;
    sidebarOpen: boolean;
    toggleSidebarCollapse: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    sidebarCollapsed: false,
    sidebarOpen: false,
    toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
}));
