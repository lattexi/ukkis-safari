import { LoadingDots } from "@/shared/components/LoadingDots";
import { cn } from "@/shared/utils/cn";
import useProfileStore from "@/features/profiles/store/useProfileStore";

type ProfileSummaryProps = {
  isLoading?: boolean;
  onStart?: () => void;
};

const ProfileSummary = ({ isLoading, onStart }: ProfileSummaryProps) => {
  const selectedProfile = useProfileStore((state) => state.selectedProfileId);

  return (
    <div className="py-4 px-6 bg-white flex absolute bottom-0 w-full shadow-md">
      <button
        onClick={onStart}
        disabled={isLoading || selectedProfile === null}
        // className="ml-auto bg-warning-badge text-white px-4 py-2 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-hover-warning-badge transition-all"
        className={cn(
          " bg-warning-badge text-white px-12 py-4 rounded-xl flex items-center cursor-pointer hover:scale-106 hover:bg-hover-warning-badge transition-all m-auto text-center",
          (isLoading || selectedProfile === null) &&
            "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-warning-badge",
        )}
      >
        {!isLoading ? (
          <>
            <p className=" text-white font-bold text-xl">
              Jatka ajoneuvojen valintaan
            </p>
          </>
        ) : (
          <>
            {/* <RiLoader2Fill
              className="inline-block mr-2 ml-4 animate-spin"
              size={20}
            /> */}
            <p className="mx-4 text-white flex items-baseline font-bold text-xl">
              <span className="animate-none">Loading</span> <LoadingDots />
            </p>
          </>
        )}
      </button>
    </div>
  );
};

export default ProfileSummary;
