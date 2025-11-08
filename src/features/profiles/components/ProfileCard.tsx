import useProfileStore from "@/features/profiles/store/useProfileStore";
import { cn } from "@/shared/utils/cn";
import { User } from "lucide-react";
import { useCallback } from "react";
import { FaRoute } from "react-icons/fa6";

type ProfileCardProps = {
  name: string;
  safariCount: number;
  uniqueId: string;
};

const ProfileCard = ({ name, uniqueId, safariCount }: ProfileCardProps) => {
  const isSelected = useProfileStore(
    (state) => state.selectedProfileId === uniqueId,
  );

  const toggleProfile = useProfileStore((state) => state.toggleProfile);

  const handleSelect = useCallback(() => {
    toggleProfile(uniqueId);
  }, [uniqueId, toggleProfile]);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col items-center",
        isSelected && "bg-icy-blue/10 border-icy-blue/30",
      )}
      onClick={handleSelect}
    >
      {/* Profile Icon */}
      <div className="w-12 h-12 bg-icy-blue/20 rounded-xl flex items-center justify-center mb-4">
        <User className="text-icy-blue" />
      </div>

      <h3 className="text-lg font-semibold text-dark-navy-purple mb-1">
        {name}
      </h3>
      <p className="text-md font-medium text-gray-500 mb-2">({uniqueId})</p>

      {/* Safari count */}
      {safariCount ? (
        <div
          className={cn(
            "bg-icy-mint/30 rounded-xl p-2 text-gray-500 w-full text-center",
            isSelected && "bg-icy-blue/20 font-bold",
          )}
        >
          <div className="flex items-center justify-center">
            <FaRoute className="text-icy-blue text-lg" />
            <span className="text-sm text-deep-violet-navy font-bold mx-2">
              {safariCount}
            </span>
            Safaria
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "bg-icy-mint/30 rounded-xl p-2 text-gray-500 w-full text-center",
            isSelected && "bg-icy-blue/20 font-bold",
          )}
        >
          Ei löytynyt safari-tietoja
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
