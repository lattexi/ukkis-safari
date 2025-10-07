import VehicleList from "@/features/vehicles/components/VehicleList";
import Header from "@/shared/components/Header";
import Searchbar from "@/shared/components/Searchbar";
import VehicleSummary from "@/features/vehicles/components/VehicleSummary";
import { useState } from "react";
import { useNavigate } from "react-router";

const SetupPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setIsLoading(true);
    // Simulate a loading process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/map");
    }, 3000); // 3 seconds delay
  };

  return (
    <div className="w-full h-screen bg-icy-mint relative">
      <Header title="Valitse safarin ajoneuvot" />
      {/* Container for vehicle selection */}
      <div className="p-4 space-y-4">
        <Searchbar placeholder="Hae ajoneuvoa..." />
        <VehicleList />
      </div>
      <VehicleSummary isLoading={isLoading} onStart={handleStart} />
    </div>
  );
};

export default SetupPage;
