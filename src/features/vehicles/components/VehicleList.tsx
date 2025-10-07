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
    const fetchVehicles = async () => {
      // const cookies = await cookieStore.getAll();
      // console.log("Cookies:", cookies);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_TRACCAR_API_URL}/devices`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
          console.log("Fetched Vehicles:", data);
        } else {
          console.error("Failed to fetch vehicles:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles();
    //   // Now we use static data for demonstration
    //   const staticVehicles: Vehicle[] = [
    //     { id: "TRK-001", name: "Safari Truck Alpha", status: "online" },
    //     { id: "TRK-002", name: "Safari Truck Beta", status: "online" },
    //     { id: "TRK-003", name: "Safari Truck Gamma", status: "in-service" },
    //     { id: "TRK-004", name: "Safari Truck Delta", status: "online" },
    //   ];
    //   setVehicles(staticVehicles);
    //   console.log("Static Vehicles:", staticVehicles);
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
