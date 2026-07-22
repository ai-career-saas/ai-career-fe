"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Sparkles,
  Star,
  Settings2,
  Target,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/utils/store/authStore";
import { useProfileSettingModalStore } from "@/utils/store/profileSettingsModalStore";
import { useSubscriptionSettingStore } from "@/utils/store/subscriptionSettingStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/analyze", label: "Career Analysis", icon: Target },
  {
    href: "/dashboard/interview-prep",
    label: "Interview Prep",
    icon: MessageSquare,
  },
  { href: "/dashboard/ats-score", label: "ATS Score", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { open: openProfileSettings } = useProfileSettingModalStore();
  const { open: openSubscriptionSettings } = useSubscriptionSettingStore();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight">
            AI Career
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(href, exact)
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Plan badge + profile */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <Link
          href="/pricing"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-300 transition-all"
        >
          <Star size={14} className="text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-700">
              {user?.plan_name || "Free"} Plan
            </p>
            <p className="text-xs text-slate-500 truncate">Upgrade for more</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 px-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex flex-1 items-center gap-3 min-w-0 rounded-2xl px-2 py-1.5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-50 min-w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/70"
              >
                <DropdownMenu.Item
                  onSelect={(event) => {
                    event.preventDefault();
                    openProfileSettings();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900"
                >
                  <Settings2 size={16} className="text-slate-500" />
                  Profile settings
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={(event) => {
                    event.preventDefault();
                    openSubscriptionSettings();
                  }}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900"
                >
                  <Settings2 size={16} className="text-slate-500" />
                  Subscription settings
                </DropdownMenu.Item>
                {/* <DropdownMenu.Item asChild>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900"
                  >
                    <CreditCard size={16} className="text-slate-500" />
                    Subscription settings
                  </Link>
                </DropdownMenu.Item> */}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
