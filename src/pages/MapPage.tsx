import EndSafari from "@/features/map/components/EndSafari";
import MapControls from "@/features/map/components/MapControls";
import Popup from "@/features/map/components/notifications/Popup";
import SideBar from "@/features/map/components/notifications/SideBar";
import SafariLive from "@/features/map/components/SafariLive";
import SafariTimer from "@/features/map/components/SafariTimer";
import VehicleStatus from "@/features/map/components/VehicleStatus";
import MapComponent from "@/features/map/map";
import SafariEndScreen from "@/features/map/components/SafariEndScreen";
import DistancesView from "@/features/map/components/DistancesView";

const MapPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center relative justify-center bg-icy-blue">
      <MapComponent />
      <EndSafari />
      <SafariLive />
      <MapControls />
      <VehicleStatus />
      <SideBar />
      <Popup />
      <SafariTimer />
      <SafariEndScreen />
      <DistancesView />
    </div>
  );
};

export default MapPage;
