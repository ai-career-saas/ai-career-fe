"use client";

import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export function Alert({
  variant = "info",
  title,
  children,
}: {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
}) {
  const styles = {
    info:    "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error:   "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-sm", styles[variant])}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      {children}
    </div>
  );
}