import { IoClose } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import useNotificationStore from "@/features/map/store/useNotificationStore";
import { cn } from "@/shared/utils/cn";

const Popup = () => {
  const { popupOpen, togglePopup } = useNotificationStore();

  return (
    <div
      className={cn(
        "bg-warm-orange fixed top-0 right-0 w-full h-24 z-50 flex items-center justify-between shadow-lg px-8 py-4 transition-transform duration-500 ease-out",
        popupOpen ? "translate-y-0" : "-translate-y-full",
      )}
    >
      {/* Content */}
      <div className="flex gap-2 items-center justify-center">
        <IoIosWarning size={36} className="text-white" />
        <div className="text-white ">
          <h3 className="text-xl font-bold">Vehicle Alert</h3>
          <p>Vaarallinen eläin lähellä! Pysähdy ja odota ohjeita.</p>
        </div>
      </div>
      {/* Close */}
      <button onClick={togglePopup} className="cursor-pointer">
        <IoClose size={32} />
      </button>
    </div>
  );
};

export default Popup;
