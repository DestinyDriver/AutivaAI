"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, Clock } from "lucide-react";
import AuthCard from "@/app/components/AuthCard";

export default function VerifyPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  return (
    <AuthCard subtitle="Verify your email to continue">
      <div className="space-y-6">
        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="bg-indigo-100 p-4 rounded-full">
            <Mail className="w-8 h-8 text-[var(--color-accent)]/80" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">
            Check your email
          </h2>
          {email && (
            <p className="text-slate-600">
              We've sent a verification link to{" "}
              <span className="font-semibold text-slate-900">{email}</span>
            </p>
          )}
          <p className="text-sm text-slate-500">
            Click the link in the email to verify your account and get started.
          </p>
        </div>

        {/* Steps */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[var(--color-accent)]/80 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            <p className="text-sm text-slate-700">
              Check your inbox for an email from NeuroLensAI
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[var(--color-accent)]/80 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            <p className="text-sm text-slate-700">
              Click "Verify Email Address" in the email
            </p>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-[var(--color-accent)]/80 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            <p className="text-sm text-slate-700">
              Return and sign in with your credentials
            </p>
          </div>
        </div>

        {/* Expiry Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Verification link expires in <strong>24 hours</strong>
          </p>
        </div>

        {/* Resend Button (disabled for now) */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-600">
            Didn't receive the email?{" "}
            <button className="text-[var(--color-accent)]/80 font-semibold hover:text-[var(--color-accent)]  hover:underline">
              Resend verification link
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <Button
          onClick={() => router.push("/auth/login")}
          variant="outline"
          className="w-full h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all flex items-center justify-center gap-2"
        >
          Back to Sign In
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </AuthCard>
  );
}
