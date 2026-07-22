"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import { useAuthStore } from "@/utils/store/authStore";
import ProfileSettingsModal from "./settings/_components/ProfileSettingsModal";
import SubscriptionSettingsModal from "./settings/_components/SubscriptionSettingsModal";
import SkillUpgradePanel from "@/app/(default)/dashboard/analyze/_components/SkillUpgradePanel";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const hydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  useEffect(() => {
    if (hydrated && !isAuthenticated()) {
      router.push("/auth/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated()) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">{children}</div>
      </main>

      <ProfileSettingsModal />

      <SubscriptionSettingsModal />
    </div>
  );
}
