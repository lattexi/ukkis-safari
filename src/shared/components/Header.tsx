import { cn } from "@/shared/utils/cn";
import { Link } from "react-router";

type HeaderProps = {
  title?: string;
  backButton?: boolean;
  settingsButton?: boolean;
};

const Header = ({ title, backButton, settingsButton }: HeaderProps) => {
  return (
    // <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
    <header className="bg-white/80 shadow-sm border-b border-gray-200 relative z-50">
      <div className="px-4 py-4 ">
        {backButton && (
          <Link to="/~miikavs/ukkis/profile" className="absolute left-4 top-3">
            <button
              className={cn(
                "ml-auto bg-warning-badge text-white p-2 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-hover-warning-badge transition-all",
              )}
            >
              <p className=" text-white font-bold text-base">Takaisin</p>
            </button>
          </Link>
        )}
        {settingsButton && (
          <Link
            to="/~miikavs/ukkis/settings"
            className="absolute right-4 top-3"
          >
            <button
              className={cn(
                "ml-auto bg-dark-navy-purple text-white p-2 rounded-xl flex items-center cursor-pointer",
              )}
            >
              <p className=" text-white font-bold text-base">Asetukset</p>
            </button>
          </Link>
        )}
        <h1 className="text-2xl font-bold text-dark-navy-purple text-center">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;
