import { cn } from "@/shared/utils/cn";

type StatusFieldProps = {
  children?: React.ReactNode; // Using 'children' is more idiomatic
  ButtonColor?: string;
  ButtonIcon?: React.ReactNode;
  ButtonText?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const StatusField = ({
  children,
  ButtonColor,
  ButtonIcon,
  ButtonText,
  onClick,
}: StatusFieldProps) => {
  return (
    <div className="flex bg-icy-mint/50 rounded-lg px-4 py-3 items-center">
      <div className="text-dark-navy-purple font-semibold">{children}</div>
      <button
        onClick={onClick}
        className={cn(
          `ml-auto px-4 cursor-pointer py-2 rounded-lg shadow-md hover:bg-dark-navy-purple`,
          ButtonColor ? ButtonColor : "bg-icy-blue",
        )}
      >
        {ButtonIcon} {ButtonText}
      </button>
    </div>
  );
};

export default StatusField;
