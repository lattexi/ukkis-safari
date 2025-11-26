import { IoClose } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoInformationCircle,
} from "react-icons/io5";
import useNotificationStore from "@/features/map/store/useNotificationStore";
import { cn } from "@/shared/utils/cn";

const popupConfig = {
  warning: {
    bgColor: "bg-warm-orange",
    icon: IoIosWarning,
    textColor: "text-white",
  },
  danger: {
    bgColor: "bg-red-600",
    icon: IoAlertCircle,
    textColor: "text-white",
  },
  info: {
    bgColor: "bg-blue-500",
    icon: IoInformationCircle,
    textColor: "text-white",
  },
  success: {
    bgColor: "bg-green-600",
    icon: IoCheckmarkCircle,
    textColor: "text-white",
  },
};

const Popup = () => {
  const { popupOpen, popupData, closePopup } = useNotificationStore();

  if (!popupData) return null;

  const config = popupConfig[popupData.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "fixed top-0 right-0 w-full h-24 z-50 flex items-center justify-between shadow-lg px-8 py-4 transition-transform duration-500 ease-out",
        config.bgColor,
        popupOpen ? "translate-y-0" : "-translate-y-full",
      )}
    >
      {/* Content */}
      <div className="flex gap-2 items-center justify-center">
        <Icon size={36} className={config.textColor} />
        <div className={config.textColor}>
          <h3 className="text-xl font-bold">{popupData.title}</h3>
          <p>{popupData.message}</p>
        </div>
      </div>
      {/* Close */}
      <button onClick={closePopup} className="cursor-pointer">
        <IoClose size={32} className={config.textColor} />
      </button>
    </div>
  );
};

export default Popup;
