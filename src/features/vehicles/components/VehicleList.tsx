import VehicleCard from "@/features/vehicles/components/VehicleCard";
// import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { Vehicle } from "@/shared/types/vehicles";
import { useEffect, useState } from "react";

type VehicleListProps = {};

const VehicleList = ({}: VehicleListProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // const [selectedVehicleIds, toggleVehicle] = useVehicleStore((state) => [
  //   state.selectedVehicleIds,
  //   state.toggleVehicle,
  // ]);

  useEffect(() => {
    // Fetch vehicle data here if needed
    // Now we use static data for demonstration
    const staticVehicles: Vehicle[] = [
      { id: "TRK-001", name: "Safari Truck Alpha", status: "online" },
      { id: "TRK-002", name: "Safari Truck Beta", status: "online" },
      { id: "TRK-003", name: "Safari Truck Gamma", status: "in-service" },
      { id: "TRK-004", name: "Safari Truck Delta", status: "online" },
    ];
    setVehicles(staticVehicles);
    console.log("Static Vehicles:", staticVehicles);
  }, []);

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
