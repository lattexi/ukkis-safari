const VehicleStatus = () => {
  return (
    <div className="absolute bottom-6 min-w-52 left-5 flex flex-col p-4 bg-white/95 rounded-xl shadow-lg">
      <div>
        <p className="font-bold text-dark-navy-purple">Vehicle Status</p>
      </div>
      <div className="mt-3 flex flex-col space-y-2">
        <div className="flex justify-between items-center space-x-2">
          <p className="text-deep-violet-navy text-sm">Jimbon Iphone</p>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex justify-between items-center space-x-2">
          <p className="text-deep-violet-navy text-sm">Laten Iphone</p>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default VehicleStatus;
