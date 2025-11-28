import useSettingsStore from "@/features/settings/store/useSettingsStore";
import useMapStore from "../store/useMapStore";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";
import { MdSnowmobile } from "react-icons/md";
import { useMemo } from "react";

type VehicleDistance = {
  vehicleName: string;
  distance: number | null; // metreinä
};

const DistancesView = () => {
  const selectedVehicleNames = useVehicleStore((s) => s.selectedVehicleNames);
  const selectedVehicleIds = useVehicleStore((s) => s.selectedVehicleIds);
  const vehiclesCoordinates = useMapStore((s) => s.vehiclesCoordinates);
  const userCoordinates = useMapStore((s) => s.userCoordinates);
  const maxDistanceMeters = useSettingsStore((s) => s.alertRange);
  const showDistancesView = useMapStore((state) => state.showDistancesView);
  const toggleDistancesView = useMapStore((state) => state.toggleDistancesView);

  const calculateDistance = (
    vehicleCoord: { latitude: string; longitude: string },
    userCoord: { latitude: string | null; longitude: string | null },
  ): number | null => {
    if (
      userCoord.latitude === null ||
      userCoord.longitude === null ||
      vehicleCoord.latitude === null ||
      vehicleCoord.longitude === null
    ) {
      return null;
    }

    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // km
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
    const distanceMeters = R * c * 1000;

    return Math.round(distanceMeters);
  };

  const distances: VehicleDistance[] | undefined = useMemo(() => {
    if (!selectedVehicleNames || !selectedVehicleIds) return;

    return selectedVehicleNames.map((vehicleName, index) => {
      const vehicleId = selectedVehicleIds[index];

      const vehicleCoord = vehiclesCoordinates?.find(
        (v) => v.id === Number(vehicleId),
      );

      if (vehicleCoord) {
        const distance = calculateDistance(vehicleCoord, userCoordinates);
        return { vehicleName, distance };
      }

      return { vehicleName, distance: null };
    });
  }, [
    selectedVehicleNames,
    selectedVehicleIds,
    vehiclesCoordinates,
    userCoordinates,
  ]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-30 flex items-center justify-center",
        showDistancesView ? "visible" : "invisible",
      )}
    >
      <div className="relative bg-white py-6 rounded-2xl shadow-xl w-1/2 flex flex-col items-center gap-4 overflow-hidden">
        {/* TÄHÄN SISÄLTÖ */}
        <div className="text-white bg-gradient-to-br from-icy-mint/80 via-icy-mint to-icy-blue/90 rounded-full p-4 my-4 shadow-lg">
          <MdSnowmobile size={30} />
        </div>
        <div className="w-4/5 flex flex-col items-center gap-2">
          {/* TÄHÄN AJONEUVOT */}
          <div className="mt-3 px-8 flex w-full flex-col space-y-2">
            {distances?.map((s) => (
              <div key={s.vehicleName} className="flex items-center gap-3">
                <p className="text-deep-violet-navy flex-1 text-2xl font-bold truncate">
                  {s.vehicleName}
                </p>
                <p
                  className={cn(
                    "text-2xl font-bold w-40 text-left truncate",
                    s.distance === null
                      ? "text-red-500"
                      : "text-deep-violet-navy",
                  )}
                >
                  {s.distance !== null ? `${s.distance} m` : "Ei yhteyttä"}
                </p>
                <div
                  className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    s.distance !== null &&
                      s.distance <= maxDistanceMeters &&
                      "bg-green-500",
                    s.distance !== null &&
                      s.distance > maxDistanceMeters &&
                      "bg-orange-500",
                    s.distance === null && "bg-red-500",
                  )}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between w-full py-4 gap-4">
            <button
              onClick={toggleDistancesView}
              className="px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-black rounded-xl hover:bg-gray-300 transition cursor-pointer items-center gap-2 justify-center font-bold flex flex-1 text-xl shadow-lg"
            >
              <p>Palaa karttanäkymään</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistancesView;
