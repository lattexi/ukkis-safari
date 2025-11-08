import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProfileId = number;

type ProfileSelectionState = {
  selectedProfileId: ProfileId | null;
  safariCount: number;

  // actions
  setSelectedProfile: (profileId: ProfileId | null) => void;
  toggleProfile: (profileId: ProfileId, safariCount: number) => void;
  clearSelection: () => void;

  // pruneAgainst: (existingIds: ProfileId[]) => void;
};

const useProfileStore = create<ProfileSelectionState>()(
  persist(
    (set, get) => ({
      selectedProfileId: null,
      safariCount: 0,
      setSelectedProfile: (profileId: ProfileId | null) => {
        set(() => ({ selectedProfileId: profileId }));
      },

      toggleProfile: (profileId: ProfileId, safariCount: number) => {
        set((state) => ({
          selectedProfileId:
            state.selectedProfileId === profileId ? null : profileId,
          safariCount: state.selectedProfileId === profileId ? 0 : safariCount,
        }));
      },
      clearSelection: () => {
        set(() => ({ selectedProfileId: null, safariCount: 0 }));
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
        safariCount: state.safariCount,
      }), // only persist selectedProfileId
    },
  ),
);

export default useProfileStore;
