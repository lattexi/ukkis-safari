import { create } from "zustand";

type MapState = {
  userCoordinates: {
    latitude: string | null;
    longitude: string | null;
  };
  vehiclesCoordinates?: { id: number; latitude: string; longitude: string }[];
  safariDuration: string;
  showSafariEndScreen: boolean;

  // actions
  setUserCoordinates: (latitude: string, longitude: string) => void;
  setVehiclesCoordinates: (vehiclesCoordinates: {
    id: number;
    latitude: string;
    longitude: string;
  }) => void;
  setSafariDuration: (duration: string) => void;
  toggleSafariEndScreen: () => void;
};

const useMapStore = create<MapState>()((set) => ({
  userCoordinates: { latitude: null, longitude: null },
  vehiclesCoordinates: [],
  safariDuration: "00:00:00",
  showSafariEndScreen: false,

  setUserCoordinates: (latitude: string, longitude: string) =>
    set({ userCoordinates: { latitude, longitude } }),

  setVehiclesCoordinates: (vehicle: {
    id: number;
    latitude: string;
    longitude: string;
  }) =>
    set((state) => {
      const existing = state.vehiclesCoordinates ?? [];
      const idx = existing.findIndex((v) => v.id === vehicle.id);
      if (idx === -1) return { vehiclesCoordinates: [...existing, vehicle] };
      const next = [...existing];
      next[idx] = vehicle;
      return { vehiclesCoordinates: next };
    }),
  setSafariDuration: (duration: string) => set({ safariDuration: duration }),
  toggleSafariEndScreen: () =>
    set((state) => ({
      showSafariEndScreen: !state.showSafariEndScreen,
    })),
}));

export default useMapStore;
