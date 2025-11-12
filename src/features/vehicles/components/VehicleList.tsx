import useSettingsStore from "@/features/settings/store/useSettingsStore";
import VehicleCard from "@/features/vehicles/components/VehicleCard";
import { Vehicle } from "@/shared/types/vehicles";
import { useEffect, useState } from "react";

type VehicleListProps = {};

const VehicleList = ({}: VehicleListProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const token = useSettingsStore((state) => state.apiKey);
  const apiUrl = useSettingsStore((state) => state.apiUrl);

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
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} {...vehicle} />
      ))}
    </div>
  );
};

export default VehicleList;
