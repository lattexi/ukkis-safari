import VehicleStatus from "@/features/vehicles/components/VehicleStatus";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { Vehicle } from "@/shared/types/vehicles";
import { cn } from "@/shared/utils/cn";
import { Car, Check } from "lucide-react";
import { useCallback } from "react";

const VehicleCard = ({ id, name, status }: Vehicle) => {
  const isSelected = useVehicleStore((state) =>
    state.selectedVehicleIds.includes(id),
  );
  const toggleVehicle = useVehicleStore((state) => state.toggleVehicle);

  const handleSelect = useCallback(() => {
    if (status !== "online") return;
    toggleVehicle(id);
  }, [id, status, toggleVehicle]);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer",
        isSelected && "bg-icy-blue/10 border-icy-blue/30",
      )}
      onClick={handleSelect}
    >
      {/* Card content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Vehicle logo box */}
          <div className="w-12 h-12 bg-icy-blue/20 rounded-xl flex items-center justify-center">
            <Car className="text-icy-blue" size={32}></Car>
          </div>
          {/* Vehicle details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <VehicleStatus status={status} />
              <span className="text-sm text-gray-500 font-medium">
                ID: {id}
              </span>
            </div>
          </div>
        </div>
        {/* Right side: selection indicator */}
        <div className="flex items-center">
          {/* Checkbox */}
          <div
            className={cn(
              "w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center transition-all duration-200",
              isSelected && "bg-icy-blue border-icy-blue",
            )}
          >
            <Check className="text-white" />
          </div>
          {/* Hidden checkbox for accessibility */}
          <input
            id={`vehicle-select-${id}`}
            type="checkbox"
            className="sr-only"
            checked={isSelected}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
