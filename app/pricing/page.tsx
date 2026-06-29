"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Crown, ArrowLeft, Loader2 } from "lucide-react";
import { Button, Badge, Card, Alert, Spinner } from "@/components/ui";
import { plansApi, billingApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Plan } from "@/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  Free:    <Sparkles size={22} className="text-slate-600" />,
  Pro:     <Zap size={22} className="text-blue-600" />,
  Premium: <Crown size={22} className="text-amber-500" />,
};

const PLAN_STYLES: Record<string, { border: string; bg: string; badge?: string }> = {
  Free:    { border: "border-slate-200",  bg: "bg-white" },
  Pro:     { border: "border-blue-500",   bg: "bg-white",  badge: "Most Popular" },
  Premium: { border: "border-amber-400",  bg: "bg-white",  badge: "Best Value" },
};

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    plansApi.getAll().then((r) => setPlans(r.data)).finally(() => setLoading(false));

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (!isAuthenticated()) {
      router.push("/auth/login?from=/pricing");
      return;
    }

    if (plan.price_inr === 0) {
      setSuccess("You're already on the Free plan!");
      return;
    }

    if (!plan.razorpay_plan_id) {
      setError("This plan is not yet available for purchase.");
      return;
    }

    setError("");
    setSubscribing(plan.id);

    try {
      const { data } = await billingApi.subscribe(plan.id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "AI Career Advisor",
        description: `${plan.name} Plan — ₹${plan.price_inr}/month`,
        image: "/logo.png",
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#2563eb" },
        handler: () => {
          setSuccess(`🎉 Successfully subscribed to ${plan.name} Plan! Redirecting...`);
          setTimeout(() => router.push("/dashboard"), 2500);
        },
        modal: {
          ondismiss: () => setSubscribing(null),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setSubscribing(null);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to initiate payment");
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        {isAuthenticated() && (
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="blue" className="mb-4 px-3 py-1">Simple Pricing</Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Unlock AI-powered career tools. Start free, upgrade anytime.
          </p>
        </div>

        {/* Alerts */}
        {error && <Alert variant="error" title={error} >{error}</Alert>}
        {success && <Alert variant="success" title={success} >{success}</Alert>}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const style = PLAN_STYLES[plan.name] || PLAN_STYLES.Free;
            const icon = PLAN_ICONS[plan.name];
            const isCurrentPlan = user?.plan_name === plan.name;
            const isPro = plan.name === "Pro";

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${style.border} ${style.bg} p-6 shadow-sm hover:shadow-md transition-shadow ${isPro ? "shadow-blue-100" : ""}`}
              >
                {style.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge variant={plan.name === "Pro" ? "blue" : "yellow"} className="px-3 py-1 shadow-sm">
                      {style.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4 pt-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.name === "Free" ? "bg-slate-100" : plan.name === "Pro" ? "bg-blue-50" : "bg-amber-50"}`}>
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price_inr === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">Free</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-slate-500 font-medium">₹</span>
                      <span className="text-4xl font-bold text-slate-900">{plan.price_inr}</span>
                      <span className="text-slate-500 text-sm">/month</span>
                    </div>
                  )}
                </div>

                {/* Quota */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {Object.entries(plan.quota || {}).map(([k, v]) => (
                    <Badge key={k} variant="gray" className="text-xs">
                      {v >= 999 ? "∞" : v} {k.replace("_", " ")}
                    </Badge>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {(plan.features as string[]).map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={16} className={`mt-0.5 shrink-0 ${plan.name === "Free" ? "text-slate-400" : plan.name === "Pro" ? "text-blue-500" : "text-amber-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {isCurrentPlan ? (
                  <div className="w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium">
                    Current Plan
                  </div>
                ) : (
                  <Button
                    variant={isPro ? "primary" : "outline"}
                    className="w-full"
                    onClick={() => handleSubscribe(plan)}
                    loading={subscribing === plan.id}
                    disabled={!!subscribing}
                  >
                    {plan.price_inr === 0 ? "Get Started Free" : `Subscribe — ₹${plan.price_inr}/mo`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-slate-400 text-sm">
            🔒 Secure payments via Razorpay · Cancel anytime · No hidden fees
          </p>
          {!isAuthenticated() && (
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
