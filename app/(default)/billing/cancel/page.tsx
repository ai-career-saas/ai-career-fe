"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, Button } from "@/components/ui";

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="max-w-md w-full animate-fade-in">
        <Card className="p-8 text-center relative overflow-hidden border border-slate-100 shadow-xl bg-white/80 backdrop-blur-md">
          {/* Background highlight decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 rounded-b-full shadow-lg shadow-orange-500/20" />

          <div className="space-y-6">
            {/* Warning Cancel Icon */}
            <div className="mx-auto w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-100">
              <XCircle className="h-10 w-10 text-amber-600 animate-pulse" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Checkout Cancelled
              </h1>
              <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                Your checkout process was cancelled. No charges were made to
                your account. Feel free to complete the checkout whenever you
                are ready.
              </p>
            </div>

            {/* Quick value proposition */}
            <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-5 text-left space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                Why upgrade to Pro?
              </h3>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>30+ AI Career roadmaps & skill gap analysis</li>
                <li>Unlimited interview prep question generation</li>
                <li>Comprehensive ATS resume scoring & feedback</li>
                <li>Priority server speeds for instant AI responses</li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft size={16} />
                Dashboard
              </Button>
              <Button
                variant="primary"
                className="w-full bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold flex items-center justify-center gap-2"
                onClick={() => router.push("/pricing")}
              >
                <RefreshCw size={16} />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
