import useNotificationStore from "../store/useNotificationStore";
import { FaBell } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";

const MapControls = () => {
  const { toggleSidebar } = useNotificationStore();

  return (
    <div className="absolute bottom-10 right-4 flex flex-col justify-center space-y-3 z-35">
      <button
        className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all"
        // onClick={handleCenterMap}
      >
        <FaLocationCrosshairs className="text-dark-navy-purple text-2xl" />
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
