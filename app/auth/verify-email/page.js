"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Loader } from "lucide-react";
import AuthCard from "@/app/components/AuthCard";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No verification token provided");
      return;
    }

    // Call verify-email endpoint
    const verifyEmail = async () => {
      try {
        setStatus("loading");
        const response = await fetch("/api/auth/verify-email", {
          method: "GET",
        });

        // Re-fetch with token in URL to use GET endpoint
        const url = new URL(`/api/auth/verify-email`, window.location.origin);
        url.searchParams.set("token", token);

        const verifyResponse = await fetch(url.toString());
        const data = await verifyResponse.json();

        if (verifyResponse.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
        } else {
          setStatus("error");
          setError(data.error || "Failed to verify email");
        }
      } catch (err) {
        setStatus("error");
        setError("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <AuthCard subtitle="Email Verification">
      <div className="space-y-6 text-center">
        {status === "loading" && (
          <>
            <Loader className="w-12 h-12 animate-spin text-[var( --color-accent)]/80 mx-auto" />
            <p className="text-slate-600">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Email Verified!
              </h2>
              <p className="text-slate-600">{message}</p>
            </div>

            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full h-11 bg-[var(--color-accent)]/80 hover:bg-[var(--color-accent)] text-white font-bold rounded-lg transition-all duration-300"
            >
              Go to Login
            </Button>

            <p className="text-sm text-slate-500">
              You can now sign in with your credentials
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-slate-600">{error}</p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push("/auth/signup")}
                variant="outline"
                className="w-full h-11 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all"
              >
                Try Again
              </Button>

              <p className="text-sm text-slate-500">
                If you continue to experience issues,{" "}
                <Link
                  href="mailto:support@neurolensai.com"
                  className="text-[var( --color-accent)]/80 font-semibold text-[var( --color-accent)]"
                >
                  contact support
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </AuthCard>
  );
}
