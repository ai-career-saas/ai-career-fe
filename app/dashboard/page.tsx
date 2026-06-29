"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card, Badge, ProgressBar, Spinner } from "@/components/ui";
import { useAuthStore } from "@/lib/auth-store";
import { usageApi, authApi } from "@/lib/api";
import { UsageMap } from "@/types";

const FEATURE_LABELS: Record<string, { label: string; icon: React.ReactNode; href: string; color: string }> = {
  analyze:       { label: "Career Analysis",   icon: <Target size={18} />,      href: "/dashboard/analyze",        color: "text-blue-600"  },
  interview_gen: { label: "Interview Prep",     icon: <MessageSquare size={18} />, href: "/dashboard/interview-prep", color: "text-purple-600" },
  ats_score:     { label: "ATS Scoring",        icon: <FileText size={18} />,    href: "/dashboard/ats-score",      color: "text-green-600" },
};

export default function DashboardPage() {
  const { user, setUser } = useAuthStore();
  const [usage, setUsage] = useState<UsageMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      usageApi.getAll().then((r) => setUsage(r.data)),
      authApi.me().then((r) => setUser(r.data)),
    ]).finally(() => setLoading(false));
  }, [setUser]);

  const tools = [
    {
      href: "/dashboard/analyze",
      icon: <Target size={22} className="text-blue-600" />,
      bg: "bg-blue-50",
      title: "Career Analysis",
      desc: "AI analyzes your skills, detects gaps, and builds a personalized roadmap.",
      badge: "Popular",
      badgeVariant: "blue" as const,
    },
    {
      href: "/dashboard/interview-prep",
      icon: <MessageSquare size={22} className="text-purple-600" />,
      bg: "bg-purple-50",
      title: "Interview Prep",
      desc: "Get role-specific interview questions with answer tips in Thai.",
      badge: "New",
      badgeVariant: "purple" as const,
    },
    {
      href: "/dashboard/ats-score",
      icon: <FileText size={22} className="text-green-600" />,
      bg: "bg-green-50",
      title: "ATS Resume Score",
      desc: "See how your resume scores against a job description with detailed feedback.",
      badge: "AI Powered",
      badgeVariant: "green" as const,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            สวัสดี, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            ยินดีต้อนรับสู่ AI Career Advisor
          </p>
        </div>
        <Badge variant={user?.plan_name === "Free" ? "gray" : "blue"} className="px-3 py-1 text-sm">
          <Sparkles size={12} className="mr-1" />
          {user?.plan_name || "Free"} Plan
        </Badge>
      </div>

      {/* Usage Cards */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Monthly Usage
        </h2>
        {loading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(FEATURE_LABELS).map(([key, meta]) => {
              const u = usage?.[key];
              const pct = u ? Math.round((u.used / u.limit) * 100) : 0;
              const colorClass =
                pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-500" : "bg-blue-500";
              return (
                <Card key={key} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={meta.color}>{meta.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-2xl font-bold text-slate-900">{u?.used ?? 0}</span>
                    <span className="text-sm text-slate-400">/ {u?.limit ?? 0}</span>
                  </div>
                  <ProgressBar value={u?.used ?? 0} max={u?.limit ?? 1} colorClass={colorClass} />
                  <p className="text-xs text-slate-500 mt-2">{u?.remaining ?? 0} remaining this month</p>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          AI Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link key={t.href} href={t.href}>
              <Card className="p-5 h-full hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                <div className={`w-11 h-11 rounded-xl ${t.bg} flex items-center justify-center mb-4`}>
                  {t.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-slate-900">{t.title}</h3>
                  <Badge variant={t.badgeVariant}>{t.badge}</Badge>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
                <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Get Started <ArrowRight size={14} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Upgrade CTA if Free */}
      {user?.plan_name === "Free" && (
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={18} />
                <h3 className="font-bold text-lg">Upgrade to Pro</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Get 30 analyses/month, unlimited roadmaps & priority support.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-all text-sm"
            >
              View Plans
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
