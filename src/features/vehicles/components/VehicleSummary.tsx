import { FaPlay } from "react-icons/fa6";
import { LoadingDots } from "@/shared/components/LoadingDots";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";
// import { RiLoader2Fill } from "react-icons/ri";

type VehicleSummaryProps = {
  isLoading?: boolean;
  onStart?: () => void;
};

const vehicleSummary = ({ isLoading, onStart }: VehicleSummaryProps) => {
  const selectedVehiclesCount = useVehicleStore(
    (state) => state.selectedVehicleIds.length,
  );

  return (
    <div className="py-4 px-6 bg-white flex absolute bottom-0 w-full shadow-md">
      <div className="p-4 bg-icy-blue/10 rounded-xl items-center justify-center">
        <p className="text-xl px-2 text-icy-blue font-bold">
          {selectedVehiclesCount}
        </p>
      </div>

      <div className="px-4 flex flex-col justify-center ml-4">
        <p className="text-lg text-black font-semibold">Vehicles selected</p>
        <p className="text-sm text-black">Ready for safari</p>
      </div>

      <button
        onClick={onStart}
        disabled={isLoading || selectedVehiclesCount === 0}
        // className="ml-auto bg-warning-badge text-white px-4 py-2 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-hover-warning-badge transition-all"
        className={cn(
          "ml-auto bg-warning-badge text-white px-4 py-2 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-hover-warning-badge transition-all",
          (isLoading || selectedVehiclesCount === 0) &&
            "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-warning-badge",
        )}
      >
        {!isLoading ? (
          <>
            <FaPlay className="inline-block mr-2 ml-4" size={20} />
            <p className="mr-4 text-white font-bold text-xl">Start Safari</p>
          </>
        ) : (
          <>
            {/* <RiLoader2Fill
              className="inline-block mr-2 ml-4 animate-spin"
              size={20}
            /> */}
            <p className="mx-4 text-white flex items-baseline font-bold text-xl">
              <span className="animate-none">Loading</span> <LoadingDots />
            </p>
          </>
        )}
      </button>
    </div>
  );
};

export default vehicleSummary;
