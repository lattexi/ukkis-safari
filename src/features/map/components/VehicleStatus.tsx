import useMapStore from "@/features/map/store/useMapStore";
import useSettingsStore from "@/features/settings/store/useSettingsStore";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";

const VehicleStatus = () => {
  const selectedVehicleNames = useVehicleStore((s) => s.selectedVehicleNames);
  const selectedVehicleIds = useVehicleStore((s) => s.selectedVehicleIds);
  const vehiclesCoordinates = useMapStore((s) => s.vehiclesCoordinates);
  const userCoordinates = useMapStore((s) => s.userCoordinates);

  const maxDistanceMeters = useSettingsStore((s) => s.alertRange);
  console.log("Max distance meters from settings:", maxDistanceMeters);

  //Count selected vehicles distance to user location

  const calculateDistance = (
    vehicleCoord: { latitude: string; longitude: string },
    userCoord: { latitude: string | null; longitude: string | null },
  ) => {
    if (
      userCoord.latitude === null ||
      userCoord.longitude === null ||
      vehicleCoord.latitude === null ||
      vehicleCoord.longitude === null
    ) {
      return null;
    }

    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(
      Number(vehicleCoord.latitude) - Number(userCoord.latitude),
    );
    const dLon = toRad(
      Number(vehicleCoord.longitude) - Number(userCoord.longitude),
    );
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(Number(userCoord.latitude))) *
        Math.cos(toRad(Number(vehicleCoord.latitude))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = (R * c * 1000).toFixed(0); // Distance in meters
    return distance;
  };

  const distances = selectedVehicleNames?.map((vehicleName, index) => {
    const vehicleId = selectedVehicleIds[index];
    //console.log("Vehicles coordinates", vehiclesCoordinates);
    const vehicleCoord = vehiclesCoordinates?.find((v) => {
      //console.log("Comparing vehicle ids:", v.id);
      return v.id === Number(vehicleId);
    });
    //console.log("vehicleCoord", vehicleCoord);

    if (vehicleCoord) {
      const distance = calculateDistance(vehicleCoord, userCoordinates);
      return {
        vehicleName,
        distance,
      };
    }
    return {
      vehicleName,
      distance: null,
    };
  });

  return (
    <div className="absolute bottom-6 min-w-52 left-5 flex flex-col p-4 bg-white/95 rounded-xl shadow-lg">
      <div>
        <p className="font-bold text-dark-navy-purple">Ajoneuvojen tila</p>
      </div>
      <div className="mt-3 flex flex-col space-y-2">
        {/* List all vehicles */}
        {distances?.map((s) => (
          <div
            key={s.vehicleName}
            className="flex justify-between items-center space-x-8"
          >
            <p className="text-deep-violet-navy text-sm">{s.vehicleName}</p>
            {/* <p className="text-deep-violet-navy text-sm"> */}
            <p
              className={cn(
                "text-sm",
                s.distance === null ? "text-red-500" : "text-deep-violet-navy",
              )}
            >
              {s.distance ? `${s.distance} m` : "Ei yhteyttä"}
            </p>
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
                s.distance &&
                  Number(s.distance) <= maxDistanceMeters &&
                  "bg-green-500",
                s.distance &&
                  Number(s.distance) > maxDistanceMeters &&
                  "bg-orange-500",
                s.distance === null && "bg-red-500",
              )}
            ></div>
          </div>
        ))}
        {/* Example static entries */}
      </div>
    </div>
  );
};

export default VehicleStatus;

{
  /* <div className="flex justify-between items-center space-x-2">
  <p className="text-deep-violet-navy text-sm">Jimbon Iphone</p>
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
</div>; */
}
