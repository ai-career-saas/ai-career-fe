"use client";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn("animate-spin text-blue-500", className)} />;
}