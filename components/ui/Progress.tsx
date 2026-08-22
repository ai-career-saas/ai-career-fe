"use client";

import { cn } from "@/utils/cn";

export function ProgressBar({ value, max = 100, className, colorClass }: {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={cn("h-2 rounded-full bg-slate-100 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700", colorClass || "bg-rose-500")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}