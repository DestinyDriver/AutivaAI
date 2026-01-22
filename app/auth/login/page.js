"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Github, AlertCircle, CheckCircle } from "lucide-react";
import AuthCard from "@/app/components/AuthCard";
import { FcGoogle, FcGithub } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isFormValid = email && password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="Secure access to your NeuroLensAI account">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      {/* Email and Password Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end pt-2">
          <Link
            href="#"
            className="text-sm text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] font-semibold transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full h-11 mt-6 bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <Separator className="flex-1" />
        <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Social Authentication */}
      <div className=" mb-2 flex items-center gap-x-2 justify-center">
        <Button
          variant="outline"
          className=" h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5"></FcGoogle>
          Continue with Google
        </Button>

        <Button
          variant="outline"
          className=" h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Github className="w-5 h-5" />
          Continue with GitHub
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center pt-2 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
