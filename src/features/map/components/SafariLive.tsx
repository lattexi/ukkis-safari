import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { FaRoute } from "react-icons/fa6";

const SafariLive = () => {
  const vehiclesTracking = useVehicleStore(
    (state) => state.selectedVehicleIds.length,
  );
  return (
    <div className="absolute top-5 left-5 flex items-center p-4 bg-white/95 rounded-xl shadow-lg">
      <div className="bg-icy-blue/20 p-4 text-2xl rounded-2xl flex items-center justify-center mr-4">
        <FaRoute className="text-icy-blue" />
      </div>
      <div className="flex flex-col mr-2">
        <p className="text-dark-navy-purple font-bold">Safari Live</p>
        <p className="text-deep-violet-navy text-sm">
          {vehiclesTracking} vehicles tracking
        </p>
      </div>
    </div>
  );
};

export default SafariLive;
