import { cn } from "@/shared/utils/cn";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Slider from "@mui/material/Slider";
import useSettingsStore from "@/features/settings/store/useSettingsStore";

type InputDataFieldProps = {
  Header: string;
  valueKey: "apiUrl" | "apiKey" | "alertRange";
  Description?: string;
  Icon?: React.ReactNode;
  placeholder?: string;
  slider?: boolean;
  defaultValue?: number | number[];
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderValue?: number;
  sliderMarks?: { value: number; label: string }[] | boolean;
  sensitive?: boolean;
};

const valueText = (value: number) => {
  return `${value}`;
};

const InputDataField = ({
  Header,
  valueKey,
  Description,
  Icon,
  placeholder,
  slider,
  sliderMin,
  sliderMax,
  sliderStep,
  sliderMarks,
  defaultValue,
  sensitive,
}: InputDataFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const value = useSettingsStore((state) => state[valueKey]);
  const setValue = useSettingsStore((state) => {
    switch (valueKey) {
      case "apiUrl":
        return state.setApiUrl;
      case "apiKey":
        return state.setApiKey;
      case "alertRange":
        return state.setAlertRange;
      default:
        return () => {};
    }
  }) as (value: any) => void;

  const handleChange = (_: Event, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div className="flex flex-col">
      {Header && (
        <h3 className="text-lg font-medium text-dark-navy-purple">{Header}</h3>
      )}

      {/* Wrapper div with relative positioning */}
      <div className="relative my-3">
        {slider ? (
          /* MUI Slider Input */
          <Slider
            aria-label="Range"
            onChange={handleChange}
            value={value as number}
            defaultValue={defaultValue}
            getAriaValueText={valueText}
            valueLabelDisplay="auto"
            shiftStep={30}
            step={sliderStep}
            marks={sliderMarks}
            min={sliderMin}
            max={sliderMax}
          />
        ) : (
          /* Regular Text Input */
          <>
            {/* Left icon - always shown if provided */}
            {Icon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {Icon}
              </div>
            )}

            {/* Input with extra padding based on icons */}
            <input
              type={sensitive && !isVisible ? "password" : "text"}
              autoComplete="off"
              onChange={(e) => setValue(e.target.value as any)}
              value={value}
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
          </>
        )}
      </div>

      {Description && (
        <p className="text-sm text-dark-navy-purple mb-2">{Description}</p>
      )}
    </div>
  );
};

export default InputDataField;
