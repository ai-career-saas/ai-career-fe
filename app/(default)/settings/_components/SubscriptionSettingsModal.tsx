"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Invoice } from "@/types/billing/Invoice";
import { CurrentPlan } from "@/types/plan/CurrentPlan";
import { client } from "@/utils/api/client";
import { useEffect, useState } from "react";
import { useSubscriptionSettingStore } from "@/utils/store/subscriptionSettingStore";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatInr(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export default function SubscriptionSettingsModal() {
  const { isOpen, close } = useSubscriptionSettingStore();

  const [plan, setPlan] = useState<CurrentPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const getApiErrorMessage = (error: unknown) => {
    if (!error || typeof error !== "object") {
      return null;
    }

    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      const text = message.find((item): item is string => typeof item === "string");
      return text ?? null;
    }

    return null;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const planRes = await client.GET("/billing/subscription");
      setPlan((planRes as any)?.data ?? null);
    } catch {
      setPlan(null);
    }

    try {
      const invoicesRes = await client.GET("/billing/invoices");
      console.log("invoicesRes", invoicesRes);
      setInvoices((invoicesRes as any)?.data ?? []);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setConfirmingCancel(false);
      return;
    }

    void loadData();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmingCancel(false);
      setPortalError(null);
    }
  }, [isOpen]);

  const handleCancel = async () => {
    setBusy(true);
    try {
      const result = await client.POST("/billing/cancel", {
        body: { cancelAtPeriodEnd: true },
      });
      const data = (result as any)?.data ?? null;
      setPlan((prev) => (prev && data ? { ...prev, ...data } : prev));
      setConfirmingCancel(false);
    } finally {
      setBusy(false);
    }
  };

  const handleResume = async () => {
    setBusy(true);
    try {
      const result = await client.POST("/billing/resume");
      const data = (result as any)?.data ?? null;
      setPlan((prev) => (prev && data ? { ...prev, ...data } : prev));
    } finally {
      setBusy(false);
    }
  };

  const handleManageSubscription = async () => {
    setPortalError(null);
    setBusy(true);
    const { data, error } = await client.GET("/billing/portal");
    const portalUrl = (data as { url?: string } | undefined)?.url;

    if (error) {
      setPortalError(
        getApiErrorMessage(error) ?? "Unable to open billing portal right now.",
      );
    } else if (!portalUrl) {
      setPortalError("Unable to open billing portal right now.");
    } else {
      window.open(portalUrl, "_blank", "noopener,noreferrer");
    }

    setBusy(false);
  };

  if (!isOpen) {
    return null;
  }

  const canManageBilling = (plan?.price_thb ?? 0) > 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,55rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-900">
                Subscription settings
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500">
                Review your current plan, payment status, and billing history.
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close subscription settings"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <div className="max-h-[calc(90vh-4.5rem)] overflow-y-auto px-6 py-6">
            {loading && !plan ? (
              <div className="animate-pulse text-sm text-slate-400">
                Loading subscription…
              </div>
            ) : !plan ? (
              <div className="text-sm text-slate-500">
                Subscription details are unavailable right now.
              </div>
            ) : (
              <div className="space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-slate-50 p-6 shadow-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-lg font-semibold capitalize text-slate-900">
                      {plan.plan_name}
                    </h3>
                    <span className="text-sm font-medium text-slate-500">
                      {plan.price_thb}/month
                    </span>
                  </div>

                  {plan.description && (
                    <p className="mt-1 text-sm text-slate-500">
                      {plan.description}
                    </p>
                  )}

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Quotas
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-700">
                      {Object.entries(plan.quota).map(([key, limit]) => (
                        <li
                          key={key}
                          className="flex items-center justify-between gap-4"
                        >
                          <span className="capitalize text-slate-600">
                            {key.replaceAll("_", " ")}
                          </span>
                          <span className="font-medium text-slate-900">
                            {limit} / mo
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        plan.subscriptionStatus === "active"
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    <span className="capitalize text-slate-600">
                      {plan.subscriptionStatus ?? "unknown"}
                    </span>
                    {plan.cancelAtPeriodEnd && (
                      <span className="text-amber-700">
                        · cancels on {formatDate(plan.currentPeriodEnd)}
                      </span>
                    )}
                  </div> */}

                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || !canManageBilling}
                      onClick={handleManageSubscription}
                      className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Manage subscription
                    </button>

                    {canManageBilling && plan.cancelAtPeriodEnd ? (
                      <button
                        type="button"
                        onClick={handleResume}
                        disabled={busy}
                        className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Resume subscription
                      </button>
                    ) : canManageBilling ? (
                      <button
                        type="button"
                        onClick={() => setConfirmingCancel(true)}
                        disabled={busy}
                        className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel subscription
                      </button>
                    ) : null}
                  </div>
                  {!canManageBilling && (
                    <p className="mt-2 text-sm text-slate-500">
                      Billing management is available on paid plans.
                    </p>
                  )}
                  {portalError && (
                    <p className="mt-2 text-sm text-rose-600">{portalError}</p>
                  )}

                  {confirmingCancel && (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm">
                      <p className="text-rose-800">
                        You'll keep access until{" "}
                        {formatDate(plan.currentPeriodEnd)}, then your plan
                        won't renew. Continue?
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={busy}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {busy ? "Canceling…" : "Yes, cancel"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingCancel(false)}
                          className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          Never mind
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* <div>
                  <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">
                    Billing history
                  </h4>
                  {invoices === null ? (
                    <div className="animate-pulse text-sm text-slate-400">
                      Loading invoices…
                    </div>
                  ) : invoices.length === 0 ? (
                    <p className="text-sm text-slate-500">No invoices yet.</p>
                  ) : (
                    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                      {invoices.map((inv) => (
                        <li
                          key={inv.id}
                          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                        >
                          <div>
                            <div className="text-slate-900">
                              {formatDate(inv.createdAt)}
                            </div>
                            <div className="text-xs capitalize text-slate-500">
                              {inv.status}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-slate-700">
                              {formatInr(inv.amountPaid)}
                            </span>
                            {inv.hostedInvoiceUrl && (
                              <a
                                href={inv.hostedInvoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-600 transition hover:underline"
                              >
                                View
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div> */}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
