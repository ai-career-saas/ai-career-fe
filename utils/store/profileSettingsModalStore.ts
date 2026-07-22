import { create } from "zustand";

interface ProfileSettingsModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useProfileSettingModalStore = create<ProfileSettingsModalState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
