import { cn } from "@/shared/utils/cn";
import { Search } from "lucide-react";

type SearchbarProps = {
  placeholder: string;
  className?: string;
};

const Searchbar = ({ placeholder, className }: SearchbarProps) => {
  return (
    <div className={cn("relative flex-1", className)}>
      <div className="absolute inset-y-0 left-3 flex items-center">
        <Search className="text-deep-violet-navy" size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 text-dark-navy-purple placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-icy-blue focus:border-icy-blue"
      />
    </div>
  );
};

export default Searchbar;
