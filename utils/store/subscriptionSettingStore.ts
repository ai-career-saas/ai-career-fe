import { create } from "zustand";

interface SubscriptionSettingState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSubscriptionSettingStore = create<SubscriptionSettingState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
);
