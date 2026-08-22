"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Brain,
  FileText,
  MessageSquare,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const FEATURES = [
  {
    icon: Target,
    title: "Career Analysis",
    desc: "Detect skill gaps, highlight strengths, and build a focused roadmap.",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    desc: "Practice role-specific questions with practical answer guidance.",
  },
  {
    icon: FileText,
    title: "ATS Resume Score",
    desc: "Compare your resume against job descriptions and improve the match.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Upload your profile",
    desc: "Share your resume, goals, or target role to start the analysis.",
  },
  {
    number: "02",
    title: "Get AI recommendations",
    desc: "See the gaps, opportunities, and next actions in one clear view.",
  },
  {
    number: "03",
    title: "Act with confidence",
    desc: "Use the roadmap, interview prep, and ATS insights to move faster.",
  },
];

export default function RootPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 shadow-sm shadow-rose-500/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold tracking-tight text-slate-900">
                AI Career Advisor
              </p>
              <p className="text-xs text-slate-500">
                Career tools that actually move you forward
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#process"
              className="transition-colors hover:text-slate-900"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-slate-900"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:inline-flex"
            >
              Sign in
            </Link>
            <Link href="/auth/register">
              <Button size="sm" icon={<ArrowRight size={14} />}>
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="space-y-8 animate-fade-in">
          <Badge variant="rose" className="inline-flex w-fit px-3 py-1 text-sm">
            <Sparkles size={12} className="mr-1" />
            AI-powered career coaching
          </Badge>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Build a career plan that is specific, measurable, and easier to
              act on.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              AI Career Advisor helps you analyze your skills, prepare for
              interviews, and score your resume against target roles. The
              interface stays clean, direct, and focused on the next step.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/auth/register">
              <Button size="lg" icon={<ArrowRight size={16} />}>
                Create free account
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                Open dashboard
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <TrendingUp size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">3 tools</p>
              <p className="text-sm text-slate-500">
                Career analysis, interview prep, ATS scoring.
              </p>
            </Card>
            <Card className="p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BadgeCheck size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">Fast feedback</p>
              <p className="text-sm text-slate-500">
                Clear recommendations instead of vague advice.
              </p>
            </Card>
            <Card className="p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Users size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900">Personalized</p>
              <p className="text-sm text-slate-500">
                Built around your profile, goals, and target role.
              </p>
            </Card>
          </div>
        </div>

        <div className="relative animate-fade-in lg:pt-4 flex items-center justify-center">
          <Card className="relative overflow-hidden p-6 shadow-lg shadow-slate-200/80">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-rose-500 via-rose-500 to-cyan-500" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Overview
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Your AI career dashboard
                  </h2>
                </div>
                <div className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                  Ready to use
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Brain size={16} className="text-rose-600" />
                    Skill analysis
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Compare your current profile against the role you want next.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Target size={16} className="text-rose-600" />
                    Roadmap clarity
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Turn vague goals into a practical sequence of next actions.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4">
                <p className="text-sm font-semibold text-rose-700">
                  What you get
                </p>
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
                      1
                    </div>
                    <p>
                      Role-specific career analysis with clear gaps and
                      strengths.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
                      2
                    </div>
                    <p>
                      Interview preparation that adapts to the position you
                      want.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-rose-600 shadow-sm">
                      3
                    </div>
                    <p>
                      ATS scoring and resume feedback that helps you improve
                      match quality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Features
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Everything is organized around the next decision.
            </h2>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="process" className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
        <Card className="p-6 lg:p-8">
          <div className="mb-6 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              How it works
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              A simple flow that reduces friction.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              The product is designed to keep the experience lightweight while
              still giving you useful output you can act on immediately.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-semibold text-rose-600">
                  {step.number}
                </p>
                <h3 className="mt-3 text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 pb-20 lg:px-8">
        <Card className="bg-linear-to-r from-rose-600 to-rose-600 p-6 text-white lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-50">
                <Sparkles size={12} />
                Free to start
              </div>
              <h2 className="text-2xl font-bold lg:text-3xl">
                Start with the free plan, then upgrade when the tools earn their
                keep.
              </h2>
              <p className="mt-2 text-sm leading-6 text-rose-100">
                Explore the dashboard, test the analysis tools, and move to a
                paid plan when you need more volume and support.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing">
                <Button variant="secondary" size="lg">
                  View pricing
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-rose-700 hover:bg-rose-50"
                >
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
}
