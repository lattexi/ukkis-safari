import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type VehicleId = string;

type VehicleSelectionState = {
  selectedVehicleIds: VehicleId[];

  // actions
  setSelectedVehicles: (vehicleIds: VehicleId[]) => void;
  toggleVehicle: (vehicleId: VehicleId) => void;
  clearSelection: () => void;

  // Siivotaan traccarista poistuneet ajoneuvot pois valinnoista
  pruneAgainst: (existingIds: VehicleId[]) => void;
};

const useVehicleStore = createWithEqualityFn<VehicleSelectionState>()(
  persist(
    (set, get) => ({
      selectedVehicleIds: [],
      setSelectedVehicles: (vehicleIds: VehicleId[]) => {
        set(() => ({ selectedVehicleIds: vehicleIds }));
      },
      toggleVehicle: (vehicleId: VehicleId) => {
        set((state) => {
          const isSelected = state.selectedVehicleIds.includes(vehicleId);
          const selectedVehicleIds = isSelected
            ? state.selectedVehicleIds.filter((v) => v !== vehicleId)
            : [...state.selectedVehicleIds, vehicleId];
          return { selectedVehicleIds };
        });
      },
      clearSelection: () => {
        set(() => ({ selectedVehicleIds: [] }));
      },
      pruneAgainst: (existingIds: VehicleId[]) => {
        const vehicleIds = new Set(existingIds);
        const pruned = get().selectedVehicleIds.filter((v) =>
          vehicleIds.has(v),
        );
        set(() => ({ selectedVehicleIds: pruned }));
      },
    }),
    {
      name: "vehicle-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ selectedVehicleIds: state.selectedVehicleIds }), // only persist selectedVehicleIds
    },
  ),
  shallow,
);

export default useVehicleStore;
