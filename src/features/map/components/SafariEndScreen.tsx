import { useEffect } from "react";
import useMapStore from "../store/useMapStore";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { cn } from "@/shared/utils/cn";
import { MdSnowmobile } from "react-icons/md";
import { FaClock, FaStop } from "react-icons/fa6";
import useProfileStore from "@/features/profiles/store/useProfileStore";
import { useNavigate } from "react-router";
import useNotificationStore from "@/features/map/store/useNotificationStore";

const updateDriverSafariCount = async (
  driverId: number,
  profileName: string | null,
  uniqueId: string | null,
  safariCount: number,
) => {
  console.log("Safari count: ", safariCount);
  console.log("Profile info: ", driverId, profileName, uniqueId, safariCount);

  try {
    const res = await fetch(
      `${import.meta.env.VITE_TRACCAR_API_URL}/drivers/${driverId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TRACCAR_API_TOKEN}`,
          // Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
        },
        body: JSON.stringify({
          id: driverId,
          name: profileName,
          uniqueId: uniqueId,
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

const SafariEndScreen = () => {
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );
  const driverId = useProfileStore((state) => state.selectedProfileId);
  const uniqueId = useProfileStore((state) => state.uniqueId);
  const safariCount = useProfileStore((state) => state.safariCount);
  const profileName = useProfileStore((state) => state.profileName);
  const clearVehicles = useVehicleStore((state) => state.clearSelection);
  const clearProfile = useProfileStore((state) => state.clearSelection);
  const navigate = useNavigate();
  const { showSafariEndScreen, toggleSafariEndScreen } = useMapStore();
  const safariDuration = useMapStore((state) => state.safariDuration);
  const vehiclesCount = useVehicleStore(
    (state) => state.selectedVehicleIds.length,
  );

  const handleClick = () => {
    console.log("Ending safari...");
    useMapStore.getState().toggleSafariEndScreen();
    console.log("Safari ended");
    if (driverId !== null) {
      updateDriverSafariCount(driverId, profileName, uniqueId, safariCount + 1);
    }
    clearVehicles();
    clearProfile();
    clearNotifications();
    navigate("/~miikavs/ukkis/profile");
  };

  useEffect(() => {
    console.log("On vittu nyt näkyvissä saatana: ", showSafariEndScreen);
  }, [showSafariEndScreen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-60 flex items-center justify-center",
        showSafariEndScreen ? "visible" : "invisible",
      )}
    >
      {/* tausta */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div className="relative bg-white pb-6 rounded-2xl shadow-xl w-1/2 flex flex-col items-center gap-4 overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-icy-blue via-deep-violet-navy to-dark-navy-purple"></div>
        <div className="text-white bg-gradient-to-br from-red-400 to-red-600 rounded-full p-8 my-4 shadow-lg">
          <FaStop size={40} />
        </div>
        <h1 className="text-4xl font-bold text-dark-navy-purple mb-4">
          Lopeta safari?
        </h1>
        <div className="text-center text-dark-navy-purple text-lg flex flex-row gap-6">
          <div className="flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-icy-mint/50 via-icy-mint/40 to-icy-blue/20 p-4 rounded-xl border border-icy-mint/80">
            <div className="w-min p-4 bg-white rounded-2xl">
              <FaClock className="text-icy-blue" size={30} />
            </div>
            <p className="font-bold text-2xl">{safariDuration}</p>
            <p className="text-sm">Safarin kesto</p>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-icy-mint/50 via-icy-mint/40 to-icy-blue/20 p-4 rounded-xl border border-icy-mint/80">
            <div className="w-min p-4 bg-white rounded-2xl">
              <MdSnowmobile className="text-icy-blue" size={30} />
            </div>
            <p className="font-bold text-2xl">{vehiclesCount}</p>
            <p className="text-sm">Ajoneuvojen määrä</p>
          </div>
        </div>
        <div className="flex justify-between gap-4 w-full p-6">
          <button
            onClick={toggleSafariEndScreen}
            className="px-4 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-black rounded-xl hover:bg-gray-300 transition cursor-pointer items-center gap-2 justify-center font-bold flex flex-1 text-xl shadow-lg"
          >
            <p>Jatka safaria</p>
          </button>
          <button
            onClick={handleClick}
            className="px-4 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:bg-red-600 transition cursor-pointer flex items-center gap-2 justify-center font-bold flex-1 text-xl shadow-lg"
          >
            <FaStop className="text-white" size={20} />
            <p>Lopeta safari</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafariEndScreen;
