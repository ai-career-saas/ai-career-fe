"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Star,
  FileText,
  MessagesSquare,
  Target,
  Bot,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Alert } from "@/components/ui";
import { useAuthStore } from "@/utils/store/authStore";
import { client } from "@/utils/api/client";
import * as z from "zod";
import { Button } from "@radix-ui/themes";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuth } = useAuthStore();

  const [showPw, setShowPw] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError("");
    try {
      const { data } = await client.POST("/auth/login", {
        body: values,
      });

      setAuth(data!.user, data!.access_token, data!.refresh_token);

      const from = params.get("from") || "/dashboard";

      router.push(from);
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 sm:px-16 py-12">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mt-1 mb-8">
            Sign in to pick up where you left off.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitError && <Alert variant="error">{submitError}</Alert>}

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-rose-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {errors.password?.message && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="3"
              loading={isSubmitting}
              style={{ width: "100%" }}
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            New here?{" "}
            <Link
              href="/auth/register"
              className="text-rose-600 font-medium hover:underline"
            >
              Create a free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: showcase panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-950 items-center justify-center p-12 m-3 rounded-2xl">
        {/* subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          {/* Testimonial */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-rose-500 text-rose-500" />
            ))}
          </div>
          <p className="text-xl text-white font-medium leading-snug mb-4">
            &ldquo;I rebuilt my resume, ran three mock interviews, and had an
            offer within a month.&rdquo;
          </p>
          <p className="text-sm text-slate-400 mb-10">
            Priya Nair, Product Designer
          </p>

          {/* Product preview card */}
          <div className="rounded-2xl border border-white/10 bg-white/4 backdrop-blur-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Hi, I&apos;m your Career Advisor
                </p>
                <p className="text-xs text-slate-400">
                  Ask me anything about your job search
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="rounded-xl bg-white/6 border border-white/10 px-3 py-3 text-center">
                <FileText size={16} className="text-rose-400 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-300 leading-tight">
                  Resume
                  <br />
                  Analysis
                </p>
              </div>
              <div className="rounded-xl bg-white/6 border border-white/10 px-3 py-3 text-center">
                <MessagesSquare
                  size={16}
                  className="text-rose-400 mx-auto mb-1.5"
                />
                <p className="text-[11px] text-slate-300 leading-tight">
                  Interview
                  <br />
                  Prep
                </p>
              </div>
              <div className="rounded-xl bg-white/6 border border-white/10 px-3 py-3 text-center">
                <Target size={16} className="text-rose-400 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-300 leading-tight">
                  ATS
                  <br />
                  Score
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/6 border border-white/10 px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-300">Resume match score</span>
              <span className="text-sm font-semibold text-rose-400">87%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
