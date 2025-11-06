import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileId = string;

type ProfileSelectionState = {
  selectedProfileId: ProfileId | null;

  // actions
  setSelectedProfile: (profileId: ProfileId | null) => void;
  toggleProfile: (profileId: ProfileId) => void;
  clearSelection: () => void;

  // pruneAgainst: (existingIds: ProfileId[]) => void;
};

const useProfileStore = create<ProfileSelectionState>()(
  persist(
    (set, get) => ({
      selectedProfileId: null,
      setSelectedProfile: (profileId: ProfileId | null) => {
        set(() => ({ selectedProfileId: profileId }));
      },
      toggleProfile: (profileId: ProfileId) => {
        set((state) => ({
          selectedProfileId:
            state.selectedProfileId === profileId ? null : profileId,
        }));
      },
      clearSelection: () => {
        set(() => ({ selectedProfileId: null }));
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
      partialize: (state) => ({ selectedProfileId: state.selectedProfileId }), // only persist selectedProfileId
    },
  ),
);

export default useProfileStore;
