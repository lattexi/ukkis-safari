import useVehicleStore from "@/features/vehicles/store/useVehicleStore";

const VehicleStatus = () => {
  const selectedVehicles = useVehicleStore(
    (state) => state.selectedVehicleNames,
  );

  console.log("Selected Vehicle IDs:", selectedVehicles);

  return (
    <div className="absolute bottom-6 min-w-52 left-5 flex flex-col p-4 bg-white/95 rounded-xl shadow-lg">
      <div>
        <p className="font-bold text-dark-navy-purple">Ajoneuvojen tila</p>
      </div>
      <div className="mt-3 flex flex-col space-y-2">
        {/* List all vehicles */}
        {selectedVehicles?.map((vehicleName) => (
          <div
            key={vehicleName}
            className="flex justify-between items-center space-x-2"
          >
            <p className="text-deep-violet-navy text-sm">{vehicleName}</p>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        ))}
        {/* Example static entries */}
      </div>
    </div>
  );
};

export default VehicleStatus;

{
  /* <div className="flex justify-between items-center space-x-2">
  <p className="text-deep-violet-navy text-sm">Jimbon Iphone</p>
  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
</div>; */
}
