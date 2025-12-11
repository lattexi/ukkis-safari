import useMapStore from "@/features/map/store/useMapStore";
import useNotificationStore from "../store/useNotificationStore";
import { FaBell } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { MdOutlineLocationDisabled } from "react-icons/md";
import { TbNavigationNorth } from "react-icons/tb";
import { MdNavigation } from "react-icons/md";

const MapControls = () => {
  const { toggleSidebar } = useNotificationStore();
  const lockMapToNorth = useMapStore((state) => state.lockMapToNorth);
  const lockMapToUser = useMapStore((state) => state.lockMapToUser);
  const headingDeg = useMapStore((state) => state.headingDeg);

  const { toggleLockMapToNorth } = useMapStore();
  const { toggleLockMapToUser } = useMapStore();

  return (
    <div className="absolute bottom-10 right-4 flex flex-col justify-center space-y-3 z-35">
      <button
        className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all"
        onClick={toggleLockMapToNorth}
      >
        {lockMapToNorth ? (
          <TbNavigationNorth className="text-dark-navy-purple text-2xl" />
        ) : (
          <MdNavigation
            className="text-dark-navy-purple text-2xl transition-transform duration-300"
            style={{ transform: `rotate(${headingDeg}deg)` }}
          />
        )}
      </button>
      <button
        className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all"
        onClick={toggleLockMapToUser}
      >
        {lockMapToUser ? (
          <FaLocationCrosshairs className="text-green-500 text-2xl animate-pulse" />
        ) : (
          <MdOutlineLocationDisabled className="text-red-500 text-2xl" />
        )}
      </button>
      <button
        className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all"
        onClick={toggleSidebar}
      >
        <FaBell className="text-dark-navy-purple text-2xl" />
      </button>
    </div>
  );
};

export default MapControls;
