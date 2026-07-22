import { NearReachCareer } from "@/types";
import { create } from "zustand";

interface SkillUpgradeState {
  selectedUpgrade: NearReachCareer | null;
  isOpen: boolean;
  setSelectedUpgrade: (career: NearReachCareer) => void;
  openUpgrade: (career: NearReachCareer) => void;
  open: () => void;
  close: () => void;
}

export const useSkillUpgradeStore = create<SkillUpgradeState>((set) => ({
  selectedUpgrade: null,
  isOpen: false,
  setSelectedUpgrade: (career: NearReachCareer) =>
    set({ selectedUpgrade: career }),
  openUpgrade: (career: NearReachCareer) =>
    set({ selectedUpgrade: career, isOpen: true }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, selectedUpgrade: null }),
}));
