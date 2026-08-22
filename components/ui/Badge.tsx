"use client";

import { cn } from "@/utils/cn";
import { ReactNode } from "react";

type BadgeVariant = "rose" | "green" | "yellow" | "red" | "gray" | "purple";

export function Badge({
  children,
  variant = "rose",
  className,
}: {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  const variants: Record<BadgeVariant, string> = {
    rose:   "bg-rose-100 text-rose-700 border-rose-200",
    green:  "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    red:    "bg-red-100 text-red-700 border-red-200",
    gray:   "bg-slate-100 text-slate-600 border-slate-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
}
