"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/api";
import { GetProfileResponse } from "@/types/user/GetProfileResponse";
import { client } from "@/utils/api/client";
import { Card, SectionHeader } from "@/components/ui";

export default function ProfileSettingsForm() {
  const [settings, setSettings] = useState<GetProfileResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const profiledata = async () => {
    await client.GET("/users").then((response) => {
      if (response.data) {
        setSettings(response.data);
      }
    });
  };

  useEffect(() => {
    profiledata();
  }, []);

  if (!settings) {
    return (
      <div className="animate-pulse text-sm text-gray-400">
        Loading settings…
      </div>
    );
  }

  const handleChange = <K extends keyof GetProfileResponse>(
    key: K,
    value: GetProfileResponse[K],
  ) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { email, ...patch } = settings;
      const updated = await userApi.updateProfile(patch);
      setSettings(updated.data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              disabled
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={settings.locale}
              onChange={(e) =>
                handleChange("locale", e.target.value as "en" | "th")
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="th">ไทย</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <input
              type="text"
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* <fieldset className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-50 px-4 py-4 shadow-sm">
            <legend className="px-2 text-sm font-semibold text-slate-900">
              Notifications
            </legend>
            <p className="px-2 text-xs text-slate-500">
              Choose which updates you want to receive.
            </p>
            <div className="mt-4 grid gap-3">
              {(
                [
                  ["notifyEmail", "Account & security emails"],
                  ["notifyProduct", "Product updates"],
                  ["notifyUsageAlerts", "Usage / quota alerts"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={settings[key]}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-2 focus:ring-rose-500"
                  />
                  <span className="flex-1">{label}</span>
                </label>
              ))}
            </div>
          </fieldset> */}

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}
