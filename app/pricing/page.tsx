"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap, Crown, ArrowLeft, Loader2 } from "lucide-react";
import { Button, Badge, Card, Alert, Spinner } from "@/components/ui";
import { billingApi } from "@/lib/api";
import { useAuthStore } from "@/utils/store/authStore";
import { Plan } from "@/types";
import { client } from "@/utils/api/client";

const PLAN_ICONS: Record<string, React.ReactNode> = {
  Free: <Sparkles size={22} className="text-slate-600" />,
  Pro: <Zap size={22} className="text-rose-600" />,
  Premium: <Crown size={22} className="text-amber-500" />,
};

const PLAN_STYLES: Record<
  string,
  { border: string; bg: string; badge?: string }
> = {
  Free: { border: "border-slate-200", bg: "bg-white" },
  Pro: { border: "border-rose-500", bg: "bg-white", badge: "Most Popular" },
  Premium: { border: "border-amber-400", bg: "bg-white", badge: "Best Value" },
};

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPlans = async () => {
    const { data, error } = await client.GET("/plans");

    if (error) {
      setError("Failed to fetch plans");
    } else {
      setPlans(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubscribe = async (plan: Plan) => {
    if (!isAuthenticated()) {
      router.push("/auth/login?from=/pricing");
      return;
    }

    if (plan.price_thb === 0) {
      setSuccess("You're already on the Free plan!");
      return;
    }

    if (!plan.stripe_price_id) {
      setError("This plan is not yet available for purchase.");
      return;
    }

    setError("");
    setSubscribing(plan.id);

    try {
      const { data } = await billingApi.subscribe(plan.id);

      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to initiate payment");
      setSubscribing(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || user.plan_name === "Free") {
      return;
    }

    const confirmed = window.confirm(
      "Cancel your subscription? You can still use the current plan until the billing period ends.",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setCancelling(true);

    try {
      await billingApi.cancel();
      const { data, error } = await client.GET("/auth/me");
      if (!error) {
        setUser(data);
      }
      setSuccess("Your subscription has been cancelled.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel subscription");
    } finally {
      setCancelling(false);
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
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        {isAuthenticated() && (
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="rose" className="mb-4 px-3 py-1">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Unlock AI-powered career tools. Start free, upgrade anytime.
          </p>
        </div>

        {isAuthenticated() && (
          <Card className="mb-8 border border-slate-200 shadow-sm bg-white">
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Subscription settings
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  Manage your current plan
                </h2>
                <p className="text-sm text-slate-500 max-w-2xl">
                  {user?.plan_name && user.plan_name !== "Free"
                    ? `You are currently on the ${user.plan_name} plan. You can cancel here or review other plans below.`
                    : "You are on the Free plan. Choose a plan below to upgrade when you are ready."}
                </p>
              </div>

              {user?.plan_name && user.plan_name !== "Free" ? (
                <Button
                  variant="danger"
                  className="shrink-0"
                  onClick={handleCancelSubscription}
                  loading={cancelling}
                  disabled={cancelling}
                >
                  Cancel subscription
                </Button>
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 border border-slate-200">
                  No active paid subscription
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Alerts */}
        {error && (
          <Alert variant="error" title={error}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" title={success}>
            {success}
          </Alert>
        )}

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
                className={`relative rounded-2xl border-2 ${style.border} ${style.bg} p-6 shadow-sm hover:shadow-md transition-shadow ${isPro ? "shadow-rose-100" : ""}`}
              >
                {style.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge
                      variant={plan.name === "Pro" ? "rose" : "yellow"}
                      className="px-3 py-1 shadow-sm"
                    >
                      {style.badge}
                    </Badge>
                  </div>
                )}

                {/* Plan Header */}
                <div className="flex items-center gap-3 mb-4 pt-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.name === "Free" ? "bg-slate-100" : plan.name === "Pro" ? "bg-rose-50" : "bg-amber-50"}`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {plan.price_thb === 0 ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        Free
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg text-slate-500 font-medium">
                        $
                      </span>
                      <span className="text-4xl font-bold text-slate-900">
                        {plan.price_thb}
                      </span>
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
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700"
                    >
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${plan.name === "Free" ? "text-slate-400" : plan.name === "Pro" ? "text-rose-500" : "text-amber-500"}`}
                      />
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
                    {plan.price_thb === 0
                      ? "Get Started Free"
                      : `Subscribe — $${plan.price_thb}/mo`}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-slate-400 text-sm">
            🔒 Secure payments via Stripe · Cancel anytime · No hidden fees
          </p>
          {!isAuthenticated() && (
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-rose-600 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
