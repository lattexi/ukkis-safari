import { create } from "zustand";

export type PopupType = "warning" | "danger" | "info" | "success";

export type PopupData = {
  title: string;
  message: string;
  type: PopupType;
  timestamp?: Date | string;
};

type NotificationStore = {
  sidebarOpen: boolean;
  popupOpen: boolean;
  popupData: PopupData | null;
  notificationList: PopupData[];
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setPopupOpen: (open: boolean) => void;
  showPopup: (data: PopupData) => void;
  closePopup: () => void;
  addNotification: (data: PopupData) => void;
  clearNotifications: () => void;
};

const useNotificationStore = create<NotificationStore>((set) => ({
  sidebarOpen: false,
  popupOpen: false,
  popupData: null,
  notificationList: [],
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setPopupOpen: (open) => set({ popupOpen: open }),
  showPopup: (data) => set({ popupData: data, popupOpen: true }),
  // showPopup: (data) =>
  //   set((state) => ({
  //     notificationList: [...state.notificationList, data],
  //     popupData: data,
  //     popupOpen: true,
  //   })),
  closePopup: () => set({ popupOpen: false }),
  addNotification: (data) =>
    set((state) => ({
      notificationList: [...state.notificationList, data],
    })),
  clearNotifications: () => set({ notificationList: [] }),
}));

export default useNotificationStore;
