import { create } from "zustand";

interface NotificationStore {
  sidebarOpen: boolean;
  popupOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setPopupOpen: (open: boolean) => void;
  togglePopup: () => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  sidebarOpen: false,
  popupOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPopupOpen: (open) => set({ popupOpen: open }),
  togglePopup: () => set((state) => ({ popupOpen: !state.popupOpen })),
}));

export default useNotificationStore;
