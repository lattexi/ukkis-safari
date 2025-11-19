import EndSafari from "@/features/map/components/EndSafari";
import MapControls from "@/features/map/components/MapControls";
import SideBar from "@/features/map/components/notifications/SideBar";
import SafariLive from "@/features/map/components/SafariLive";
import VehicleStatus from "@/features/map/components/VehicleStatus";
import MapComponent from "@/features/map/map";

const MapPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center relative justify-center bg-icy-blue">
      <MapComponent />
      <EndSafari />
      <SafariLive />
      <MapControls />
      <VehicleStatus />
      <SideBar />
    </div>
  );
};

export default MapPage;
