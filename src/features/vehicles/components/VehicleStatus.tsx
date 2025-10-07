import { capitalizeFirst } from "@/shared/utils/capilitizeFirst";
import { cn } from "@/shared/utils/cn";

type VehicleStatusProps = {
  // Add props as needed, e.g., status
  status: "online" | "offline" | "in-service" | "unknown";
};

const VehicleStatus = ({ status }: VehicleStatusProps) => {
  const statusStyles = {
    online: "bg-success-bg text-success-text",
    offline: "bg-danger-bg text-danger-text",
    "in-service": "bg-warning-bg text-warning-text",
    unknown: "bg-amber-100 text-amber-800",
  }[status];

  return (
    <div
      className={cn(
        `flex items-center gap-2 rounded-2xl ${statusStyles} px-3 py-1`,
      )}
    >
      <span
        className={cn("size-2.5 rounded-full", {
          "bg-success-badge": status === "online",
          "bg-danger-badge": status === "offline",
          "bg-warning-badge": status === "in-service",
          "bg-amber-600": status === "unknown",
        })}
      ></span>
      <span className={cn("text-sm font-medium", statusStyles)}>
        {capitalizeFirst(status)}
      </span>
    </div>
  );
};

export default VehicleStatus;
