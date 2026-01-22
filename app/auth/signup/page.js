"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Lock,
  Github,
  Check,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import AuthCard from "@/app/components/AuthCard";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPasswordValid = password.length >= 8;
  const isPasswordMatch = password === confirmPassword && password.length > 0;
  const isFormValid =
    email && password && confirmPassword && isPasswordValid && isPasswordMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          "Account created! Check your email to verify your account...",
        );
        setTimeout(() => {
          router.push(
            `/auth/verify-pending?email=${encodeURIComponent(email)}`,
          );
        }, 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard subtitle="Create your NeuroLensAI account in seconds">
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

      {/* Email, Password, and Confirm Password Form */}
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
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          {/* Password Strength Indicator */}
          {password && (
            <div className="flex items-center gap-2 text-xs pt-1">
              {isPasswordValid ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">
                    Strong password
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-600 font-medium">
                    At least 8 characters needed
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pl-10 h-11 rounded-lg border text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all ${
                confirmPassword && !isPasswordMatch
                  ? "border-red-300 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  : "border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
            />
          </div>
          {/* Password Match Indicator */}
          {confirmPassword && (
            <div className="flex items-center gap-2 text-xs pt-1">
              {isPasswordMatch ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">
                    Passwords match
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span className="text-red-600 font-medium">
                    Passwords don't match
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Create Account Button */}
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full h-11 mt-6 bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
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
      <div className="mb-2 flex items-center gap-x-2 justify-center">
        <Button
          variant="outline"
          className=" h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FcGoogle className="size-5"></FcGoogle>
          Sign up with Google
        </Button>

        <Button
          variant="outline"
          className="h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Github className="w-5 h-5" />
          Sign up with GitHub
        </Button>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[var(--color-accent)]/80 hover:text-[var(--color-accent)] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
