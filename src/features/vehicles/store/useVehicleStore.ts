import { persist } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

type VehicleId = string;
type VehicleName = string;

type VehicleSelectionState = {
  selectedVehicleIds: VehicleId[];
  selectedVehicleNames?: VehicleName[];

  // actions
  setSelectedVehicles: (
    vehicleIds: VehicleId[],
    vehicleNames: VehicleName[],
  ) => void;
  toggleVehicle: (vehicleId: VehicleId, vehicleName: VehicleName) => void;
  clearSelection: () => void;

  // Siivotaan traccarista poistuneet ajoneuvot pois valinnoista
  pruneAgainst: (existingIds: VehicleId[]) => void;
};

const useVehicleStore = createWithEqualityFn<VehicleSelectionState>()(
  persist(
    (set, get) => ({
      selectedVehicleIds: [],
      selectedVehicleNames: [],
      setSelectedVehicles: (
        vehicleIds: VehicleId[],
        vehicleNames: VehicleName[],
      ) => {
        set(() => ({
          selectedVehicleIds: vehicleIds,
          selectedVehicleNames: vehicleNames,
        }));
      },
      toggleVehicle: (vehicleId: VehicleId, vehicleName: VehicleName) => {
        set((state) => {
          const isSelected = state.selectedVehicleIds.includes(vehicleId);
          const selectedVehicleIds = isSelected
            ? state.selectedVehicleIds.filter((v) => v !== vehicleId)
            : [...state.selectedVehicleIds, vehicleId];
          const selectedVehicleNames = isSelected
            ? state.selectedVehicleNames?.filter((n) => n !== vehicleName)
            : [...(state.selectedVehicleNames || []), vehicleName];
          return {
            selectedVehicleIds,
            selectedVehicleNames,
          };
        });
      },
      clearSelection: () => {
        set(() => ({ selectedVehicleIds: [], selectedVehicleNames: [] }));
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
      partialize: (state) => ({
        selectedVehicleIds: state.selectedVehicleIds,
        selectedVehicleNames: state.selectedVehicleNames,
      }), // only persist selectedVehicleIds
    },
  ),
  shallow,
);

export default useVehicleStore;
