import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

type InputDataFieldProps = {
  Header: string;
  Description?: string;
  Icon?: React.ReactNode;
  placeholder?: string;
  sensitive?: boolean;
};

const InputDataField = ({
  Header,
  Description,
  Icon,
  placeholder,
  sensitive,
}: InputDataFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col">
      {Header && (
        <h3 className="text-lg font-medium text-dark-navy-purple">{Header}</h3>
      )}

      {/* Wrapper div with relative positioning */}
      <div className="relative my-3">
        {/* Left icon - always shown if provided */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {Icon}
          </div>
        )}

        {/* Input with extra padding based on icons */}
        <input
          type={sensitive && !isVisible ? "password" : "text"}
          className={cn(
            "w-full bg-icy-mint/50 rounded-lg py-3 border border-gray-300 text-dark-navy-purple",
            Icon && sensitive
              ? "pl-12 pr-12"
              : Icon
                ? "pl-12 pr-4"
                : sensitive
                  ? "pl-4 pr-12"
                  : "px-4",
          )}
          placeholder={placeholder}
        />

        {/* Right icon - show/hide toggle for sensitive fields */}
        {sensitive && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            {isVisible ? (
              <FaEyeSlash className="w-5 h-5 text-dark-navy-purple" />
            ) : (
              <FaEye className="w-5 h-5 text-dark-navy-purple" />
            )}
          </button>
        )}
      </div>

      {Description && (
        <p className="text-sm text-dark-navy-purple mb-2">{Description}</p>
      )}
    </div>
  );
};

export default InputDataField;
