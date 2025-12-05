import { create } from "zustand";

type MapState = {
  userCoordinates: {
    latitude: string | null;
    longitude: string | null;
  };
  vehiclesCoordinates?: { id: number; latitude: string; longitude: string }[];
  safariDuration: string;
  showSafariEndScreen: boolean;
  showDistancesView: boolean;
  lockMapToNorth: boolean;
  lockMapToUser: boolean;
  headingDeg: number | null;

  // actions
  setUserCoordinates: (latitude: string, longitude: string) => void;
  setVehiclesCoordinates: (vehiclesCoordinates: {
    id: number;
    latitude: string;
    longitude: string;
  }) => void;
  setSafariDuration: (duration: string) => void;
  toggleSafariEndScreen: () => void;
  toggleDistancesView: () => void;
  toggleLockMapToNorth: () => void;
  toggleLockMapToUser: () => void;
  setHeadingDeg: (deg: number | null) => void;
};

const useMapStore = create<MapState>()((set) => ({
  userCoordinates: { latitude: null, longitude: null },
  vehiclesCoordinates: [],
  safariDuration: "00:00:00",
  showSafariEndScreen: false,
  showDistancesView: false,
  lockMapToNorth: true,
  lockMapToUser: false,
  headingDeg: 90,

  toggleDistancesView: () =>
    set((state) => ({ showDistancesView: !state.showDistancesView })),

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
  toggleLockMapToNorth: () =>
    set((state) => ({ lockMapToNorth: !state.lockMapToNorth })),
  toggleLockMapToUser: () =>
    set((state) => ({ lockMapToUser: !state.lockMapToUser })),
  setHeadingDeg: (deg: number | null) => set({ headingDeg: deg }),
}));

export default useMapStore;
