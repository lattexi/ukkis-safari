import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileId = number;

type ProfileSelectionState = {
  selectedProfileId: ProfileId | null;
  profileName: string | null;
  uniqueId: string | null;
  safariCount: number;

  // actions
  setSelectedProfile: (profileId: ProfileId | null) => void;
  toggleProfile: (
    profileId: ProfileId,
    safariCount: number,
    profileName: string | null,
    uniqueId: string | null,
  ) => void;
  clearSelection: () => void;

  // pruneAgainst: (existingIds: ProfileId[]) => void;
};

const useProfileStore = create<ProfileSelectionState>()(
  persist(
    (set, get) => ({
      selectedProfileId: null,
      profileName: null,
      uniqueId: null,
      safariCount: 0,
      setSelectedProfile: (profileId: ProfileId | null) => {
        set(() => ({ selectedProfileId: profileId }));
      },

      toggleProfile: (
        profileId: ProfileId,
        safariCount: number,
        profileName: string | null,
        uniqueId: string | null,
      ) => {
        set((state) => ({
          selectedProfileId:
            state.selectedProfileId === profileId ? null : profileId,
          safariCount: state.selectedProfileId === profileId ? 0 : safariCount,
          profileName:
            state.selectedProfileId === profileId ? null : profileName,
          uniqueId: state.selectedProfileId === profileId ? null : uniqueId,
        }));
      },
      clearSelection: () => {
        set(() => ({
          selectedProfileId: null,
          safariCount: 0,
          profileName: null,
          uniqueId: null,
        }));
      },
      // pruneAgainst: (existingIds: ProfileId[]) => {
      //   const profileIds = new Set(existingIds);
      //   const pruned = get().selectedProfileId.filter((p) =>
      //     profileIds.has(p),
      //   );
      //   set(() => ({ selectedProfileId: pruned }));
      // },
    }),
    {
      name: "profile-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        selectedProfileId: state.selectedProfileId,
        uniqueId: state.uniqueId,
        safariCount: state.safariCount,
        profileName: state.profileName,
      }), // only persist selectedProfileId
    },
  ),
);

export default useProfileStore;
