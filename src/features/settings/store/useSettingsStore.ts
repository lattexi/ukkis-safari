import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  apiUrl: string;
  apiKey: string;
  alertRange: number;

  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  setAlertRange: (range: number) => void;
};

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiUrl: "",
      apiKey: "",
      alertRange: 500,
      setApiUrl: (url: string) => {
        set(() => ({ apiUrl: url }));
      },
      setApiKey: (key: string) => {
        set(() => ({ apiKey: key }));
      },
      setAlertRange: (range: number) => {
        set(() => ({ alertRange: range }));
      },
    }),
    {
      name: "settings-storage",
      partialize: (state) => ({
        apiUrl: state.apiUrl,
        apiKey: state.apiKey,
        alertRange: state.alertRange,
      }),
    },
  ),
);

export default useSettingsStore;
