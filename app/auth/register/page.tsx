"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Alert, Card } from "@/components/ui";
import { useAuthStore } from "@/utils/store/authStore";
import { client } from "@/utils/api/client";
import * as z from "zod";
import RegisterForm from "./_conponents/RegisterForm";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [showPw, setShowPw] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError("");
    try {
      const { data } = await client.POST("/auth/register", {
        body: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      setAuth(data!.user, data!.access_token, data!.refresh_token);

      router.push("/dashboard");
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    }
  };

  return <RegisterForm />;
}
