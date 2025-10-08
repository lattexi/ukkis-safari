import { FaBell } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";

const MapControls = () => {
  return (
    <div className="absolute bottom-10 right-5 flex flex-col justify-center space-y-3">
      <button className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all">
        <FaLocationCrosshairs className="text-dark-navy-purple text-2xl" />
      </button>
      <button className="bg-white/95 w-16 h-16 flex justify-center items-center rounded-xl shadow-lg cursor-pointer hover:scale-106 hover:bg-white transition-all">
        <FaBell className="text-dark-navy-purple text-2xl" />
      </button>
    </div>
  );
};

export default MapControls;
