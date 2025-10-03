import VehicleList from "@/features/vehicles/components/VehicleList";
import Header from "@/shared/components/Header";
import Searchbar from "@/shared/components/Searchbar";

const SetupPage = () => {
  return (
    <div className="w-full h-screen bg-icy-mint">
      <Header title="Valitse safarin ajoneuvot" />
      {/* Container for vehicle selection */}
      <div className="p-4 space-y-4">
        <Searchbar placeholder="Hae ajoneuvoa..." />
        <VehicleList />
      </div>
    </div>
  );
};

export default SetupPage;
