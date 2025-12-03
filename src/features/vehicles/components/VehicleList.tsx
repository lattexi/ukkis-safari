import useSettingsStore from "@/features/settings/store/useSettingsStore";
import VehicleCard from "@/features/vehicles/components/VehicleCard";
import { Vehicle } from "@/shared/types/vehicles";
import { useEffect, useState } from "react";

type VehicleListProps = {};

const VehicleList = ({}: VehicleListProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const token = useSettingsStore((state) => state.apiKey);
  const apiUrl = useSettingsStore((state) => state.apiUrl);

  // 30 mock vehicles for testing purposes, for data cards
  const mockVehicles: Vehicle[] = Array.from({ length: 30 }, (_, index) => ({
    id: String(index + 1),
    name: `Vehicle ${index + 1}`,
    uniqueId: `vehicle-unique-id-${index + 1}`,
    status: "online",
  }));

  useEffect(() => {
    // Fetch vehicle data here if needed
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${apiUrl}/devices`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
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
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-64px-96px)] pb-24">
      {/* {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))} */}
      {mockVehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
