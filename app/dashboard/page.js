"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call logout endpoint (we'll create this next)
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[var(--color-accent)] to-[color-mix(in srgb, var(--color-accent) 70%, #000)]">
                NeuroLensAI
              </h1>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-10 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900">Welcome</h2>
            <p className="text-slate-600 text-lg">
              You're now logged into NeuroLensAI
            </p>
          </div>

          {/* Empty State */}
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="bg-slate-100 p-4 rounded-full">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Dashboard Coming Soon
                </h3>
                <p className="text-slate-500 mt-2">
                  Your personalized dashboard content will appear here.
                </p>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-400">
                  Session verified • Email confirmed • Ready to use
                </p>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                🔐 Secure Session
              </h4>
              <p className="text-sm text-slate-600">
                Your session is protected with JWT tokens and HTTP-only cookies.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">
                ✉️ Email Verified
              </h4>
              <p className="text-sm text-slate-600">
                Your email has been verified and your account is ready to use.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h4 className="font-bold text-slate-900 mb-2">🚀 Ready to Go</h4>
              <p className="text-sm text-slate-600">
                Explore NeuroLensAI's features and start your AI journey.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              Questions?{" "}
              <a
                href="mailto:support@neurolensai.com"
                className="text-[var(--color-accent)] font-semibold hover:text-[color-mix(in srgb, var(--color-accent) 70%, #000)]"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
