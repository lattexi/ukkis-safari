import EndSafari from "@/features/map/components/endSafari";
import MapControls from "@/features/map/components/MapControls";
import SafariLive from "@/features/map/components/safariLive";
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
    </div>
  );
};

export default MapPage;
