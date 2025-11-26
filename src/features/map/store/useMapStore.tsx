import { create } from "zustand";

type MapState = {
  userCoordinates: {
    latitude: string | null;
    longitude: string | null;
  };
  vehiclesCoordinates?: { id: number; latitude: string; longitude: string }[];

  // actions
  setUserCoordinates: (latitude: string, longitude: string) => void;
  setVehiclesCoordinates: (vehiclesCoordinates: {
    id: number;
    latitude: string;
    longitude: string;
  }) => void;
};

const useMapStore = create<MapState>()((set) => ({
  userCoordinates: { latitude: null, longitude: null },
  vehiclesCoordinates: [],

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
}));

export default useMapStore;
