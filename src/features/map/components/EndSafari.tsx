import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";
import { FaStop } from "react-icons/fa6";
import { useNavigate } from "react-router";

const EndSafari = () => {
  console.log("Safari ended");
  const clearSelection = useVehicleStore((state) => state.clearSelection);
  const navigate = useNavigate();
  const handleClick = () => {
    if (confirm("Are you sure you want to end the safari?")) {
      clearSelection();
      navigate("/setup");
    }
  };

  return (
    <div className="absolute top-5 right-5 flex justify-end">
      <button
        className={cn(
          "ml-auto bg-danger-button text-white px-4 py-2 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-danger-text transition-all",
        )}
        onClick={handleClick}
      >
        <>
          <FaStop className="inline-block mr-2 ml-2" size={20} />
          <p className="mr-4 text-white font-bold text-xl">End Safari</p>
        </>
      </button>
    </div>
  );
};

export default EndSafari;
