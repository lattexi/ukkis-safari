import { cn } from "@/shared/utils/cn";
import { IoAlert } from "react-icons/io5";
import { IoWarning } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";

type AlertCardProps = {
  alertType: "info" | "warning" | "error";
  message: string;
  timestamp: Date | string;
};

const AlertCard = ({ alertType, message, timestamp }: AlertCardProps) => {
  return (
    <div
      className={cn("w-full p-4 rounded-2xl border mb-4 flex", {
        "border-blue-500 bg-blue-200": alertType === "info",
        "border-warning-badge bg-warning-bg": alertType === "warning",
        "border-danger-badge bg-danger-bg": alertType === "error",
      })}
    >
      <div
        className={cn("mr-4 h-10 w-10 flex items-center justify-center", {
          "bg-blue-500 p-2 rounded-full": alertType === "info",
          "bg-warning-badge p-2 rounded-full": alertType === "warning",
          "bg-danger-badge p-2 rounded-full": alertType === "error",
        })}
      >
        {/* Icon based on alert type */}
        {alertType === "info" && (
          <IoCheckmark className="text-white text-2xl" />
        )}
        {alertType === "warning" && (
          <IoWarning className="text-white text-2xl" />
        )}
        {alertType === "error" && <IoAlert className="text-white text-2xl" />}
      </div>
      <div className="">
        <h3
          className={cn("text-lg font-bold mb-2", {
            "text-dark-navy-purple": alertType === "info",
            "text-warning-text": alertType === "warning",
            "text-danger-text": alertType === "error",
          })}
        >
          {alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert
        </h3>
        <p
          className={cn("text-sm font-semibold ", {
            "text-deep-violet-navy": alertType === "info",
            "text-warning-badge": alertType === "warning",
            "text-danger-badge": alertType === "error",
          })}
        >
          {message}
        </p>
        <span
          className={cn("text-sm mt-2", {
            "text-deep-violet-navy": alertType === "info",
            "text-warning-badge": alertType === "warning",
            "text-danger-badge": alertType === "error",
          })}
        >
          {new Date(timestamp).toLocaleString("fi-FI")}
        </span>
      </div>
    </div>
  );
};

export default AlertCard;
