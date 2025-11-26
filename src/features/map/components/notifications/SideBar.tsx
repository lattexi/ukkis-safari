import AlertCard from "@/features/map/components/notifications/AlertCard";
import useNotificationStore from "@/features/map/store/useNotificationStore";
import { cn } from "@/shared/utils/cn";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const SideBar = () => {
  const { sidebarOpen, toggleSidebar } = useNotificationStore();
  const { notificationList } = useNotificationStore();

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
      <div className="container relative w-full h-full overflow-y-hidden pb-18">
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
          {notificationList.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Ei hälytyksiä tällä hetkellä.
            </p>
          ) : (
            notificationList
              .slice() // create a shallow copy to avoid mutating the original array
              .reverse() // reverse the copy to show latest notifications first
              .map((notification, index) => (
                <AlertCard
                  key={index}
                  alertType={
                    notification.type === "danger"
                      ? "error"
                      : notification.type === "warning"
                        ? "warning"
                        : "info"
                  }
                  message={notification.message}
                  timestamp={notification.timestamp || new Date().toISOString()}
                />
              ))
          )}
        </div>
      </div>
      <div className="absolute w-full bottom-4 left-1/2 transform -translate-x-1/2 px-4">
        <button
          onClick={useNotificationStore.getState().clearNotifications}
          className="bg-gray-200 border border-gray-300 text-dark-navy-purple px-4 py-2 w-full rounded-xl hover:bg-gray-300 transition font-bold cursor-pointer"
        >
          Tyhjennä hälytykset
        </button>
      </div>
    </div>
  );
};

export default SideBar;
