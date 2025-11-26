import AlertCard from "@/features/map/components/notifications/AlertCard";
import useNotificationStore from "@/features/map/store/useNotificationStore";
import { cn } from "@/shared/utils/cn";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const SideBar = () => {
  const { sidebarOpen, toggleSidebar } = useNotificationStore();

  useEffect(() => {
    // You can add side effects here if needed when sidebarOpen changes
    console.log("sideBarOpen from sidebar: ", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div
      className={cn(
        "bg-white fixed right-0 top-0 h-full w-96 z-50 shadow-lg p-4",
        sidebarOpen ? "translate-x-0" : "translate-x-full",
        { "transition-transform duration-300 ease-in-out": true },
      )}
    >
      <div className="container relative w-full h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-dark-navy-purple">
            Safari Hälytykset
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-200 rounded-xl hover:bg-gray-300 transition cursor-pointer"
          >
            <IoClose className="text-dark-navy-purple text-3xl" />
          </button>
        </div>
        <div className="mt-4 overflow-y-auto h-[calc(100%-80px)]">
          {/* Notification content goes here */}
          <AlertCard
            alertType="error"
            message="This is an error alert"
            timestamp="2024-06-01T12:00:00Z"
          />
          <AlertCard
            alertType="warning"
            message="This is a warning alert"
            timestamp="2024-06-01T12:00:00Z"
          />
          <AlertCard
            alertType="info"
            message="This is an info alert"
            timestamp="2024-06-01T12:00:00Z"
          />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
