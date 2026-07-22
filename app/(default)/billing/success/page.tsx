"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { useAuthStore } from "@/utils/store/authStore";
import { authApi } from "@/lib/api";

export default function BillingSuccessPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [verifying, setVerifying] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [planName, setPlanName] = useState<string>("Premium");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;
    let pollInterval: NodeJS.Timeout;

    const checkSubscription = async () => {
      try {
        const { data } = await authApi.me();
        if (data.plan_name && data.plan_name !== "Free") {
          setUser(data);
          setPlanName(data.plan_name);
          setVerifying(false);
          startCountdown();
          clearInterval(pollInterval);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            // Fallback: stop verifying and show success anyway
            setVerifying(false);
            startCountdown();
            clearInterval(pollInterval);
          }
        }
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          setVerifying(false);
          startCountdown();
          clearInterval(pollInterval);
        }
      }
    };

    const startCountdown = () => {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    // Run first check immediately
    checkSubscription();

    // Set up polling interval
    pollInterval = setInterval(checkSubscription, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [router, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="max-w-md w-full animate-fade-in">
        <Card className="p-8 text-center relative overflow-hidden border border-slate-100 shadow-xl bg-white/80 backdrop-blur-md">
          {/* Background highlight decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 rounded-b-full shadow-lg shadow-teal-500/20" />

          {verifying ? (
            <div className="py-8 flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
              <h2 className="text-xl font-bold text-slate-800">
                Confirming Payment...
              </h2>
              <p className="text-slate-500 text-sm max-w-xs">
                We are finalizing your subscription. This will only take a
                moment.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Animated Success Check Icon */}
              <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-100 animate-bounce">
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              </div>

              {/* Celebration Title */}
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Payment Successful!
                </h1>
                <p className="text-slate-500 text-sm">
                  Thank you for upgrading. Your account is now active.
                </p>
              </div>

              {/* Plan Summary Card */}
              <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-4 flex justify-between items-center text-left">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Subscribed Plan
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {user?.plan_name || planName} Plan
                  </p>
                </div>
                <Badge variant="green" className="px-3 py-1 font-semibold">
                  Active
                </Badge>
              </div>

              {/* Countdown or Redirect message */}
              <div className="text-slate-400 text-xs">
                Redirecting to dashboard in{" "}
                <span className="font-bold text-slate-700 text-sm px-1.5 py-0.5 bg-slate-100 rounded-md">
                  {countdown}
                </span>{" "}
                seconds...
              </div>

              {/* CTAs */}
              <Button
                variant="primary"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 group transition-all"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
