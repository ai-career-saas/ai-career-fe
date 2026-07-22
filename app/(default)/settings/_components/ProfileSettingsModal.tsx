"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import ProfileSettingsForm from "./ProfileSettingsForm";
import { useProfileSettingModalStore } from "@/utils/store/profileSettingsModalStore";

export default function ProfileSettingsModal() {
  const { isOpen, close } = useProfileSettingModalStore();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,55rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                Profile settings
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500">
                Update your personal details and notification preferences.
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close profile settings"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="max-h-[calc(90vh-4.5rem)] overflow-y-auto px-6 py-6">
            <ProfileSettingsForm />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
