import useProfileStore from "@/features/profiles/store/useProfileStore";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";
import { FaStop } from "react-icons/fa6";
import { useNavigate } from "react-router";

const updateDriverSafariCount = async (
  driverId: number,
  safariCount: number,
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_TRACCAR_API_URL}/api/drivers/${Number(driverId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${import.meta.env.VITE_TRACCAR_API_TOKEN}`,
          Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
        },
        body: JSON.stringify({
          id: driverId,
          name: "Janski-69",
          uniqueId: "janski-69",
          attributes: { Safarit: safariCount },
        }),
      },
    );

    if (!res.ok) {
      throw new Error("Failed to update driver safari count");
    }

    const data = await res.json();
    console.log("Driver safari count updated:", data);
  } catch (error) {
    console.error("Error updating driver safari count:", error);
  }
};

const EndSafari = () => {
  console.log("Safari ended");
  const driverId = useProfileStore((state) => state.selectedProfileId);
  const safariCount = useProfileStore((state) => state.safariCount);
  const clearVehicles = useVehicleStore((state) => state.clearSelection);
  const clearProfile = useProfileStore((state) => state.clearSelection);
  const navigate = useNavigate();
  const handleClick = () => {
    if (confirm("Are you sure you want to end the safari?")) {
      if (driverId !== null) {
        updateDriverSafariCount(driverId, safariCount);
      }
      clearVehicles();
      clearProfile();
      navigate("/profile");
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
