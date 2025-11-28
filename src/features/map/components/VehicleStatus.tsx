import { useEffect, useMemo, useState } from "react";
import useMapStore from "@/features/map/store/useMapStore";
import useNotificationStore from "@/features/map/store/useNotificationStore";
import useSettingsStore from "@/features/settings/store/useSettingsStore";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";

type VehicleDistance = {
  vehicleName: string;
  distance: number | null; // metreinä
};

const VehicleStatus = () => {
  const selectedVehicleNames = useVehicleStore((s) => s.selectedVehicleNames);
  const selectedVehicleIds = useVehicleStore((s) => s.selectedVehicleIds);
  const vehiclesCoordinates = useMapStore((s) => s.vehiclesCoordinates);
  const userCoordinates = useMapStore((s) => s.userCoordinates);
  const maxDistanceMeters = useSettingsStore((s) => s.alertRange);
  const { showPopup, addNotification } = useNotificationStore();
  const notificationList = useNotificationStore((s) => s.notificationList);

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

  // Lasketaan etäisyydet ilman sivuvaikutuksia
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

  // Mitä ajoneuvoja on jo varoitettu (ettei spämmiä joka renderillä)
  const [alerted, setAlerted] = useState<Record<string, boolean>>({});

  // Näytetään popup vain kun raja ylittyy ENSIMMÄISTÄ kertaa
  useEffect(() => {
    if (!distances || !maxDistanceMeters) return;

    distances.forEach(({ vehicleName, distance }) => {
      if (distance === null) {
        showPopup({
          title: "Ei yhteyttä ajoneuvoon",
          message: `Ajoneuvoon ${vehicleName} ei ole yhteyttä.`,
          type: "danger",
        });
        addNotification({
          title: "Ei yhteyttä ajoneuvoon",
          message: `Ajoneuvoon ${vehicleName} ei ole yhteyttä.`,
          type: "danger",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const isTooFar = distance > maxDistanceMeters;
      const wasAlerted = alerted[vehicleName];

      if (isTooFar && !wasAlerted) {
        showPopup({
          title: "Ajoneuvo liian kaukana",
          message: `Ajoneuvo ${vehicleName} on ${distance} metrin päässä sinusta.`,
          type: "warning",
        });
        addNotification({
          title: "Ajoneuvo liian kaukana",
          message: `Ajoneuvo ${vehicleName} on ${distance} metrin päässä sinusta.`,
          type: "warning",
          timestamp: new Date().toISOString(),
        });

        setAlerted((prev) => ({
          ...prev,
          [vehicleName]: true,
        }));
      }

      // jos haluat “nollata” varoituksen kun auto tulee taas lähemmäs:
      if (!isTooFar && wasAlerted) {
        setAlerted((prev) => ({
          ...prev,
          [vehicleName]: false,
        }));
        showPopup({
          title: "Ajoneuvo palasi sallitulle etäisyydelle",
          message: `Ajoneuvo ${vehicleName} on taas lähellä sinua.`,
          type: "info",
        });
        addNotification({
          title: "Ajoneuvo palasi sallitulle etäisyydelle",
          message: `Ajoneuvo ${vehicleName} on taas lähellä sinua.`,
          type: "info",
          timestamp: new Date().toISOString(),
        });
      }
      console.log("NOTIFICATIONS", notificationList);
    });
  }, [distances, maxDistanceMeters, showPopup, alerted]);

  return (
    <div
      className="absolute bottom-6 min-w-52 left-5 flex flex-col p-4 bg-white/95 rounded-xl shadow-lg"
      onClick={toggleDistancesView}
    >
      <div>
        <p className="font-bold text-dark-navy-purple">Ajoneuvojen tila</p>
      </div>
      <div className="mt-3 flex flex-col space-y-2">
        {distances?.map((s) => (
          <div key={s.vehicleName} className="flex items-center gap-3">
            <p className="text-deep-violet-navy flex-1 text-sm truncate">
              {s.vehicleName}
            </p>
            <p
              className={cn(
                "text-sm w-20 text-right truncate",
                s.distance === null ? "text-red-500" : "text-deep-violet-navy",
              )}
            >
              {s.distance !== null ? `${s.distance} m` : "Ei yhteyttä"}
            </p>
            <div
              className={cn(
                "w-2 h-2 rounded-full animate-pulse",
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
    </div>
  );
};

export default VehicleStatus;
